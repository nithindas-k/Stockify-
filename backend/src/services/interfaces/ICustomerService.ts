import { CreateCustomerDTO, UpdateCustomerDTO } from '../../dtos/CustomerDTO';

export interface ICustomerService {
    createCustomer(userId: string, data: CreateCustomerDTO): Promise<any>;
    getCustomer(userId: string, id: string): Promise<any>;
    getAllCustomers(userId: string, query?: string): Promise<any[]>;
    updateCustomer(userId: string, id: string, data: UpdateCustomerDTO): Promise<any>;
    deleteCustomer(userId: string, id: string): Promise<boolean>;
}
