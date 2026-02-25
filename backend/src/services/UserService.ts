import User, { IUser } from '../models/User';

export class UserService {
    async getAllUsers(): Promise<IUser[]> {
        // Exclude admin users
        return await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    }

    async toggleUserStatus(userId: string): Promise<IUser | null> {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        user.isActive = !user.isActive;
        await user.save();
        return user;
    }
}
