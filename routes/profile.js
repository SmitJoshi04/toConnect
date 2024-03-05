const express = require('express');
const {getUserPost,getUserData} = require('../controllers/profile')

const router = express.Router();

router.post('/',getUserPost);

module.exports = router;