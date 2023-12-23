import catchAsyncErrors from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import CoupounCode from "../models/coupounCode";

// Create coupon code
const createCouponCode = catchAsyncErrors(async (req, res, next) => {
  try {
    const isCoupounCodeExists = await CoupounCode.find({
      name: req.body.name,
    });

    if (isCoupounCodeExists.length !== 0) {
      return next(new ErrorHandler("Mã giảm giá đã tồn tại", 400));
    }

    const coupounCode = await CoupounCode.create(req.body);

    res.status(201).json({
      success: true,
      coupounCode,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// Get all coupons of a shop
const getCouponsByShop = catchAsyncErrors(async (req, res, next) => {
  try {
    const couponCodes = await CoupounCode.find({ shopId: req.seller.id });
    res.status(201).json({
      success: true,
      couponCodes,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// Get all coupons of a shop show
const getCouponsByShopShow = catchAsyncErrors(async (req, res, next) => {
  try {
    const couponCodes = await CoupounCode.find({ shopId: req.params.id });
    res.status(201).json({
      success: true,
      couponCodes,
    });
    console.log("couponCodes", couponCodes);
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// Delete coupon code of a shop
const deleteCouponCode = catchAsyncErrors(async (req, res, next) => {
  try {
    const couponCode = await CoupounCode.findByIdAndDelete(req.params.id);

    if (!couponCode) {
      return next(new ErrorHandler("Mã giảm giá không tồn tại", 400));
    }
    res.status(201).json({
      success: true,
      message: "Xóa thành công mã giảm giá",
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// Get coupon code value by its name
const getCouponValueByName = catchAsyncErrors(async (req, res, next) => {
  try {
    const couponCode = await CoupounCode.findOne({ name: req.params.name });

    res.status(200).json({
      success: true,
      couponCode,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

module.exports = {
  createCouponCode,
  getCouponsByShop,
  getCouponsByShopShow,
  deleteCouponCode,
  getCouponValueByName,
};
