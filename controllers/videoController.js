const catchAsyncError = require("../middleware/catchAsyncError");
const Video = require("../model/videoModae");
const ErrorHandler = require("../utils/ErrorHandler");

exports.createVideo = catchAsyncError(async (req, res, next) => {
    const video = await Video.create(req.body);
    res.status(201).json({
        success: true,
        video,
    });
});


exports.getAllVideos = catchAsyncError(async (req, res, next) => {

    const videos = await Video.find();

    res.status(200).json({
        success: true,
        videos,
    })
});

exports.deleteVideo = catchAsyncError(async (req, res, next) => {

    const video = await Video.findById(req.params.id);
    if (!video) {
        return next(new ErrorHandler("Video not found with is id", 404))
    }

    await video.deleteOne();

    res.status(200).json({
        success: true,
        message: "Video deleted successfully"
    })

})