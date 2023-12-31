const catchAsyncError = require("../middleware/catchAsyncError");
const Order = require("../model/orderModel");

exports.newOrder = catchAsyncError(async (req, res, next) => {

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
 

    } = req.body;

const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
});

res.status(201).json({
    success: true,
    order,
});
});

