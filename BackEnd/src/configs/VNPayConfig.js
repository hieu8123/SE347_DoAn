import { VNPay } from "vnpay";

const vnpay = new VNPay({
  tmnCode: process.env.VNP_TMNCODE || "69YPCN0Y",
  secureSecret: process.env.HASHSECRET || "ZKRZHJFOXEXTFNVNNQHNPNQEDUJLWESQ",
  vnpayHost: "https://sandbox.vnpayment.vn",
  VnpCurrCode: "VND",
  testMode: true, // optional
  hashAlgorithm: "SHA512", // optional
});

export default vnpay;
