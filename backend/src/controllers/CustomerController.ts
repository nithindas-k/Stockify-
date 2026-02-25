import { Request, Response } from 'express';
import { CustomerService } from '../services/CustomerService';

export class CustomerController {
    constructor(private customerService: CustomerService) { }

    createCustomer = async (req: Request, res: Response): Promise<void> => {
        try {
            const customer = await this.customerService.createCustomer(req.body);
            res.status(201).json({ message: 'Customer created successfully', data: customer });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    getCustomer = async (req: Request, res: Response): Promise<void> => {
        try {
            const customer = await this.customerService.getCustomer(req.params.id as string);
            res.status(200).json({ data: customer });
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    };

    getAllCustomers = async (req: Request, res: Response): Promise<void> => {
        try {
            const query = req.query.search as string;
            const customers = await this.customerService.getAllCustomers(query);
            res.status(200).json({ data: customers });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    };

    updateCustomer = async (req: Request, res: Response): Promise<void> => {
        try {
            const customer = await this.customerService.updateCustomer(req.params.id as string, req.body);
            res.status(200).json({ message: 'Customer updated successfully', data: customer });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    deleteCustomer = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;
            await this.customerService.deleteCustomer(id);
            res.status(200).json({ message: 'Customer deleted successfully' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };
}
