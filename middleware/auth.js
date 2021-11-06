const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const errorResponse=require('../utils/errorResponse')
const User = require('../modals/User');
const ErrorResponse = require('../utils/errorResponse');

//Protect routes
exports.protect = asyncHandler(async(req,res,next)=>{
    let token ;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token= req.headers.authorization.split(' ')[1];
    }
     else if(req.cookies["jwt-token"]){
token = req.cookies["jwt-token"];
    }
    //Make sure token exists
    if(!token){
return next(new ErrorResponse(
    'Not Authorized to perform this operation',401
))
    }

    try{
        //Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        console.log(decoded);
        next();
    }
     catch(err){
        return next(new ErrorResponse(
            'Not Authorized to perform this operation',401
        ))
     }

})

//Grant access to specific roles
exports.authorize  = (...roles) =>{
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse(
                `User Role ${req.user.role} is unauthorised to perform this operation`,403
            )) 
        }
        next();
    }
}