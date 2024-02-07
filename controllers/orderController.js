const catchAsyncError = require("../middleware/catchAsyncError");
const Order = require("../model/orderModel");
const ErrorHandler = require("../utils/ErrorHandler");
const Product = require("../model/productModel");

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

//  get a single order 
exports.getOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
        return next(new ErrorHandler("No order found", 404));
    }
    res.status(200).json({
        success: true,
        order,
    })

})
// get oder items by admin 
exports.getAllOrder = catchAsyncError(async (req, res, next) => {

    const orders = await Order.find();
    let totalAmount = 0;
    // total amount will increase with each and every items 
    orders.forEach((order) => {
        {
            totalAmount += order.totalPrice;
        }
    });
    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    })
})
// get logged user order
exports.myOrders = catchAsyncError(async (req, res, next) => {

    const orders = await Order.find({ user: req.user._id });
    res.status(200).json({
        success: true,
        orders,
    })
});

// delete order  by admin 
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler("No order found", 404));
    }
    await order.deleteOne();
    res.status(200).json({
        success: true,
        message: "Order deleted successfully",
    });
});

// update order status by  admin 
exports.updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler("No order found", 404));
    }

    if (req.body.orderStatus === "Delivered") {
        return next(new ErrorHandler("Order already delivered", 400));

    }
    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (o) => {
            await updateStock(o.product, o.quantity);
        });
    }
    order.orderStatus = req.body.status;
    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
    });

});

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.Stock -= quantity;
    await product.save({ validateBeforeSave: false });
}