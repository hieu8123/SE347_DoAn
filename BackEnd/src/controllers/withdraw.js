import Shop from "../models/shop";
import ErrorHandler from "../utils/ErrorHandler";
import Withdraw from "../models/withdraw";
import sendMail from "../utils/sendMail";
import catchAsyncErrors from "../middleware/catchAsyncErrors";

// Function to create withdraw request (only for sellers)
const createWithdrawRequest = catchAsyncErrors(async (req, res, next) => {
    try {
        const { amount } = req.body;
        const data = {
            seller: req.seller,
            amount,
        };

        try {
            await sendMail({
                email: req.seller.email,
                subject: "Withdraw Request",
                message: `Xin chào ${req.seller.name}, yêu cầu rút ${amount}$ của bạn đang được xử lý. Việc này cần ít nhất từ 3 đến 7 ngày để xử lý! `,
            });
            res.status(201).json({
                success: true,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }

        const withdraw = await Withdraw.create(data);
        const shop = await Shop.findById(req.seller._id);
        shop.availableBalance = shop.availableBalance - amount;
        await shop.save();

        res.status(201).json({
            success: true,
            withdraw,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Function to get all withdraw requests (for admin)
const getAllWithdrawRequests = catchAsyncErrors(async (req, res, next) => {
    try {
        const withdraws = await Withdraw.find().sort({ createdAt: -1 });
        res.status(201).json({
            success: true,
            withdraws,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Function to update withdraw request (for admin)
const updateWithdrawRequest = catchAsyncErrors(async (req, res, next) => {
    try {
        const { sellerId } = req.body;
        const withdraw = await Withdraw.findByIdAndUpdate(
            req.params.id,
            {
                status: "succeed",
                updatedAt: Date.now(),
            },
            { new: true }
        );

        const seller = await Shop.findById(sellerId);
        const transection = {
            _id: withdraw._id,
            amount: withdraw.amount,
            updatedAt: withdraw.updatedAt,
            status: withdraw.status,
        };

        seller.transections = [...seller.transections, transection];
        await seller.save();

        try {
            await sendMail({
                email: seller.email,
                subject: "Payment confirmation",
                message: `Xin chào ${seller.name}, yêu cầu rút ${withdraw.amount}$ của bạn đang được thực hiện. Thời gian giao dịch tùy thuộc vào quy định của ngân hàng, thường mất từ 3 ngày đến 7 ngày.`,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }

        res.status(201).json({
            success: true,
            withdraw,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

module.exports = {
    createWithdrawRequest,
    getAllWithdrawRequests,
    updateWithdrawRequest
};
