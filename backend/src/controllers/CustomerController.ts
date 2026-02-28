import { Request, Response } from 'express';
import { ICustomerService } from '../services/interfaces/ICustomerService';
import { AuthRequest } from '../middleware/authMiddleware';

export class CustomerController {
    constructor(private customerService: ICustomerService) { }

    createCustomer = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const customer = await this.customerService.createCustomer(userId, req.body);
            res.status(201).json({ message: 'Customer created successfully', data: customer });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    getCustomer = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const customer = await this.customerService.getCustomer(userId, req.params.id as string);
            res.status(200).json({ data: customer });
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    };

    getAllCustomers = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const query = req.query.search as string;
            const customers = await this.customerService.getAllCustomers(userId, query);
            res.status(200).json({ data: customers });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    updateCustomer = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const customer = await this.customerService.updateCustomer(userId, req.params.id as string, req.body);
            res.status(200).json({ message: 'Customer updated successfully', data: customer });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    deleteCustomer = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const id = req.params.id as string;
            await this.customerService.deleteCustomer(userId, id);
            res.status(200).json({ message: 'Customer deleted successfully' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };
}
