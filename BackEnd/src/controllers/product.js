import Product from "../models/product";
import Order from "../models/order";
import Shop from "../models/shop";
import ErrorHandler from "../utils/ErrorHandler";
import fs from "fs";
import catchAsyncErrors from "../middleware/catchAsyncErrors";

// Create product
const createProduct = catchAsyncErrors(async (req, res, next) => {
    try {
        const shopId = req.body.shopId;
        const shop = await Shop.findById(shopId);
        if (!shop) {
            return next(new ErrorHandler("Mã cửa hàng không hợp lệ!", 400));
        } else {
            const files = req.files;
            const imageUrls = files.map((file) => `${file.filename}`);

            const productData = req.body;
            productData.images = imageUrls;
            productData.shop = shop;

            const product = await Product.create(productData);

            res.status(201).json({
                success: true,
                product,
            });
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Get all products of a shop
const getAllProductsOfShop = catchAsyncErrors(async (req, res, next) => {
    try {
        const products = await Product.find({ shopId: req.params.id });

        res.status(201).json({
            success: true,
            products,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Delete product of a shop
const deleteShopProduct = catchAsyncErrors(async (req, res, next) => {
    try {
        const productId = req.params.id;

        const productData = await Product.findById(productId);

        productData.images.forEach((imageUrl) => {
            const filename = imageUrl;
            const filePath = `uploads/${filename}`;

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        });

        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return next(new ErrorHandler("Không tìm thấy sản phẩm với id này!", 500));
        }

        res.status(201).json({
            success: true,
            message: "Sản phẩm được xóa thành công!",
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Get all products
const getAllProducts = catchAsyncErrors(async (req, res, next) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });

        res.status(201).json({
            success: true,
            products,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Review for a product
const createNewReview = catchAsyncErrors(async (req, res, next) => {
    try {
        const { user, rating, comment, productId, orderId } = req.body;

        const product = await Product.findById(productId);

        const review = {
            user,
            rating,
            comment,
            productId,
        };

        const existingReview = product.reviews.find((rev) => rev.user._id === req.user._id);

        if (existingReview) {
            existingReview.rating = rating;
            existingReview.comment = comment;
            existingReview.user = user;
        } else {
            product.reviews.push(review);
        }

        let avg = 0;

        product.reviews.forEach((rev) => {
            avg += rev.rating;
        });

        product.ratings = avg / product.reviews.length;

        await product.save({ validateBeforeSave: false });

        await Order.findByIdAndUpdate(
            orderId,
            { $set: { "cart.$[elem].isReviewed": true } },
            {
                arrayFilters: [{ "elem._id": productId }],
                new: true,
            }
        );

        res.status(200).json({
            success: true,
            message: "Đánh giá thành công!",
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// All products for admin
const adminAllProducts = catchAsyncErrors(async (req, res, next) => {
    try {
        const products = await Product.find().sort({
            createdAt: -1,
        });
        res.status(201).json({
            success: true,
            products,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

module.exports = {
    createProduct,
    getAllProductsOfShop,
    deleteShopProduct,
    getAllProducts,
    createNewReview,
    adminAllProducts,
};
