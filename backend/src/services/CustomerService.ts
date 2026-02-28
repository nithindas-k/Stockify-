import { ICustomerRepository } from '../repositories/interfaces/ICustomerRepository';
import { CreateCustomerDTO, UpdateCustomerDTO } from '../dtos/CustomerDTO';

export class CustomerService {
    constructor(private customerRepository: ICustomerRepository) { }

    async createCustomer(userId: string, data: CreateCustomerDTO) {
        return await this.customerRepository.create(userId, data);
    }

    async getCustomer(userId: string, id: string) {
        const customer = await this.customerRepository.findById(userId, id);
        if (!customer) throw new Error('Customer not found');
        return customer;
    }

    async getAllCustomers(userId: string, query?: string) {
        return await this.customerRepository.findAll(userId, query);
    }

    async updateCustomer(userId: string, id: string, data: UpdateCustomerDTO) {
        const customer = await this.customerRepository.update(userId, id, data);
        if (!customer) throw new Error('Customer not found');
        return customer;
    }

    async deleteCustomer(userId: string, id: string) {
        const deleted = await this.customerRepository.delete(userId, id);
        if (!deleted) throw new Error('Customer not found');
        return deleted;
    }
}
