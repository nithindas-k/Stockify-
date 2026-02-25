import { ISale } from '../../models/Sale';
import { CreateSaleDTO } from '../../dtos/SaleDTO';

export interface ISaleRepository {
    create(data: ISale): Promise<ISale>;
    findById(id: string): Promise<ISale | null>;
    findAll(query?: string): Promise<ISale[]>;
    findByCustomerId(customerId: string): Promise<ISale[]>;
}
