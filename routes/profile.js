const express = require('express');
const {getPosts} = require('../controllers/profile')

const router = express.Router();

router.post('/',getPosts);

module.exports = router;