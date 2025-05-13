const jwt=require('jsonwebtoken');
const authMiddleware=(req,res,next)=>{
    const authHeader=req.headers.authorization;

    if(!authHeader||!authHeader.startsWith('Bearer ')){
       return res.status(400).json({message:"Unauthorized"});
    }
    const token=authHeader.split(' ')[1];
    try {
        const decoded=jwt.verify(token,'secretkey');
        req.user=decoded;
        next();
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}
module.exports=authMiddleware;