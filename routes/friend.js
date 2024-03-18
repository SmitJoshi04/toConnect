const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/user')
const{sendFriendReq, acceptFriendreq, rejectFriendReq, getFriendReq }= require('../controllers/friend')

router.post('/', verifyToken, sendFriendReq)
router.post('/accept', verifyToken, acceptFriendreq)
router.post('/reject', verifyToken, rejectFriendReq)
router.post('/get', verifyToken, getFriendReq)

module.exports = router;