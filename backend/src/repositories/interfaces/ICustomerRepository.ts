import { ICustomer } from '../../models/Customer';
import { CreateCustomerDTO, UpdateCustomerDTO } from '../../dtos/CustomerDTO';

export interface ICustomerRepository {
    create(data: CreateCustomerDTO): Promise<ICustomer>;
    findById(id: string): Promise<ICustomer | null>;
    findAll(query?: string): Promise<ICustomer[]>;
    update(id: string, data: UpdateCustomerDTO): Promise<ICustomer | null>;
    delete(id: string): Promise<boolean>;
}
