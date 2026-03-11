import { ICustomerRepository } from './interfaces/ICustomerRepository';
import Customer, { ICustomer } from '../models/Customer';
import { CreateCustomerDTO, UpdateCustomerDTO } from '../dtos/CustomerDTO';

export class CustomerRepository implements ICustomerRepository {
    async create(userId: string, data: CreateCustomerDTO): Promise<ICustomer> {
        const customer = new Customer({ ...data, userId });
        return await customer.save();
    }

    async findById(userId: string, id: string): Promise<ICustomer | null> {
        return await Customer.findOne({ _id: id, userId });
    }

    async findByMobile(userId: string, mobile: string): Promise<ICustomer | null> {
        return await Customer.findOne({ userId, mobile });
    }

    async findAll(userId: string, query?: string): Promise<ICustomer[]> {
        const filter: any = { userId };
        if (query) {
            filter.$or = [
                { name: { $regex: query, $options: 'i' } },
                { mobile: { $regex: query, $options: 'i' } },
                { address: { $regex: query, $options: 'i' } }
            ];
        }
        return await Customer.find(filter).sort({ createdAt: -1 });
    }

    async update(userId: string, id: string, data: UpdateCustomerDTO): Promise<ICustomer | null> {
        return await Customer.findOneAndUpdate({ _id: id, userId }, data, { new: true });
    }

    async delete(userId: string, id: string): Promise<boolean> {
        const result = await Customer.findOneAndDelete({ _id: id, userId });
        return !!result;
    }
}
