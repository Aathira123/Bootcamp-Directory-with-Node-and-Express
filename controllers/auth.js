const User = require('../modals/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
// @desc  Register USER
// @route  POST /api/v1/auth/register

// @access Public
exports.registerUser = asyncHandler(async(req,res,next)=>{
   const {name, email , password, role} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        role
    })
    sendTokenResponse(user, 200, res);

})

// @desc  LOGIN USER
// @route  POST /api/v1/auth/login

// @access Public
exports.login = asyncHandler(async(req,res,next)=>{
    const {email,password} = req.body;
    //Validate email and password
    if(!email || !password){
        return next (new ErrorResponse('Please provide an Email and Password to login', 400));
    }
    //Check for user
    const user = await User.findOne({ email }).select('+password');
    if(!user){
        return next (new ErrorResponse('Incorrect Email', 401));
    }
    // Check is passwords are same
    const isMatch = await user.matchPassword(password);
    if(!isMatch){
        return next (new ErrorResponse
            ('Incorrect Password', 401));
    }
   sendTokenResponse(user, 200, res);
 })

 // @desc  GET current logged in user
// @route  POST /api/v1/auth/me

// @access Private
exports.getMe = asyncHandler(async(req,res,next)=>{
    const currentuser= await User.findById(req.user.id);

    
    res.status(200).json({
        success:true,
        data: currentuser
    })
})

 // @desc  Forgot password
// @route  POST /api/v1/auth/forgotPassword

// @access Public
exports.forgotPassword = asyncHandler(async(req,res,next)=>{
    const user= await User.findOne({email: req.body.email});
    if(!user){
        return next(new ErrorResponse('No user with that email',404));
    }
    // get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save();
    // Create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`
    const message = `You are receiving this email because you have requested the 
    reset of a password. Please make a put request to : \n\n ${resetUrl}
    `;
    try{
await sendEmail({
    email: req.body.email,
    message,
    subject: 'Reset Password' 
})
res.status(200).json({
    success: true,
    data: 'Email Sent successfully'
})
    }
    catch(err){
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false});
        return next(new ErrorResponse('Email could not be sent', 500))
    }
})
// @desc  Reset password
// @route  PUT /api/v1/auth/resetPassword/:resetToken
// @access Private
exports.resetPassword = asyncHandler(async(req,res,next)=>{
    const resetPasswordToken1 = crypto.createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');
    const user= await 
    User.findOne({resetPasswordToken: resetPasswordToken1,
    resetPasswordExpire: {$gt: Date.now()}
    });
    if(!user){
        return next(new ErrorResponse('Invalid Token',400))
    }
    //set new password
    user.password=req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendTokenResponse(user, 200, res);
})


 // @desc  Update user details
// @route  PUT /api/v1/auth/updateDetails

// @access Private
exports.updateDetails= asyncHandler(async(req,res,next)=>{
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }
    console.log(fieldsToUpdate);
    const user= await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

    
    res.status(200).json({
        success:true,
        data: user
    })
})

 // @desc  Update password
// @route  PUT /api/v1/auth/updatePassword

// @access Private
exports.updatePassword= asyncHandler(async(req,res,next)=>{
    const user= await User.findById(req.user.id).select('+password');
    //check current password
    if(! await user.matchPassword(req.body.password,user.password)){
return next(new ErrorResponse('Password is incorrect',401))
    }
    user.password=req.body.newpassword;
    await user.save();

   sendTokenResponse(user,200,res);
})

 //Get Token from model, create cookie and send response
 const sendTokenResponse=(user, statuscode, res) =>{
    const token = user.getSignedjwtToken();
    const options ={
        expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE)*24*60*60*1000),
        httpOnly: true

    };
    if(process.env.NODE_ENV == "production"){
        options.secure=true
    }
    res.status(statuscode)
    .cookie('jwt-token',token,options)
    .json({
        success: true,
        token
    })
 }