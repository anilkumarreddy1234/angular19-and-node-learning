const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, createUser, resumeParser, updateUserById, deleteUserById } = require('../controllers/usersController');
const auth = require('../middleware/authMIddleware');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "files/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });

// Routes
router.post("/upload", upload.any(), resumeParser)
router.get('/', auth, getAllUsers);
router.get('/:id', auth, getUserById);
router.post('/', auth,createUser);
router.put('/:id', auth,updateUserById);
router.delete('/:id', auth,deleteUserById);

module.exports = router;