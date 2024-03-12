'use strict'

const express = require('express');
const { verifyToken } = require('../middlewares/user');
const router = express.Router();

const {getUserPost} = require('../controllers/home');

router.post('/',verifyToken,getUserPost) 

module.exports = router;