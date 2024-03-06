const express = require('express');
const {getUserPost, getUserFriend, getUserProfileData} = require('../controllers/profile');
const { verifyToken } = require('../middlewares/user');

const router = express.Router();

router.post('/',verifyToken,getUserPost);
router.post('/friends',verifyToken,getUserFriend);
router.post('/profile',verifyToken,getUserProfileData);


module.exports = router;