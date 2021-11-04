const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const UserSchema = new mongoose.Schema({
name:{
    type: String,
    required: [true, 'Please enter your name']
},
email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please enter a valid email '
    ]
},
role:{
    type: String,
    enum:['user', 'publisher'],
    default: 'user'
},
password:{
    type: String,
    required:[true, 'Please enter your password'],
    minlength: [6, "Password must be atleast 6 characters"],
    select: false
},
resetPasswordToken: String,
resetPasswordExpire: Date,
createdAt:{
    type: Date,
    default: Date.now
}
})

// Encrypt Password
UserSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
});
// Sign JWT and return
UserSchema.methods.getSignedjwtToken = function(){
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    })
}

//Match User Entered Password to hashed pass in DB
UserSchema.methods.matchPassword = async function(enteredPass){
return await bcrypt.compare(enteredPass, this.password);
}

//Generate and hash password token
UserSchema.methods.getResetPasswordToken = function(){
    //Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    //Hash token and set to resetPassTokenField
    this.resetPasswordToken = crypto.createHash('sha256')
    .update(resetToken)
    .digest('hex')

    //set expire
    this.resetPasswordExpire = Date.now() + 10*60*1000;
    return resetToken;
}
module.exports=mongoose.model('Users', UserSchema)