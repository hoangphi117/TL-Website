import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        let url = process.env.MONGODB_URI;
        if (!url) {
            throw new Error('MONGODB_URI is not defined in .env file');
        }

        // Hardcore cleanup
        url = url.replace(/\s/g, '').replace(/^["']|["']$/g, '');

        // Fix masking: DO NOT add extra space
        const maskedUrl = url.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
        console.log(`[DB Debug] Cleaned URI (masked): ${maskedUrl}`);

        await mongoose.connect(url);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};