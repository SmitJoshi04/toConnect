const express = require('express');
const {getUserPost, getUserFriend, getUserProfileData, editProfilePicture} = require('../controllers/profile');
const { verifyToken } = require('../middlewares/user');

const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'./public/uploads/profile')
    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({storage:storage})


router.post('/editProfile', verifyToken,upload.single('file'), editProfilePicture)

router.post('/',verifyToken,getUserPost);
router.post('/friends',verifyToken,getUserFriend);
router.post('/profile',verifyToken,getUserProfileData);


module.exports = router;