import { Request, Response } from 'express';
import { ICustomerService } from '../services/interfaces/ICustomerService';
import { AuthRequest } from '../middleware/authMiddleware';
import { ICustomerController } from './interfaces/ICustomerController';
import { CreateCustomerSchema, UpdateCustomerSchema } from '../dtos/CustomerDTO';
import { CustomerMapper } from '../mappers/CustomerMapper';
import { StatusCode } from '../enums/StatusCode';

export class CustomerController implements ICustomerController {
    constructor(private _customerService: ICustomerService) { }

    createCustomer = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const validatedData = CreateCustomerSchema.parse(req.body);
            const customer = await this._customerService.createCustomer(userId, validatedData);
            res.status(StatusCode.CREATED).json({ message: 'Customer created successfully', data: CustomerMapper.toDTO(customer) });
        } catch (error: any) {
            if (error.name === 'ZodError') {
                res.status(StatusCode.BAD_REQUEST).json({ message: 'Validation failed', errors: error.errors });
                return;
            }
            res.status(StatusCode.BAD_REQUEST).json({ message: error.message });
        }
    };

    getCustomer = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const customer = await this._customerService.getCustomer(userId, req.params.id as string);
            res.status(StatusCode.OK).json({ data: CustomerMapper.toDTO(customer) });
        } catch (error: any) {
            res.status(StatusCode.NOT_FOUND).json({ message: error.message });
        }
    };

    getAllCustomers = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const query = req.query.search as string;
            const customers = await this._customerService.getAllCustomers(userId, query);
            res.status(StatusCode.OK).json({ data: customers.map(CustomerMapper.toDTO) });
        } catch (error: any) {
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    };

    updateCustomer = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const validatedData = UpdateCustomerSchema.parse(req.body);
            const customer = await this._customerService.updateCustomer(userId, req.params.id as string, validatedData);
            res.status(StatusCode.OK).json({ message: 'Customer updated successfully', data: CustomerMapper.toDTO(customer) });
        } catch (error: any) {
            if (error.name === 'ZodError') {
                res.status(StatusCode.BAD_REQUEST).json({ message: 'Validation failed', errors: error.errors });
                return;
            }
            res.status(StatusCode.BAD_REQUEST).json({ message: error.message });
        }
    };

    deleteCustomer = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as AuthRequest).user.id;
            const id = req.params.id as string;
            await this._customerService.deleteCustomer(userId, id);
            res.status(StatusCode.OK).json({ message: 'Customer deleted successfully' });
        } catch (error: any) {
            res.status(StatusCode.BAD_REQUEST).json({ message: error.message });
        }
    };
}
