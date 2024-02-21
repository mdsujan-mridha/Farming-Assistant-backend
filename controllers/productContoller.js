const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../model/productModel");
const ApiFeatures = require("../utils/apiFetures");
const ErrorHandler = require("../utils/ErrorHandler");
const cloudinary = require("cloudinary");
// create product --admin or user

exports.createProduct = catchAsyncError(async (req, res, next) => {

    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }
    const imageLink = [];
    for (let i = 0; i < images?.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });
        imageLink.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }
    req.body.images = imageLink;
    req.body.user = req.user?.id;

    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product,
    })

});

exports.getAllProducts = catchAsyncError(async (req, res, next) => {

    const resultPerPage = 18;
    const productsCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter();

    let products = await apiFeature.query;
    let filteredProductsCount = products.length;
    apiFeature.pagination(resultPerPage);

    products = await apiFeature.query.clone();

    res.status(200).json({
        success: true,
        products,
        resultPerPage,
        productsCount,
        filteredProductsCount,
    });
});

exports.getProductDetails = catchAsyncError(async (req, res, next) => {


    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler("Product not found!", 404));
    }

    res.status(200).json({
        success: true,
        product,
    });

});

// update product by admin 
exports.updateProduct = catchAsyncError(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found!", 404));
    }
    product = await Product.findByIdAndUpdate(req.params.id,
        req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        product,
    })
});
// deleteProduct by admin 
exports.deleteProduct = catchAsyncError(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
})

// get all product by admin 
exports.getAdminProduct = catchAsyncError(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products,
    })
})