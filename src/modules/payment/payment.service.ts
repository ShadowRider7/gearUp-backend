import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { handleCheckoutCompleted } from "./payment.utils";

const createPaymentIntent = async (userId: string, rentalOrderId: string) => {
  const order = await prisma.rentalOrder.findUniqueOrThrow({
    where: {
      id: rentalOrderId,
      customerId: userId,
    },
    include: {
      payment: true,
      customer: true,
    },
  });

  if (order.status !== "CONFIRMED") {
    throw new Error("provider hasn't confirmed yet");
  }

  let stripeCustomerId = order.payment?.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: order.customer.email,
      name: order.customer.name,
      metadata: { userId: order.customerId },
    });
    stripeCustomerId = customer.id;
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: { name: `Rental Order ${order.id}` },
          unit_amount: Math.round(order.totalAmount * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer: stripeCustomerId,
    payment_method_types: ["card"],
    success_url: `${config.app_url}/api/rentals?success=true`,
    cancel_url: `${config.app_url}/api/payment?success=false`,
    metadata: { customerId: order.customerId, orderId: order.id },
  });

  return { paymentUrl: session.url };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret;
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );

  switch (event.type) {
    case "checkout.session.completed":
      try {
        await handleCheckoutCompleted(event.data.object);
      } catch (err) {
        console.error("Webhook processing failed:", err);
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
      break;
  }
};
export const paymentService = {
  createPaymentIntent,
  handleWebhook,
};
