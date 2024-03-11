const express = require('express');
const router = express.Router();
const { userPost, userComment, userLike, deletePost, deleteComments, updateComments, getUserPost } = require('../controllers/post')
const { verifyToken } = require('../middlewares/user')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'./public/uploads/post')
    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({storage:storage})


router.post('/create', verifyToken,upload.single('file'), userPost)

router.delete('/', verifyToken, deletePost)

router.post('/comments', verifyToken, userComment)
router.delete('/comments', verifyToken, deleteComments)
router.patch('/comments', verifyToken, updateComments)

router.post('/likes',verifyToken ,userLike)

module.exports = router;