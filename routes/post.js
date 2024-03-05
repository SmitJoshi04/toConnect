const express = require('express');
const router = express.Router();
const { userPost, userComment, userLike, deletePost, deleteComments, updateComments } = require('../controllers/post')
const { verifyToken } = require('../middlewares/user')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'./uploads/post')
    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({storage:storage})


router.post('/', verifyToken,upload.single('file'), userPost)
router.delete('/', verifyToken, deletePost)

router.post('/comments', verifyToken, userComment)
router.delete('/comments', verifyToken, deleteComments)
router.patch('/comments', verifyToken, updateComments)

router.post('/likes',verifyToken ,userLike)

module.exports = router;