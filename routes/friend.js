const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/user')
const{sendFriendReq, acceptFriendreq, rejectFriendReq, getFriendReq }= require('../controllers/friend')

router.post('/', verifyToken, sendFriendReq)
router.patch('/', verifyToken, acceptFriendreq)
router.delete('/', verifyToken, rejectFriendReq)
router.get('/', verifyToken, getFriendReq)

module.exports = router;