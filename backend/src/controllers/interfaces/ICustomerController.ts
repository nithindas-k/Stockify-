import { Request, Response } from 'express';

export interface ICustomerController {
    createCustomer(req: Request, res: Response): Promise<void>;
    getCustomer(req: Request, res: Response): Promise<void>;
    getAllCustomers(req: Request, res: Response): Promise<void>;
    updateCustomer(req: Request, res: Response): Promise<void>;
    deleteCustomer(req: Request, res: Response): Promise<void>;
}
