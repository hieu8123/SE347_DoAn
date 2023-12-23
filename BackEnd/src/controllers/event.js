import catchAsyncErrors from "../middleware/catchAsyncErrors";
import Shop from "../models/shop";
import Event from "../models/event";
import ErrorHandler from "../utils/ErrorHandler";
import fs from "fs";

// Create event
const createEvent = catchAsyncErrors(async (req, res, next) => {
  try {
    const shopId = req.body.shopId;
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return next(new ErrorHandler("Mã shop không hợp lệ!", 400));
    } else {
      const files = req.files;
      const imageUrls = files.map((file) => `${file.filename}`);

      const eventData = req.body;
      eventData.images = imageUrls;
      eventData.shop = shop;

      const product = await Event.create(eventData);

      res.status(201).json({
        success: true,
        product,
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// Get all events
const getAllEvents = catchAsyncErrors(async (req, res, next) => {
  try {
    const events = await Event.find();
    res.status(201).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// Get all events of a shop
const getAllEventsByShop = catchAsyncErrors(async (req, res, next) => {
  try {
    const events = await Event.find({ shopId: req.params.id });

    res.status(201).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// Delete event of a shop
const deleteShopEvent = catchAsyncErrors(async (req, res, next) => {
  try {
    const productId = req.params.id;
    const eventData = await Event.findById(productId);

    eventData.images.forEach((imageUrl) => {
      const filename = imageUrl;
      const filePath = `uploads/${filename}`;

      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });

    const event = await Event.findByIdAndDelete(productId);

    if (!event) {
      return next(new ErrorHandler("Không tìm thấy sự kiện với id này!", 500));
    }

    res.status(201).json({
      success: true,
      message: "Sự kiện được xóa thành công!",
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// All events for admin
const adminAllEvents = catchAsyncErrors(async (req, res, next) => {
  try {
    const events = await Event.find().sort({
      createdAt: -1,
    });
    res.status(201).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

module.exports = {
  createEvent,
  getAllEvents,
  getAllEventsByShop,
  deleteShopEvent,
  adminAllEvents,
};

