const User = require("../models/user");
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const redisClient = require('../utils/redisClient');
const { generateOTP } = require('../utils/generateOTP');
const nodemailer = require('nodemailer');

const client = twilio(
  "ACe2a5bbf981fb754299e70099299f7bfb",
  "baad4f174d6d79575aee5c49cd594c9f"
);


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: "uxanilkumar@gmail.com", // Your Gmail address (e.g., yourname@gmail.com)
    pass: "ymnc iupk cgdj hxtr", // Gmail App Password
  },
});


const userLogin = async (req, res) => {
    const { username , password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'user and password are required' });
    }
    try {
      const exstingUser = await User.findOne({email: username, password: password});
      if(exstingUser){
        var token = jwt.sign({_id: exstingUser._id, email: exstingUser.email}, 'learning-jwt',{ expiresIn: '1hr' }); // "learning-jwt" is secrate key
       return res.status(200).json({data:exstingUser, token});
      }else{
        return res.status(500).json({error:"invaild user or password"});
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };


  // Send OTP
const sendOTP = async (req, res) => {
  const { phone } = req.body;
  const otp = generateOTP();
  const otpKey = `otp:${phone}`;
  const ttl = 300; // 5 minutes TTL

  try {
      // Store OTP in Redis
      await redisClient.setEx(otpKey, ttl, otp);

      // Send OTP via SMS
      await client.messages.create({
          body: `hello how are you ?. ${otp}.`,
          from: "+17652006198",
          to: phone,
      });

      console.log(`OTP sent to ${phone}: ${otp}`);
      res.json({ message: 'OTP sent successfully' });
  } catch (err) {
      console.error(`Error sending OTP to ${phone}:`, err);
      res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;
  const otpKey = `otp:${phone}`;

  try {
      // Retrieve OTP from Redis
      const storedOTP = await redisClient.get(otpKey);

      if (!storedOTP) {
          return res.status(400).json({ error: 'OTP expired or invalid' });
      }

      if (storedOTP !== otp) {
          return res.status(400).json({ error: 'Invalid OTP' });
      }

      // OTP is valid; delete it from Redis
      await redisClient.del(otpKey);

      // Generate JWT
      const token = jwt.sign(
        { phone },
        "learning-otp",
        { expiresIn: '1h' }
    );

      // TODO: Authenticate user (e.g., issue JWT, update database)
      res.json({ message: 'OTP verified successfully', authenticated: token });
  } catch (err) {
      console.error(`Error verifying OTP for ${phone}:`, err);
      res.status(500).json({ error: 'Failed to verify OTP' });
  }
};


// email

// Send OTP via email
const emailSendOTP = async (req, res) => {
  const { email } = req.body; // Expect email instead of phone
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const otp = generateOTP();
  const otpKey = `otp:${email}`;
  const ttl = 300; // 5 minutes

  try {
    // Store OTP in Redis
    await redisClient.setEx(otpKey, ttl, otp);

    // Send OTP via email
    const mailOptions = {
      from: "uxanilkumar@gmail.com",
      to: email,
      subject: 'Your OTP for Login',
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
      html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);

    // For SendGrid:
    /*
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Your OTP for Login',
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
      html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
    };
    await sgMail.send(msg);
    */

    res.json({ message: 'OTP sent successfully to email' });
  } catch (err) {
    console.error(`Error sending OTP to ${email}:`, err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};


const emailVerifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const otpKey = `otp:${email}`;

  try {
    const storedOTP = await redisClient.get(otpKey);
    if (!storedOTP) {
      return res.status(400).json({ error: 'OTP expired or invalid' });
    }

    if (storedOTP !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    await redisClient.del(otpKey);

    // Generate JWT
    const token = jwt.sign({ email }, "learning-email", { expiresIn: '1h' });
    res.json({ message: 'OTP verified successfully', token });
  } catch (err) {
    console.error(`Error verifying OTP for ${email}:`, err);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

  module.exports = {userLogin, sendOTP, verifyOTP, emailSendOTP, emailVerifyOTP};