/**
 * The response must to be sent to VNPAY after receiving the IPN request
 */
export const IpnSuccess = {
  RspCode: "00",
  Message: "Confirm Success",
};

export const IpnOrderNotFound = {
  RspCode: "01",
  Message: "Order not found",
};

export const InpOrderAlreadyConfirmed = {
  RspCode: "02",
  Message: "Order already confirmed",
};

export const IpnInvalidAmount = {
  RspCode: "04",
  Message: "Invalid amount",
};

export const IpnFailChecksum = {
  RspCode: "97",
  Message: "Fail checksum",
};

export const IpnUnknownError = {
  RspCode: "99",
  Message: "Unknown error",
};
