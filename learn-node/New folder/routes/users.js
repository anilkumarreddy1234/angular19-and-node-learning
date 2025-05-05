const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, createUser, resumeParser, updateUserById, deleteUserById } = require('../controllers/usersController');
const auth = require('../middleware/authMIddleware');
const multer = require('multer');

const redisClient = require('../utils/redisClient');
const { validateUserRequest } = require('../validation/validations');

const cacheMiddleware = async (req, res, next) => {
  const cacheKey = req.originalUrl;

  try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
          console.log('Serving from Redis cache');
          return res.json(JSON.parse(cachedData));
      }
      next();
  } catch (err) {
      console.error('Redis error:', err);
      next();
  }
}

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
router.post("/upload", upload.any(), resumeParser);

router.get('/', auth, cacheMiddleware, getAllUsers);

router.get('/:id', auth, getUserById);
router.post('/', auth ,validateUserRequest , createUser);
router.put('/:id', auth,updateUserById);
router.delete('/:id', auth,deleteUserById);

module.exports = router;