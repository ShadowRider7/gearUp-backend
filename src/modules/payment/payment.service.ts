import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { RentalStatus } from "../../../generated/prisma/enums";
import {
  handleCheckoutCompleted,
  handleCheckoutFailedOrExpired,
} from "./payment.utils";

const createPaymentIntent = async (userId: string, rentalOrderId: string) => {
  const order = await prisma.rentalOrder.findUnique({
    where: {
      id: rentalOrderId,
      customerId: userId,
    },
    include: {
      payment: true,
      customer: true,
    },
  });

  if (!order) {
    throw new Error("This is not your order");
  }

  const allowedStatuses: RentalStatus[] = [
    RentalStatus.CONFIRMED,
    RentalStatus.PAYMENT_INITIATED,
  ];

  if (!allowedStatuses.includes(order.status)) {
    throw new Error(
      "Provider hasn't confirmed yet or order is already processed",
    );
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

  const THIRTY_MINUTES_IN_SECONDS = 30 * 60;
  const expiresAt = Math.floor(Date.now() / 1000) + THIRTY_MINUTES_IN_SECONDS;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: `Rental Order ${order.id}`,
          },
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
    metadata: {
      customerId: order.customerId,
      orderId: order.id,
    },
    expires_at: expiresAt,
  });

  await prisma.rentalOrder.update({
    where: { id: rentalOrderId },
    data: { status: RentalStatus.PAYMENT_INITIATED },
  });

  return {
    paymentUrl: session.url,
  };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret!;
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object);
      break;
    case "checkout.session.expired":
    case "checkout.session.async_payment_failed":
      await handleCheckoutFailedOrExpired(event.data.object);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
      break;
  }
};

const paymentHistory = async (userId: string) => {
  const paymentHistory = await prisma.payment.findMany({
    where: {
      rentalOrder: {
        customerId: userId,
      },
    },
    include: {
      rentalOrder: {
        include: {
          gearItem: true,
        },
      },
    },
  });
  return paymentHistory;
};
export const paymentService = {
  createPaymentIntent,
  handleWebhook,
  paymentHistory,
};
