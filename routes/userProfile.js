'use strict'

const express = require('express');
const {getUsersPost, getUsersFriend, getUsersProfileData} = require('../controllers/userProfile');
const { verifyToken } = require('../middlewares/user');

const router = express.Router();


router.post('/',verifyToken,getUsersPost);
router.post('/friends',verifyToken,getUsersFriend);
router.post('/profile',verifyToken,getUsersProfileData);


module.exports = router;