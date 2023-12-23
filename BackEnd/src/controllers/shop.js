import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail";
import Shop from "../models/shop";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import sendShopToken from "../utils/shopToken";

// create shop
const createShop = catchAsyncErrors(async (req, res, next) => {
  // Extract email from the request body
  const { email } = req.body;

  try {
    // Check if the email is already registered
    const sellerEmail = await Shop.findOne({ email });
    if (sellerEmail) {
      // If email is already registered, delete the uploaded file and return an error
      const filename = req.file.filename;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error deleting file" });
        }
      });
      return next(new ErrorHandler("Người dùng đã tồn tại", 400));
    }

    // Prepare seller object with extracted information
    const filename = req.file.filename;
    const fileUrl = path.join(filename);
    const seller = {
      name: req.body.name,
      email,
      password: req.body.password,
      avatar: fileUrl,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      zipCode: req.body.zipCode,
    };

    // Generate activation token
    const activationToken = createActivationToken(seller);

    // Construct activation URL
    const activationUrl = `http://localhost:3000/seller/activation/${activationToken}`;

    // Send activation email
    await sendMail({
      email: seller.email,
      subject: "Activate your Shop",
      message: `Xin chào ${seller.name}, hãy nhấp vào đường dẫn này để kích hoạt shop của bạn: ${activationUrl}`,
    });

    // Respond with success message
    res.status(201).json({
      success: true,
      message: `Kiểm tra email ${seller.email} để kích hoạt cửa hàng của bạn!`,
    });
  } catch (error) {
    // Handle errors and pass them to the next middleware
    return next(new ErrorHandler(error.message, 400));
  }
});

// Function to generate activation token
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// Activate seller account
const activateSeller = catchAsyncErrors(async (req, res, next) => {
  try {
    // Extract activation token from the request body
    const { activation_token } = req.body;

    // Verify the activation token
    const newSeller = jwt.verify(
      activation_token,
      process.env.ACTIVATION_SECRET
    );

    // Check if the token is valid
    if (!newSeller) {
      return next(new ErrorHandler("Mã không hợp lệ", 400));
    }

    // Extract information from the verified token
    const { name, email, password, avatar, zipCode, address, phoneNumber } =
      newSeller;

    // Check if the seller already exists
    let seller = await Shop.findOne({ email });

    if (seller) {
      return next(new ErrorHandler("Người dùng đã tồn tại", 400));
    }

    // Create a new seller account
    seller = await Shop.create({
      name,
      email,
      avatar,
      password,
      zipCode,
      address,
      phoneNumber,
    });

    // Send shop token and respond with success
    sendShopToken(seller, 201, res);
  } catch (error) {
    // Handle errors and pass them to the next middleware
    return next(new ErrorHandler(error.message, 500));
  }
});


// Login shop
const loginShop = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Vui lòng điền đầy đủ các trường!", 400));
    }

    const user = await Shop.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Người dùng không tồn tại!", 400));
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(
        new ErrorHandler("Vui lòng cung cấp thông tin chính xác!", 400)
      );
    }

    sendShopToken(user, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Load shop
const getSeller = catchAsyncErrors(async (req, res, next) => {
  try {
    const seller = await Shop.findById(req.seller._id);

    if (!seller) {
      return next(new ErrorHandler("Người dùng không tồn tại", 400));
    }

    res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Log out from shop
const logoutShop = catchAsyncErrors(async (req, res, next) => {
  try {
    res.cookie("seller_token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(201).json({
      success: true,
      message: "Đăng xuất thành công!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Get shop info
const getShopInfo = catchAsyncErrors(async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id);
    res.status(201).json({
      success: true,
      shop,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Update shop profile picture
const updateShopAvatar = catchAsyncErrors(async (req, res, next) => {
  try {
    const existsUser = await Shop.findById(req.seller._id);

    const existAvatarPath = `uploads/${existsUser.avatar}`;

    fs.unlinkSync(existAvatarPath);

    const fileUrl = path.join(req.file.filename);

    const seller = await Shop.findByIdAndUpdate(req.seller._id, {
      avatar: fileUrl,
    });

    res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Update seller info
const updateSellerInfo = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, description, address, phoneNumber, zipCode } = req.body;

    const shop = await Shop.findById(req.seller._id);

    if (!shop) {
      return next(new ErrorHandler("Không tìm thấy người dùng", 400));
    }

    shop.name = name;
    shop.description = description;
    shop.address = address;
    shop.phoneNumber = phoneNumber;
    shop.zipCode = zipCode;

    await shop.save();

    res.status(201).json({
      success: true,
      shop,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// All sellers for admin
const adminAllSellers = catchAsyncErrors(async (req, res, next) => {
  try {
    const sellers = await Shop.find().sort({
      createdAt: -1,
    });
    res.status(201).json({
      success: true,
      sellers,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Delete seller by admin
const deleteSeller = catchAsyncErrors(async (req, res, next) => {
  try {
    const seller = await Shop.findById(req.params.id);

    if (!seller) {
      return next(new ErrorHandler("Người bán không có sẵn với id này", 400));
    }

    await Shop.findByIdAndDelete(req.params.id);

    res.status(201).json({
      success: true,
      message: "Người bán được xóa thành công!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Update seller withdraw methods
const updatePaymentMethods = catchAsyncErrors(async (req, res, next) => {
  try {
    const { withdrawMethod } = req.body;

    const seller = await Shop.findByIdAndUpdate(req.seller._id, {
      withdrawMethod,
    });

    res.status(201).json({
      success: true,
      seller,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Delete seller withdraw methods - only seller
const deleteWithdrawMethod = catchAsyncErrors(async (req, res, next) => {
  try {
    const seller = await Shop.findById(req.seller._id);

    if (!seller) {
      return next(
        new ErrorHandler("Không tìm thấy người bán với id này!", 400)
      );
    }

    seller.withdrawMethod = null;

    await seller.save();

    res.status(201).json({
      success: true,
      seller,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Forgot password
const shopForgotPassword = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email } = req.body;
    const shopEmail = await Shop.findOne({ email });

    if (!shopEmail) {
      return next(new ErrorHandler("Người dùng không tồn tại", 400));
    }

    const activationUrl = `http://localhost:3000/shop-reset-password/${shopEmail._id}`;

    try {
      await sendMail({
        email: shopEmail.email,
        subject: "Reset password",
        message: `Hãy nhấp vào đường dẫn này để lấy lại mật khẩu của bạn: ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `Kiểm tra email ${shopEmail.email} để lấy lại mật khẩu của bạn!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Reset password
const resetPasswordShop = catchAsyncErrors(async (req, res, next) => {
  try {
    let shopId = req.body.id;

    const shop = await Shop.findOne({ _id: shopId });

    if (!shop) {
      return next(new ErrorHandler("Không tìm thấy user", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler("Mật khẩu không trùng khớp!", 400));
    }

    shop.password = req.body.newPassword;

    await shop.save();

    return res.status(200).json({
      success: true,
      message: "Cập nhật mật khẩu thành công!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

module.exports = {
  createShop,
  activateSeller,
  loginShop,
  getSeller,
  logoutShop,
  getShopInfo,
  updateShopAvatar,
  updateSellerInfo,
  adminAllSellers,
  deleteSeller,
  updatePaymentMethods,
  deleteWithdrawMethod,
  shopForgotPassword,
  resetPasswordShop,
};