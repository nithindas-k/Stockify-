import { IProduct } from '../../models/Product';
import { CreateProductDTO, UpdateProductDTO } from '../../dtos/ProductDTO';

export interface IProductService {
    createProduct(userId: string, data: CreateProductDTO): Promise<IProduct>;
    getProductById(userId: string, id: string): Promise<IProduct>;
    getAllProducts(userId: string, query?: string, category?: string): Promise<IProduct[]>;
    updateProduct(userId: string, id: string, data: UpdateProductDTO): Promise<IProduct>;
    deleteProduct(userId: string, id: string): Promise<void>;
    getLowStockProducts(userId: string): Promise<IProduct[]>;
}
