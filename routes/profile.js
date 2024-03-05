const express = require('express');
const {getUserPost} = require('../controllers/profile');
const { verifyToken } = require('../middlewares/user');

const router = express.Router();

router.post('/',verifyToken,getUserPost);

module.exports = router;