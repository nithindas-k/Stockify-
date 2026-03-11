import { ICustomerRepository } from '../repositories/interfaces/ICustomerRepository';
import { CreateCustomerDTO, UpdateCustomerDTO } from '../dtos/CustomerDTO';
import { ICustomerService } from './interfaces/ICustomerService';

export class CustomerService implements ICustomerService {
    constructor(private customerRepository: ICustomerRepository) { }

    async createCustomer(userId: string, data: CreateCustomerDTO) {
        const existing = await this.customerRepository.findByMobile(userId, data.mobile);
        if (existing) {
            throw new Error(`Customer with mobile ${data.mobile} already exists.`);
        }
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
        if (data.mobile) {
            const existing = await this.customerRepository.findByMobile(userId, data.mobile);
            if (existing && existing._id.toString() !== id) {
                throw new Error(`Customer with mobile ${data.mobile} already exists.`);
            }
        }
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
