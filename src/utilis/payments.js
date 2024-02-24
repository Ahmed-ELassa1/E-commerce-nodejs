import Stripe from "stripe";

const payment = async ({
  payment_method_types = ["card"],
  mode = "payment",
  success_url = process.env.SUCCESS_URL,
  cancel_url = process.env.CANCEL_URL,
  discounts = [],
  line_items = [],
  customer_email,
  metadata = {},
} = {}) => {
  const stripe = new Stripe(process.env.PAYMENT_API_KEY);
  const session = await stripe.checkout.sessions.create({
    cancel_url,
    payment_method_types,
    mode,
    success_url,
    metadata,
    discounts,
    line_items,
    customer_email,
  });
  return session;
};
export default payment;
