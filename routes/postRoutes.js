const express=require('express');
const router=express.Router();
const {allPosts,getPost,createPost,updatePost,deletePost,likePost, commentPost,getComment,deleteComment,updateComment}=require('../controllers/postController');
const authMiddleware=require('../middlewares/authMiddleware');

router.get('/',allPosts);
router.get('/:id',getPost);
router.post('/',authMiddleware,createPost);
router.put('/:id',authMiddleware,updatePost);
router.delete('/:id',authMiddleware,deletePost);



router.patch('/:id/like',authMiddleware,likePost);


router.patch('/:id/comment',authMiddleware,commentPost);
router.get('/:id/comment',authMiddleware,getComment);
router.delete('/:id/:comid',authMiddleware,deleteComment);
router.patch('/:id/:comid',authMiddleware,updateComment)
module.exports= router;