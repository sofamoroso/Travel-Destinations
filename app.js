import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
dotenv.config();

import travelRoutes from './Routes/travelRoutes.js';


// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Create Express server
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'client' directory
app.use(express.static('client'));

// Your routes here
app.use(travelRoutes);


// Define routes for different HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'test.html'));
});





const mongoURI = process.env.MONGO_URI;

const connectToDatabase = async () => {
    try {
        await mongoose.connect(mongoURI);
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