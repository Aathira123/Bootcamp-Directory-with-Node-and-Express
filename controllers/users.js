const User = require('../modals/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc  Get All Users
// @route  Get /api/v1/auth/users
// @access Private/Admin
exports.getUsers = asyncHandler(async(req,res,next)=>{
   res.status(200).json(res.advancedResults);
 
 })

 // @desc  Get A Single Users
// @route  Get /api/v1/auth/user/:userId
// @access Private/Admin
exports.getUser = asyncHandler(async(req,res,next)=>{
   const user = await User.findById(req.params.userId);
   res.status(200).json({
       success: true,
       data: user
   })
  
  })

   // @desc  Create a User
// @route  POST /api/v1/auth/users
// @access Private/Admin
exports.createUser = asyncHandler(async(req,res,next)=>{
    const user = await User.create(req.body);
    res.status(201).json({
        success: true,
        data: user
    })
   
   })

// @desc  Update User
// @route  PUT /api/v1/auth/user/:userId
// @access Private/Admin
exports.updateUser = asyncHandler(async(req,res,next)=>{
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
        new: true,
        runValidators: true
    });
    res.status(201).json({
        success: true,
        data: user
    })
   
   })

// @desc  Delete User
// @route  DELETE /api/v1/auth/user/:userId
// @access Private/Admin
exports.deleteUser = asyncHandler(async(req,res,next)=>{
    const user = await User.findByIdAndDelete(req.params.userId);
    res.status(201).json({
        success: true,
        deleteddata: user
    })
   
   })