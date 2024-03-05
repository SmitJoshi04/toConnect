'use strict'

const express = require('express');

const { verifyToken } = require('../middlewares/user');
const router = express.Router();
const {getConversation,getConversationText} = require('../controllers/chat');
const exp = require('constants');
// const { verify } = require('jsonwebtoken');


router.get('/',verifyToken,getConversation)
router.post('/chat',verifyToken,getConversationText)

module.exports = router;