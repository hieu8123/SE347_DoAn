import catchAsyncErrors from "../middleware/catchAsyncErrors";
import stripePackage from "stripe";
import vnpay from "../configs/VNPayConfig";

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

function generateOrderId() {
  return "ORDER" + Math.random().toString(36).substr(2, 9).toUpperCase();
}

const createPaymentVNPayURL = catchAsyncErrors(async (req, res, next) => {
  console.log(req.body.amount);
  const urlString = vnpay.buildPaymentUrl({
    vnp_Amount: req.body.amount,
    vnp_IpAddr: "1.1.1.1",
    vnp_TxnRef: req.body.orderID || generateOrderId(),
    vnp_OrderInfo: "Thanh toan don hang PaoShop",
    vnp_OrderType: "other",
    vnp_ReturnUrl: `http://localhost:3000/order/success`,
  });

  return res.json({ paymentUrl: urlString });
});

const paymentVNPayIpn = catchAsyncErrors(async (req, res, next) => {
  try {
    const verify = vnpay.verifyIpnCall({ ...req.query });
    if (!verify.isVerified) {
      return res.json(IpnFailChecksum);
    }

    // Find the order in your database
    // This is the sample order that you need to check the status, amount, etc.
    const foundOrder = {
      orderId: "112",
      amount: 1000000,
      status: "pending",
    };

    // If the order is not found, or the order id is not matched
    // You can use the orderId to find the order in your database
    if (!foundOrder || verify.vnp_TxnRef !== foundOrder.orderId) {
      return res.json(IpnOrderNotFound);
    }

    // If the amount is not matched
    if (verify.vnp_Amount !== foundOrder.amount) {
      return res.json(IpnInvalidAmount);
    }

    // If the order is already confirmed
    if (foundOrder.status === "completed") {
      return res.json(InpOrderAlreadyConfirmed);
    }

    // Update the order status to completed
    // Eg: Update the order status in your database
    foundOrder.status = "completed";

    // Then return the success response to VNPay
    return res.json(IpnSuccess);
  } catch (error) {
    console.log(`verify error: ${error}`);
    return res.json(IpnUnknownError);
  }
});

const paymentVNPayReturn = async (req, res, next) => {
  let verify;
  try {
    verify = vnpay.verifyReturnUrl({ ...req.query });
    if (!verify.isVerified) {
      return res.status(200).json({
        message: verify?.message ?? "Payment failed!",
        status: verify.isSuccess,
      });
    }
  } catch (error) {
    console.log(`verify error: ${error}`);
    return res.status(400).json({ message: "verify error", status: false });
  }

  return res.status(200).json({
    message: verify?.message ?? "Payment successful!",
    status: verify.isSuccess,
  });
};

module.exports = {
  processPayment,
  getStripeApiKey,
  createPaymentVNPayURL,
  paymentVNPayIpn,
  paymentVNPayReturn,
};
