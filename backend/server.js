import express from 'express'
import mongoose from 'mongoose';
import 'dotenv/config'
import bcrypt from 'bcrypt'
import User from './Schema/User.js';
import Blog from './Schema/Blog.js';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken'
import cors from 'cors';
import aws from 'aws-sdk'

const server = express();
let PORT = 3000;

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

server.use(express.json());
server.use(cors());

mongoose.connect(process.env.DB_LOCATION,{
    autoIndex:true
})

// aws-bucket-setup
const  s3 = new aws.S3({
    region : 'ap-south-1',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const generateUploadURL = async () => {

    const date = new Date();
    const imageName = `${nanoid()}-${date.getTime()}.jpeg`;

    return await s3.getSignedUrlPromise('putObject', {
        Bucket: 'weblog-mern-project',
        Key: imageName,
        Expires: 1000,
        ContentType: "images/jpeg"
    })
}

const verifyJWT = (req, res, next) => {
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token==null){
        return res.status(401).json({message:"Unauthorized Access, No Token"})
    }
    
    jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user)=>{
        if(err){
            return res.status(403).json({error:"Invalid Access Token"})
        }
        req.user = user.id;
        next();
    })

}

const formatDatatoSend = (user) => {
    const token = jwt.sign( {id:user._id}, process.env.SECRET_ACCESS_KEY)
    return{
        token,
        profile_img : user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    }
}

const generateUsername = async(email) => {
    let username = email.split("@")[0]
    
    let isUsernameNotUnique = await User.exists({"personal_info.username" : username}).then((result) => result)
    isUsernameNotUnique ? username += nanoid().substring(0,5) : ""

    return username
}

server.get('/get-upload-url',(req, res) => {
    generateUploadURL().then(url => res.status(200).json({ uploadURL: url }))
    .catch(err => {
        console.log(err.message);
        return res.status(500).json({error :  "Internal Server Error"})
    })
})

server.post("/signup", (req, res) => {
    let { fullname, email, password } = req.body;

    if (fullname.length < 3) {
        return res.status(403).json({ "error": "Fullname must be at least 3 characters." });
    }
    if (!email.length) {
        return res.status(403).json({ "error": "Please provide an email address." });
    }
    if (!emailRegex.test(email)) {
        return res.status(403).json({ "error": "Please enter a valid email address." });
    }
    if (!passwordRegex.test(password)) {
        return res.status(403).json({ "error": "Password must be 6-20 characters, include uppercase, lowercase, and a number." });
    }

    bcrypt.hash(password, 10, async (err, hashed_password) => {
 
        let username = await generateUsername(email);

        let user = new User({
            personal_info:{ fullname, email, password: hashed_password, username}
        })

        user.save().then((u) =>{
            return res.status(200).json(formatDatatoSend(u))
        })
        .catch(err =>{
            if(err.code == 11000){
                return res.status(500).json({ "error": "Email already exists." })
            }
            return res.status(500).json({"error":err.message})
        })

    })
});


server.post("/signin", (req, res) => {
    let { email, password } = req.body;

    User.findOne({ "personal_info.email": email })
    .then((user) => {
        if (!user) {
            return res.status(403).json({ "error": "Email not found" });
        }

        // Compare the provided password with the hashed password
        bcrypt.compare(password, user.personal_info.password, (err, result) => {
            if (err) {
                return res.status(403).json({ "error": "Error while logging in. Try later" });
            }
            if (!result) {
                return res.status(403).json({ "error": "Incorrect password" });
            } else {
                // On successful login, return the user data
                return res.status(200).json(formatDatatoSend(user));
            }
        });
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({ "error": err.message });
    });
});

server.post('/create-blog', verifyJWT, (req, res) => {

    let authorId = req.user;
    let { title, banner, content, des, tags, draft } = req.body;

    // Validate title
    if (typeof title !== 'string' || title.trim().length === 0) {
        return res.status(403).json({ "error": "Title is required and cannot be empty." });
    }

    if(!draft){
        // Validate description
        if (typeof des !== 'string' || des.length === 0 || des.length > 200) {
            return res.status(403).json({ "error": "Description should be between 1 and 200 characters." });
        }

        // Validate banner URL
        if (typeof banner !== 'string' || banner.trim().length === 0) {
            return res.status(403).json({ "error": "Banner is required." });
        }

        // Validate content and blocks
        if (!content || !content.blocks || content.blocks.length === 0) {
            return res.status(403).json({ "error": "Blog must have some content to publish." });
        }

        // Validate tags
        if (!tags || tags.length === 0 || tags.length > 10) {
            return res.status(403).json({ "error": "Tags are required. Maximum 10 allowed." });
        }
    }

    // Process tags
    tags = tags.map(tag => tag.toLowerCase());

    // Generate blogId
    let blog_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, "-").trim() + nanoid();

    let blog = new Blog({
        title, des, banner, content, tags, author: authorId, blog_id, draft: Boolean(draft)
    });

    blog.save()
    .then(blog => {
        let incrementVal = draft ? 0 : 1;

        User.findOneAndUpdate(
            { _id: authorId },
            { $inc: { "account_info.total_posts": incrementVal }, $push: { "blogs": blog._id } }
        )
        .then(user => {
            return res.status(200).json({ id: blog._id });
        })
        .catch(err => {
            return res.status(500).json({ "error": "Failed to update the post" });
        });
    })
    .catch(err => {
        return res.status(500).json({ "error": err.message });
    });
});

server.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})