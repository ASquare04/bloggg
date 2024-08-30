import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import cors from 'cors'

const server = express();
let PORT = 3000;

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/; 

server.use(express.json());
server.use(cors());

mongoose.connect(process.env.DB_LOCATION, { autoIndex: true })
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.error('Database connection error:', err));


server.listen(PORT, () => {
    console.log("Listening on " + PORT);
});

