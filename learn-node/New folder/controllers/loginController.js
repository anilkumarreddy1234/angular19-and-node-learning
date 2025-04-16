const User = require("../models/user");
const jwt = require('jsonwebtoken');

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

  module.exports = {userLogin};