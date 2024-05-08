import express from "express";
import { isAdmin, isSeller, isAuthenticated } from "../middleware/auth";
import upload from "../utils/upload";
import conversation from "../controllers/conversation";
import coupounCode from "../controllers/coupounCode";
import event from "../controllers/event";
import message from "../controllers/message";
import order from "../controllers/order";
import payment from "../controllers/payment";
import product from "../controllers/product";
import shop from "../controllers/shop";
import user from "../controllers/user";
import withdraw from "../controllers/withdraw";

const router = express.Router();

const initWebRoutes = (app) => {
  //user
  app.post("/api/v2/user/create-user", upload.single("file"), user.createUser);
  app.post("/api/v2/user/activation", user.activateUser);
  app.post("/api/v2/user/reset-password", user.resetPassword);
  app.post("/api/v2/user/login-user", user.loginUser);
  app.get("/api/v2/user/getuser", isAuthenticated, user.getUser);
  app.get("/api/v2/user/logout", user.logoutUser);
  app.put(
    "/api/v2/user/update-user-info",
    isAuthenticated,
    user.updateUserInfo
  );
  app.put(
    "/api/v2/user/update-avatar",
    [isAuthenticated, upload.single("image")],
    user.updateUserAvatar
  );
  app.put(
    "/api/v2/user/update-user-addresses",
    isAuthenticated,
    user.updateUserAddresses
  );
  app.delete(
    "/api/v2/user/delete-user-address/:id",
    isAuthenticated,
    user.deleteUserAddress
  );
  app.put(
    "/api/v2/user/update-user-password",
    isAuthenticated,
    user.updateUserPassword
  );
  app.put(
    "/api/v2/user/reset-password-user",
    isAuthenticated,
    user.resetPasswordUser
  );
  app.get("/api/v2/user/user-info/:id", user.getUserInfo);
  app.get(
    "/api/v2/user/admin-all-users",
    [isAuthenticated, isAdmin("Admin")],
    user.adminAllUsers
  );
  app.delete(
    "/api/v2/user/delete-user/:id",
    [isAuthenticated, isAdmin("Admin")],
    user.deleteAdminUser
  );
  app.post("/api/v2/user/forgot-password", user.forgotPassword);

  //conversation
  app.post(
    "/api/v2/conversation/create-new-conversation",
    conversation.createNewConversation
  );
  app.get(
    "/api/v2/conversation/get-all-conversation-seller/:id",
    isSeller,
    conversation.getAllSellerConversations
  );
  app.get(
    "/api/v2/conversation/get-all-conversation-user/:id",
    isAuthenticated,
    conversation.getAllUserConversations
  );
  app.put(
    "/api/v2/conversation/update-last-message/:id",
    conversation.updateLastMessage
  );

  //message
  app.post(
    "/api/v2/message/create-new-message",
    upload.single("images"),
    message.createNewMessage
  );
  app.get("/api/v2/message/get-all-messages/:id", message.getAllMessages);

  //order
  app.post("/api/v2/order/create-order", order.createOrder);
  app.get("/api/v2/order/get-all-orders/:userId", order.getAllOrdersByUser);
  app.get(
    "/api/v2/order/get-seller-all-orders/:shopId",
    order.getSellerAllOrders
  );
  app.put("/api/v2/order/update-order-status/:id", order.updateOrderStatus);
  app.put("/api/v2/order/order-refund/:id", order.orderRefund);
  app.put("/api/v2/order/order-refund-success/:id", order.orderRefundSuccess);
  app.get("/api/v2/order/admin-all-orders", order.adminAllOrders);

  //shop
  app.post(
    "/api/v2/shop/create-product",
    upload.array("images"),
    shop.createShop
  );
  app.get("/api/v2/shop/get-all-products-shop/:id", shop.activateSeller);
  app.post("/api/v2/shop/login-shop", shop.loginShop);
  app.get("/api/v2/shop/getSeller", isSeller, shop.getSeller);
  app.get("/api/v2/shop/logout", shop.logoutShop);
  app.get("/api/v2/shop/get-shop-info/:id", shop.getShopInfo);
  app.put(
    "/api/v2/shop/update-shop-avatar",
    [isSeller, upload.single("image")],
    shop.updateShopAvatar
  );
  app.put("/api/v2/shop/update-seller-info", isSeller, shop.updateSellerInfo);
  app.get(
    "/api/v2/shop/admin-all-sellers",
    [isAuthenticated, isAdmin("Admin")],
    shop.adminAllSellers
  );
  app.delete(
    "/api/v2/shop/delete-seller/:id",
    [isAuthenticated, isAdmin("Admin")],
    shop.deleteSeller
  );
  app.put(
    "/api/v2/shop/update-payment-methods",
    isSeller,
    shop.updatePaymentMethods
  );
  app.delete(
    "/api/v2/shop/delete-withdraw-method/",
    isSeller,
    shop.deleteWithdrawMethod
  );
  app.post("/api/v2/shop/shop-forgot-password", shop.shopForgotPassword);
  app.put("/api/v2/shop/reset-password-shop", shop.resetPasswordShop);

  //product
  app.post(
    "/api/v2/product/create-product",
    upload.array("images"),
    product.createProduct
  );
  app.get(
    "/api/v2/product/get-all-products-shop/:id",
    product.getAllProductsOfShop
  );
  app.delete(
    "/api/v2/product/delete-shop-product/:id",
    isSeller,
    product.deleteShopProduct
  );
  app.get("/api/v2/product/get-all-products", product.getAllProducts);
  app.put(
    "/api/v2/product/create-new-review",
    isAuthenticated,
    product.createNewReview
  );
  app.get(
    "/api/v2/product/admin-all-products",
    isAuthenticated,
    isAdmin("Admin"),
    product.adminAllProducts
  );

  //event
  app.post(
    "/api/v2/event/create-event",
    upload.array("images"),
    event.createEvent
  );
  app.get("/api/v2/event/get-all-events", event.getAllEvents);
  app.get("/api/v2/event/get-all-events/:id", event.getAllEventsByShop);
  app.delete("/api/v2/event/delete-shop-event/:id", event.deleteShopEvent);
  app.get(
    "/api/v2/event/admin-all-events",
    [isAuthenticated, isAdmin("Admin")],
    event.adminAllEvents
  );

  //coupon
  app.post(
    "/api/v2/coupon/create-coupon-code",
    isSeller,
    coupounCode.createCouponCode
  );
  app.get(
    "/api/v2/coupon/get-coupon/:id",
    isSeller,
    coupounCode.getCouponsByShop
  );
  app.get(
    "/api/v2/coupon/get-coupon-show/:id",
    coupounCode.getCouponsByShopShow
  );
  app.delete(
    "/api/v2/coupon/delete-coupon/:id",
    isSeller,
    coupounCode.deleteCouponCode
  );
  app.get(
    "/api/v2/coupon/get-coupon-value/:name",
    coupounCode.getCouponValueByName
  );

  //payment
  app.post("/api/v2/payment/process", payment.processPayment);
  app.get("/api/v2/payment/stripeapikey", payment.getStripeApiKey);
  app.post("/api/v2/payment/process-vnpay", payment.createPaymentVNPayURL);
  app.get("/api/v2/payment/vnpay-return", payment.paymentVNPayReturn);
  app.get("/api/v2/payment/vnpay-ipn", payment.paymentVNPayIpn);

  //withdraw
  router.post(
    "/api/v2/withdraw/create-withdraw-request",
    isSeller,
    withdraw.createWithdrawRequest
  );
  router.get(
    "/api/v2/withdraw/get-all-withdraw-request",
    [isAuthenticated, isAdmin("Admin")],
    withdraw.getAllWithdrawRequests
  );
  router.put(
    "/api/v2/withdraw/update-withdraw-request/:id",
    [isAuthenticated, isAdmin("Admin")],
    withdraw.updateWithdrawRequest
  );

  //app
  return app.use("/", router);
};

module.exports = initWebRoutes;
