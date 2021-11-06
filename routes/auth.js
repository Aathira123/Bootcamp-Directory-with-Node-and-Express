const express = require('express');
const router = express.Router();
const { registerUser, login, logout,getMe,updatePassword, updateDetails, forgotPassword, resetPassword }  = require('../controllers/auth')
const {protect}= require('../middleware/auth');
router.get('/logout',protect, logout)
router.post('/register', registerUser);
router.post('/forgotPassword', forgotPassword); 
router.put('/resetPassword/:resetToken', resetPassword); 
router.post('/login', login);
router.put('/updateDetails', protect,updateDetails)
router.put('/updatePassword', protect,updatePassword)
router.get('/me', protect,getMe)

module.exports = router;