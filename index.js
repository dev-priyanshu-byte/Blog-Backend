const express=require('express');
const postRoutes=require('./routes/postRoutes');
const userRoutes=require('./routes/userRoutes');
const dotenv=require('dotenv');
const connectDB=require('./config/db');
const errorHandler=require("./middlewares/errorHandler");

const app=express();

dotenv.config();
connectDB();


app.use(express.json());
app.use('/user',userRoutes);
app.use('/posts',postRoutes);
app.use(errorHandler);


const PORT=process.env.PORT ||5000;
app.listen(PORT,()=>{
    console.log("Server running");
});

