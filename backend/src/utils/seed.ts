import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const seedAdmin = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stockify';
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB for seeding...');

        const adminExists = await User.findOne({ email: 'admin@stockify.com' });
        if (adminExists) {
            console.log('Admin user already exists. Skipping seed.');
            return;
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            name: 'System Admin',
            email: 'admin@stockify.com',
            password: hashedPassword,
            role: 'admin',
        });

        console.log('Admin user created successfully: admin@stockify.com / admin123');
    } catch (err) {
        console.error('Error seeding admin user:', err);
    } finally {
        await mongoose.connection.close();
    }
};

seedAdmin();
