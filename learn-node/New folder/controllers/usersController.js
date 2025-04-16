const User = require("../models/user");
// Fake user data (replace with a database in a real app)
const ResumeParser = require("resume-parser-simple");

const users = [
  { id: 1, namee: "Anil", email: "anil@example.com" },
  { id: 2, namee: "gagan", email: "gagan@example.com" },
];

const getAllUsers = async (req, res) => {
  try {
    const newUser = await User.find({}).select("-password");
    return res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({_id: userId});
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
  } catch (error) {
    res.status(500).json({err: error})
  }
  
};

const updateUserById = async (req, res) => {
  const { username, email, age, password } = req.body;
  try {
    const userId = req.params.id;
    const user = await User.findOne({_id: userId});
  if (!user) {
    return res.status(404).json({ error: "User not found1" });
  }
   // Update user fields
   user.username = username ?? user.username;
   user.email = email ?? user.email;
   user.age = age ?? user.age;
   user.password = password ?? user.password;

   // Save updated user
   await user.save();

   return res.status(201).json();
  } catch (error) {
    res.status(500).json({err: error});
  }
}; 

const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({_id: userId});
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  await user.deleteOne({_id: userId});
  res.status(201).json("user deleted");
  } catch (error) {
    res.status(500).json({err: error})
  }
  
};

const createUser = (req, res) => {
  const { username, email, age, password } = req.body;
  console.log({ username, email, age, password });
  if (!username || !email || !age || !password) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  try {
    const newUser = User.create({ username, email, age, password });
    return res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

//resume parser
const resumeParser = async (req, res) => {
  try {
    const file = req.files[0];
    console.log(file, __dirname);
    await ResumeParser.parseResumeFile(__dirname.replace("controllers", "") + "files/" + file.filename, __dirname.replace("controllers", "") + "files") // input file, output dir
      .then((file) => {
        console.log("Yay! " + file);
      })
      .catch((error) => {
        console.error(error);
      });
    return res.status(201).json("uploaded");
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  resumeParser,
  updateUserById,
  deleteUserById
};
