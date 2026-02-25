import { ICustomerRepository } from '../repositories/interfaces/ICustomerRepository';
import { CreateCustomerDTO, UpdateCustomerDTO } from '../dtos/CustomerDTO';

export class CustomerService {
    constructor(private customerRepository: ICustomerRepository) { }

    async createCustomer(data: CreateCustomerDTO) {
        return await this.customerRepository.create(data);
    }

    async getCustomer(id: string) {
        const customer = await this.customerRepository.findById(id);
        if (!customer) throw new Error('Customer not found');
        return customer;
    }

    async getAllCustomers(query?: string) {
        return await this.customerRepository.findAll(query);
    }

    async updateCustomer(id: string, data: UpdateCustomerDTO) {
        const customer = await this.customerRepository.update(id, data);
        if (!customer) throw new Error('Customer not found');
        return customer;
    }

    async deleteCustomer(id: string) {
        const deleted = await this.customerRepository.delete(id);
        if (!deleted) throw new Error('Customer not found');
        return deleted;
    }
}
