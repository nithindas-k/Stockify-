import { ICustomerRepository } from './interfaces/ICustomerRepository';
import Customer, { ICustomer } from '../models/Customer';
import { CreateCustomerDTO, UpdateCustomerDTO } from '../dtos/CustomerDTO';

export class CustomerRepository implements ICustomerRepository {
    async create(data: CreateCustomerDTO): Promise<ICustomer> {
        const customer = new Customer(data);
        return await customer.save();
    }

    async findById(id: string): Promise<ICustomer | null> {
        return await Customer.findById(id);
    }

    async findAll(query?: string): Promise<ICustomer[]> {
        const filter: any = {};
        if (query) {
            filter.$or = [
                { name: { $regex: query, $options: 'i' } },
                { mobile: { $regex: query, $options: 'i' } },
                { address: { $regex: query, $options: 'i' } }
            ];
        }
        return await Customer.find(filter).sort({ createdAt: -1 });
    }

    async update(id: string, data: UpdateCustomerDTO): Promise<ICustomer | null> {
        return await Customer.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<boolean> {
        const result = await Customer.findByIdAndDelete(id);
        return !!result;
    }
}
