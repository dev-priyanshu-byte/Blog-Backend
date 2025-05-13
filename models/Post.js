const mongoose=require('mongoose');

const commentSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    comment:{
        type:String,
        required:true
    }
},{timestamps:true});
const postSchema=new mongoose.Schema({
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    likes:{
        type:[String],
        default:[]
    },
    comments:[commentSchema]
},{timestamps:true});

const Post= mongoose.model('Post',postSchema);

module.exports=Post;