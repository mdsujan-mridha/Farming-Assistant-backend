


const User = require("../model/userModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/ErrorHandler");
const cloudinary = require("cloudinary");
const sendEmail = require("../utils/sendEmail")

//register new user 
exports.registerUser = catchAsyncError(async (req, res, next) => {

    const { name, email, password } = req.body;
    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: "sample id",
            url: "sample url",
        }
    });
    sendToken(user, 201, res);

});


// login controller 

exports.login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("অনুগ্রহ করে আপনার সঠিক ই-মেইল এবং পাসওয়ার্ড দিন"));

    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("এই ই-মেইল দিয়ে আপনাকে খুজে পাওয়া যাচ্ছে না,অনুগ্রহ করে সঠিক ই-মেইল এবং পাসওয়ার্ড দিন"));

    }
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("এই ই-মেইল দিয়ে আপনাকে খুজে পাওয়া যাচ্ছে না,অনুগ্রহ করে সঠিক ই-মেইল এবং পাসওয়ার্ড দিন"));
    }
    sendToken(user, 200, res);
});

//logout user 

exports.logout = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true, //this method only work localhost because localhost is not secure and it work with http not https
        // secure:true //this function only use for https
    });
    res.status(200).json({
        success: true,
        message: "Logged out",
    })
});

// get a single user 
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    })
});

// forgot password 
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("এই ই-মেইলের জন্য কোন ইউজার নেই", 404));
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    // this link will use for deployment 
    // const resetUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
    // this link will use for local host
    const resetPasswordUrl = `${process.env.FRONT_END}/password/reset/${resetToken}`;
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
    try {
        await sendEmail({
            email: user.email,
            subject: "Password reset token",
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} with further instructions`,
        })

    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
});

// Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(
            new ErrorHandler(
                "Reset Password Token is invalid or has been expired",
                400
            )
        );
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not password", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
});

// update user password 
// update user password 

exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("password does not match", 400));

    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);

});

exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    //  add cloudinary 
    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);
        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avater",
            width: 150,
            crop: "scale",
        });
        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        user,
    })
});
// get all user by admin 
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users,
    })
});

// update user role 
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});

// delete user
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    // there user params bcz this request will send by admin bt is this request will send bt user then i write (req.user.id)
    if (!user) {
        {
            return next(new ErrorHandler(`User does not exist with id : ${req.params.id}`, 400));
        }
    }
    await user.remove();
    res.status(200).json({
        success: true,
        message: "user deleted Successfully",
    })
})



