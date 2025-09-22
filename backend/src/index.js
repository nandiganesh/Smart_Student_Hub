import dotenv from 'dotenv';
import connectDB from './db/db.js';
import express from 'express';
import { app } from './app.js';

// Load environment variables first
dotenv.config();

// Set fallback environment variables if not loaded
if (!process.env.PORT) process.env.PORT = '8000';
if (!process.env.MONGODB_URI) process.env.MONGODB_URI = 'mongodb://localhost:27017/smart-student-hub';
if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'fallback-jwt-secret-key';
if (!process.env.ACCESS_TOKEN_SECRET) process.env.ACCESS_TOKEN_SECRET = 'fallback-access-token-secret';
if (!process.env.REFRESH_TOKEN_SECRET) process.env.REFRESH_TOKEN_SECRET = 'fallback-refresh-token-secret';


const PORT = process.env.PORT || 8000; 
app.get('/', (req, res) => {
    res.send('Welcome to the Express server!');
})

async function startServer() {
    try {
        console.log('Environment variables loaded:');
        console.log('PORT:', process.env.PORT);
        console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
        console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
        
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}


startServer();