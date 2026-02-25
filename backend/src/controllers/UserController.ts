import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
    constructor(private userService: UserService) { }

    getAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json({ data: users });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error fetching users' });
        }
    };

    toggleUserStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.id as string;
            if (!userId) {
                res.status(400).json({ message: 'User ID is required' });
                return;
            }
            const user = await this.userService.toggleUserStatus(userId);
            res.status(200).json({ message: 'User status updated successfully', data: user });
        } catch (error: any) {
            res.status(400).json({ message: error.message || 'Error updating user status' });
        }
    };
}
