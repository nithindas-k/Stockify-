import { ISale } from '../../models/Sale';
import { CreateSaleDTO } from '../../dtos/SaleDTO';

export interface ISaleRepository {
    create(data: ISale): Promise<ISale>;
    findById(userId: string, id: string): Promise<ISale | null>;
    findAll(userId: string, query?: string, startDate?: string, endDate?: string): Promise<ISale[]>;
    findByCustomerId(userId: string, customerId: string): Promise<ISale[]>;
}
