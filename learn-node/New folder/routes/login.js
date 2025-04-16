const express = require('express');
const router = express.Router();
const { userLogin } = require('../controllers/loginController');

// Routes
router.post('/', userLogin);

module.exports = router;