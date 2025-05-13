const { Error } = require('mongoose');
const Post=require('../models/Post');

const allPosts=async(req,res)=>{
    try {
        const page=parseInt(req.query.page)||1;
        const limit=2;
        const skip=(page-1)*limit;
        const appPosts=await Post.countDocuments();
        const posts=await Post.find()
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
        .populate('creator',"email");
        res.status(200).json(posts);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
};

const getPost= async(req,res) => {
    try {
        const {id}=req.params;
        const post=await Post.findById(id);
        if(!post)
        {    res.status(400);
            throw new Error("Post not found");
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
};

const createPost=async(req,res)=>{
    try {
        const{title,body}=req.body;
        if(!title||!body){
            res.status(400);
            throw new Error("Title and Body required");
        }
        const newPost=new Post({title,body,creator:req.user.id});
        await newPost.save();
        res.status(200).json(newPost);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
};

const updatePost=async(req,res)=>{
    try{
        const {title,body}=req.body;
        const {id}=req.params;
        const post=await Post.findById(id);
        if(!updatePost){
            res.status(404);
            throw new Error("Post not found");
        }
        if(post.creator.toString()!==req.user.id){
            res.status(404);
        throw new Error("unauthorized");
        }
        const updatedPost=new Post({title,body,creator:post.creator});
        await updatedPost.save();
        res.status(200).json(updatedPost);
    }catch(error){
        res.status(500);
        throw new Error(error.message);
    }
};

const deletePost=async(req,res)=>{
    try{
        const {id}=req.params;
        const deletePost=await Post.findById(id);
        if(!deletePost)
        {    
            res.status(400);
            throw new Error("Post not found");
        }
        if(deletePost.creator.toString()!==req.user.id)
            {
            res.status(403);
            throw new Error("Not authorized");
        }
        await deletePost.deleteOne();
        res.status(200).json({message:"Post deleted"});
    }catch(error){
        res.status(500);
        throw new Error(error.message);
    }
};

const likePost=async(req,res)=>{
    try {
        const {id}=req.params;
        const post=await Post.findById(id);
        if(!post)
        {    res.status(400);
            throw new Error("Post not found");
        }
        const userId=req.user.id;
        const ind=post.likes.indexOf(userId);
        if(ind==-1)
            post.likes.push(userId);
        else
            post.likes.splice(ind,1);
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
};

const commentPost=async(req,res)=>{
    try {
        const {id}=req.params;
        const {comment}=req.body;
        if(!comment)
        {
            res.status(400);
            throw new Error("comment is required");
        }
        const post=await Post.findById(id);
        if(!post){
            return res.status(400);
            throw new Error("Post does not exists");
        }
        const comnt={
            userId:req.user.id,
            comment:comment
        };
        post.comments.push(comnt);
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
};

const getComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const page = parseInt(req.query.page) || 1;
        const limit = 1;
        const skip = limit * (page - 1);

        const post = await Post.findById(id);
        if (!post) {
            res.status(404);
            throw new Error("Post not found");
        }

        const comments = post.comments
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(skip, skip + limit);

        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(post.comments.length / limit),
            totalComments: post.comments.length,
            comments,
        });
    } catch (error) {
        next(error);
    }
};


const deleteComment = async (req, res, next) => {
    try {
        const { id, comid } = req.params;
        const post = await Post.findById(id);
        if (!post) {
            res.status(404);
            throw new Error("Post not found");
        }

        const comment = post.comments.id(comid);
        if (!comment) {
            res.status(404);
            throw new Error("Comment not found");
        }

        if (comment.userId.toString() !== req.user.id) {
            res.status(403);
            throw new Error("Unauthorized");
        }

        post.comments = post.comments.filter((c) => c._id.toString() !== comid);
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
};

const updateComment = async (req, res, next) => {
    try {
        const { id, comid } = req.params;
        const { comment } = req.body;

        const post = await Post.findById(id);
        if (!post) {
            res.status(404);
            throw new Error("Post not found");
        }

        const com = post.comments.id(comid);
        if (!com) {
            res.status(404);
            throw new Error("Comment not found");
        }

        if (com.userId.toString() !== req.user.id) {
            res.status(403);
            throw new Error("Unauthorized");
        }

        com.comment = comment;
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
};

module.exports={allPosts,getPost,createPost,updatePost,deletePost,likePost,commentPost,getComment,deleteComment,updateComment} ;

