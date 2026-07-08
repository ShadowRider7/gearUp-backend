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

    await prisma.payment.create({
      data: {
        rentalOrderId: orderId,
        stripeCustomerId,
        stripePaymentIntentId,
        amount: stripePayment.amount / 100,
      },
    });

    await prisma.rentalOrder.update({
      where: {
        id: orderId,
      },
      data: {
        status: RentalStatus.PAID,
      },
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};
