import catchAsyncErrors from "../middleware/catchAsyncErrors";
import stripePackage from "stripe";

const processPayment = catchAsyncErrors(async (req, res, next) => {
  const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "usd",
    metadata: {
      company: "4DMarket",
    },
  });
  res.status(200).json({
    success: true,
    client_secret: myPayment.client_secret,
  });
});

const getStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ stripeApikey: process.env.STRIPE_API_KEY });
});

module.exports = {
  processPayment,
  getStripeApiKey
}
