const bcrypt= require("bcryptjs");
const jwt=require("jsonwebtoken");
const User=require("../models/User");

const registerUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if(!email||!password){
            res.status(400);
            throw new Error("Email and password required");
        }
        const user = await User.findOne({ email });
        if (user) {
            res.status(400);
            throw new Error("User already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const newUser = new User({ email, password: hashed });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401);
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "1h" });

        res.status(200).json({
            token,
            user: { id: user._id, email: user.email }
        });
    } catch (error) {
        next(error);
    }
};

module.exports={registerUser,loginUser};
