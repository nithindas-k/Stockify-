import { IProduct } from '../../models/Product';
import { CreateProductDTO, UpdateProductDTO } from '../../dtos/ProductDTO';

export interface IProductRepository {
    create(data: CreateProductDTO): Promise<IProduct>;
    findById(id: string): Promise<IProduct | null>;
    findBySku(sku: string): Promise<IProduct | null>;
    findAll(query?: string, category?: string): Promise<IProduct[]>;
    update(id: string, data: UpdateProductDTO): Promise<IProduct | null>;
    delete(id: string): Promise<boolean>;
    findLowStock(): Promise<IProduct[]>;
}
