import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
dotenv.config();

import travelRoutes from './Routes/travelRoutes.js';
import userRoutes from './Routes/userRoutes.js';


// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Create Express server
const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'client' directory
app.use(express.static('client'));

// Your routes here
app.use(travelRoutes);
app.use(userRoutes);


// Define routes for different HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'test.html'));
});



const mongoURI = process.env.NODE_ENV === 'development' ? process.env.MONGO_URI_REMOTE : process.env.MONGO_URI_LOCAL;


const connectToDatabase = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log(mongoURI);
        
        console.log('Mongoose version:', mongoose.version);
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.log('Failed to connect to MongoDB:', error);
    }
} 

// Initial connection attempt
connectToDatabase();



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});