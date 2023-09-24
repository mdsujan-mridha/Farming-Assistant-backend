const catchAsyncError = require("../middleware/catchAsyncError");
const Post = require("../model/postModel");


// create post 
exports.createPost = catchAsyncError(async (req, res, next) => {

    // add cloudniry 
    const post = await Post.create(req.body);
    res.status(201).json({
        success: true,
        post
    })

})