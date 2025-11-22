import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) {
        return;
    }

    if (!process.env.MONGODB_URI) {
        console.warn('MONGODB_URI is not defined');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI);
        isConnected = db.connections[0].readyState;
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};
