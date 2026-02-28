import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const seedUser = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stockify';
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB for seeding...');

        const testExists = await User.findOne({ email: 'test@example.com' });
        if (testExists) {
            console.log('Test user already exists. Skipping seed.');
            return;
        }

        const hashedPassword = await bcrypt.hash('password123', 10);
        await User.create({
            name: 'Test User',
            email: 'test@example.com',
            password: hashedPassword,
        });

        console.log('Test user created successfully: test@example.com / password123');
    } catch (err) {
        console.error('Error seeding test user:', err);
    } finally {
        await mongoose.connection.close();
    }
};

seedUser();
