import path from "path";
import User from "../models/user";
import ErrorHandler from "../utils/ErrorHandler";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import fs from "fs";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail";
import sendToken from "../utils/jwtToken";

// Function to handle user registration
const createUser = catchAsyncErrors(async (req, res, next) => {
  console.log("Received data from the frontend:", req.body);
  try {
    const { name, email, password } = req.body;
    const userEmail = await User.findOne({ email });

    if (userEmail) {
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

    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const user = {
      name: name,
      email: email,
      password: password,
      avatar: fileUrl,
    };

    const activationToken = createActivationToken(user);

    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        message: `Xin chào ${user.name}, hãy nhấp vào đường dẫn này để kích hoạt tài khoản của bạn: ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `Kiểm tra email ${user.email} để kích hoạt tài khoản của bạn!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Function to create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

// Function to handle user activation
const activateUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { activation_token } = req.body;

    const newUser = jwt.verify(
      activation_token,
      process.env.ACTIVATION_SECRET
    );

    if (!newUser) {
      return next(new ErrorHandler("Mã không hợp lệ", 400));
    }
    const { name, email, password, avatar } = newUser;

    let user = await User.findOne({ email });

    if (user) {
      return next(new ErrorHandler("Người dùng đã tồn tại", 400));
    }
    user = await User.create({
      name,
      email,
      avatar,
      password,
    });

    sendToken(user, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Function to handle password reset activation
const resetPassword = catchAsyncErrors(async (req, res, next) => {
  try {
    const { activation_token } = req.body;

    const newUser = jwt.verify(
      activation_token,
      process.env.ACTIVATION_SECRET
    );

    if (!newUser) {
      return next(new ErrorHandler("Mã không hợp lệ", 400));
    }
    const { name, email, password, avatar } = newUser;

    let user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler("Người dùng không tồn tại", 400));
    }

    sendToken(user, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// login user
const loginUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Vui lòng điền đầy đủ các trường!", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Người dùng không tồn tại!", 400));
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(
        new ErrorHandler("Vui lòng cung cấp thông tin chính xác!", 400)
      );
    }

    sendToken(user, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// load user
const getUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorHandler("Người dùng không tồn tại", 400));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// log out user
const logoutUser = catchAsyncErrors(async (req, res, next) => {
  try {
    res.cookie("token", null, {
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

// update user info
const updateUserInfo = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password, phoneNumber, name } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Không tìm thấy người dùng", 400));
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(
        new ErrorHandler("Vui lòng cung cấp thông tin chính xác", 400)
      );
    }

    user.name = name;
    user.email = email;
    user.phoneNumber = phoneNumber;

    await user.save();

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// update user avatar
const updateUserAvatar = catchAsyncErrors(async (req, res, next) => {
  try {
    const existsUser = await User.findById(req.user.id);

    const existAvatarPath = `uploads/${existsUser.avatar}`;

    fs.unlinkSync(existAvatarPath);

    const fileUrl = path.join(req.file.filename);

    const user = await User.findByIdAndUpdate(req.user.id, {
      avatar: fileUrl,
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// update user addresses
const updateUserAddresses = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    const sameTypeAddress = user.addresses.find(
      (address) => address.addressType === req.body.addressType
    );
    if (sameTypeAddress) {
      return next(
        new ErrorHandler(`${req.body.addressType} address already exists`)
      );
    }

    const existsAddress = user.addresses.find(
      (address) => address._id === req.body._id
    );

    if (existsAddress) {
      Object.assign(existsAddress, req.body);
    } else {
      // add the new address to the array
      user.addresses.push(req.body);
    }

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// delete user address
const deleteUserAddress = catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.id;

    await User.updateOne(
      { _id: userId },
      { $pull: { addresses: { _id: addressId } } }
    );

    const user = await User.findById(userId);

    res.status(200).json({ success: true, user });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// update user password
const updateUserPassword = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Mật khẩu cũ không chính xác!", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler("Mật khẩu không trùng khớp!", 400));
    }
    user.password = req.body.newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật mật khẩu thành công!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// reset-forgot-password
const resetPasswordUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.body.id;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return next(new ErrorHandler("Không tìm thấy user", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler("Mật khẩu không trùng khớp!", 400));
    }
    user.password = req.body.newPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Cập nhật mật khẩu thành công!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// find user information with the userId
const getUserInfo = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// all users --- for admin
const adminAllUsers = catchAsyncErrors(async (req, res, next) => {
  try {
    const users = await User.find().sort({
      createdAt: -1,
    });
    res.status(201).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// delete users --- admin
const deleteAdminUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorHandler("Người dùng không khả dụng với id này", 400)
      );
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(201).json({
      success: true,
      message: "Người dùng xóa thành công!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler("Người dùng không tồn tại", 400));
    }

    const resetToken = createResetToken(user);

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Reset password",
        message: `Hãy nhấp vào đường dẫn này để lấy lại mật khẩu của bạn: ${resetUrl}`,
      });

      res.status(201).json({
        success: true,
        message: `Kiểm tra email ${user.email} để lấy lại mật khẩu của bạn!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// create reset token
const createResetToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.RESET_SECRET, {
    expiresIn: "15m",
  });
};

module.exports = {
  createUser,
  createActivationToken,
  activateUser,
  resetPassword,
  loginUser,
  getUser,
  logoutUser,
  updateUserInfo,
  updateUserAvatar,
  updateUserAddresses,
  deleteUserAddress,
  updateUserPassword,
  resetPasswordUser,
  getUserInfo,
  adminAllUsers,
  deleteAdminUser,
  forgotPassword
};