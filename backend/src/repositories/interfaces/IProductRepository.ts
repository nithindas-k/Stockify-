import { IProduct } from '../../models/Product';
import { CreateProductDTO, UpdateProductDTO } from '../../dtos/ProductDTO';

export interface IProductRepository {
    create(userId: string, data: CreateProductDTO): Promise<IProduct>;
    findById(userId: string, id: string): Promise<IProduct | null>;
    findBySku(userId: string, sku: string): Promise<IProduct | null>;
    findByName(userId: string, name: string): Promise<IProduct | null>;
    findAll(userId: string, query?: string, category?: string): Promise<IProduct[]>;
    update(userId: string, id: string, data: UpdateProductDTO): Promise<IProduct | null>;
    delete(userId: string, id: string): Promise<boolean>;
    findLowStock(userId: string): Promise<IProduct[]>;
}
