import { IProduct } from '../../models/Product';
import { CreateProductDTO, UpdateProductDTO } from '../../dtos/ProductDTO';

export interface IProductService {
    createProduct(data: CreateProductDTO): Promise<IProduct>;
    getProductById(id: string): Promise<IProduct>;
    getAllProducts(query?: string, category?: string): Promise<IProduct[]>;
    updateProduct(id: string, data: UpdateProductDTO): Promise<IProduct>;
    deleteProduct(id: string): Promise<void>;
    getLowStockProducts(): Promise<IProduct[]>;
}
