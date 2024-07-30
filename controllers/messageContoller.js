const catchAsyncError = require("../middleware/catchAsyncError");

const Message = require("../model/messageModel");
const ErrorHandler = require("../utils/ErrorHandler");


exports.newMessage = catchAsyncError(async (req, res, next) => {

    const message = await Message.create(req.body);

    if (!message) {
        return next(new ErrorHandler("Message not sent", 404));
    }

    res.status(201).json({
        success: true,
        message: "Message sent successfully",
        message,
    })
});

// get all message by admin
exports.getAllMessage = catchAsyncError(async (req, res, next) => {
    const messages = await Message.find();
    res.status(200).json({
        success: true,
        messages,
    });
});

// get a single message 
exports.getMessage = catchAsyncError(async (req, res, next) => {
    const message = await Message.findById(req.params.id);
    if (!message) {
        return next(new ErrorHandler("No message found", 404));
    }
    res.status(200).json({
        success: true,
        message,
    })
})

// delete message 
exports.deleteMessage = catchAsyncError(async (req, res, next) => {
    const message = await Message.findById(req.params.id);
    if (!message) {
        return next(new ErrorHandler("No message found", 404));
    }
    await message.deleteOne();
    res.status(200).json({
        success: true,
        message: "Message deleted successfully",
    });
});
