import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cors from 'cors'

const server = express();
let PORT = 3000;

server.use(express.json());

server.listen(PORT, () => {
    console.log("Listening on " + PORT);
});

