import { Request, Response } from 'express';
import { ICustomerService } from '../services/interfaces/ICustomerService';
import { AuthRequest } from '../middleware/authMiddleware';
import { ICustomerController } from './interfaces/ICustomerController';
import { CreateCustomerSchema, UpdateCustomerSchema } from '../dtos/CustomerDTO';

export class CustomerController implements ICustomerController {
    constructor(private customerService: ICustomerService) { }

    createCustomer = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const validatedData = CreateCustomerSchema.parse(req.body);
            const customer = await this.customerService.createCustomer(userId, validatedData);
            res.status(201).json({ message: 'Customer created successfully', data: customer });
        } catch (error: any) {
            if (error.name === 'ZodError') {
                res.status(400).json({ message: 'Validation failed', errors: error.errors });
                return;
            }
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
            const validatedData = UpdateCustomerSchema.parse(req.body);
            const customer = await this.customerService.updateCustomer(userId, req.params.id as string, validatedData);
            res.status(200).json({ message: 'Customer updated successfully', data: customer });
        } catch (error: any) {
            if (error.name === 'ZodError') {
                res.status(400).json({ message: 'Validation failed', errors: error.errors });
                return;
            }
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
