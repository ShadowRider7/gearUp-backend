import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { RentalStatus } from "../../../generated/prisma/enums";

export const handleCheckoutCompleted = async (
  session: Stripe.Checkout.Session,
) => {
  try {
    const orderId = session.metadata?.orderId;
    const stripeCustomerId = session.customer as string;
    const stripePaymentIntentId = session.payment_intent as string;

    if (!orderId || !stripeCustomerId || !stripePaymentIntentId) {
      throw new Error("Missing required checkout session fields");
    }

    const stripePayment = await stripe.paymentIntents.retrieve(
      stripePaymentIntentId,
    );

    await prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: {
          rentalOrderId: orderId,
          stripeCustomerId,
          stripePaymentIntentId,
          amount: stripePayment.amount / 100,
        },
      });

      await tx.rentalOrder.update({
        where: { id: orderId },
        data: { status: RentalStatus.PAID },
      });
    });
  } catch (err) {
    console.error("Webhook payment handler failed:", err);
    throw err;
  }
};

export const handleCheckoutFailedOrExpired = async (
  session: Stripe.Checkout.Session,
) => {
  try {
    const orderId = session.metadata?.orderId;
    if (!orderId) return;

    await prisma.rentalOrder.update({
      where: { id: orderId },
      data: { status: RentalStatus.CONFIRMED },
    });
  } catch (err) {
    console.error("Failed to reset order status from webhook:", err);
  }
};
