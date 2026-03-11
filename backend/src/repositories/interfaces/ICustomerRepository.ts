import { ICustomer } from '../../models/Customer';
import { CreateCustomerDTO, UpdateCustomerDTO } from '../../dtos/CustomerDTO';

export interface ICustomerRepository {
    create(userId: string, data: CreateCustomerDTO): Promise<ICustomer>;
    findById(userId: string, id: string): Promise<ICustomer | null>;
    findByMobile(userId: string, mobile: string): Promise<ICustomer | null>;
    findAll(userId: string, query?: string): Promise<ICustomer[]>;
    update(userId: string, id: string, data: UpdateCustomerDTO): Promise<ICustomer | null>;
    delete(userId: string, id: string): Promise<boolean>;
}
