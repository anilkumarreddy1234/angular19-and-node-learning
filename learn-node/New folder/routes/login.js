const express = require('express');
const router = express.Router();
const { userLogin, sendOTP, verifyOTP, emailVerifyOTP, emailSendOTP } = require('../controllers/loginController');
const validatePhone = require('../middleware/validatePhone');

// Send OTP
router.post('/send-otp', validatePhone, sendOTP);

router.post('/verify-otp', validatePhone, verifyOTP);

// Send OTP
router.post('/email-send-otp',  emailSendOTP);

router.post('/email-verify-otp',  emailVerifyOTP);

// Routes
router.post('/', userLogin);

module.exports = router;