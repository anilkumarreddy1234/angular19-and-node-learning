
const jwt  = require("jsonwebtoken");
const User = require("../models/user");
const auth = async (req, res, next)=>{
  try {
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log("user request ", token);
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token,'learning-jwt');
    console.log("decoded",decoded);
    const user = await User.findOne({_id:decoded._id});

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
}
module.exports = auth;