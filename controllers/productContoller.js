const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../model/productModel");

// create product 
exports.createProduct = catchAsyncError(async (req, res, next) => {
   
    // add cloudniry here 

    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product,
    });

})