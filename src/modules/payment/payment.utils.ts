import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { PaymentStatus, RentalStatus } from "../../../generated/prisma/enums";

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
      await tx.payment.upsert({
        where: {
          rentalOrderId: orderId,
        },
        create: {
          rentalOrderId: orderId,
          stripeCustomerId,
          stripePaymentIntentId,
          amount: stripePayment.amount / 100,
          status: PaymentStatus.COMPLETED,
        },
        update: {
          rentalOrderId: orderId,
          stripeCustomerId,
          stripePaymentIntentId,
          amount: stripePayment.amount / 100,
          status: PaymentStatus.COMPLETED,
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
    const stripeCustomerId = (session.customer as string) || "GUEST";
    const stripePaymentIntentId = session.payment_intent as string | null;

    if (!orderId) {
      throw new Error("Missing required orderId in session metadata");
    }

    const amount = (session.amount_total || 0) / 100;

    const targetRentalStatus =
      session.status === "expired"
        ? RentalStatus.CONFIRMED
        : RentalStatus.PAYMENT_INITIATED;

    await prisma.$transaction(async (tx) => {
      await tx.rentalOrder.update({
        where: { id: orderId },
        data: { status: targetRentalStatus },
      });

      await tx.payment.upsert({
        where: {
          rentalOrderId: orderId,
        },
        create: {
          rentalOrderId: orderId,
          stripeCustomerId,
          stripePaymentIntentId: stripePaymentIntentId || "NO_INTENT_EXPIRED",
          status: PaymentStatus.FAILED,
          amount: amount,
        },
        update: {
          stripeCustomerId,
          stripePaymentIntentId: stripePaymentIntentId || "NO_INTENT_EXPIRED",
          status: PaymentStatus.FAILED,
          amount: amount,
        },
      });
    });
  } catch (err) {
    console.error("Failed to reset order status from webhook:", err);
    throw err;
  }
};
