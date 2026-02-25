import { SaleRepository } from '../repositories/SaleRepository';
import { ProductRepository } from '../repositories/ProductRepository';
import { CreateSaleDTO } from '../dtos/SaleDTO';

export class SaleService {
    constructor(
        private saleRepository: SaleRepository,
        private productRepository: ProductRepository
    ) { }

    async createSale(saleData: CreateSaleDTO): Promise<any> {
        let totalAmount = 0;
        const processedItems = [];


        for (const item of saleData.items) {
            const product = await this.productRepository.findById(item.productId);
            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found`);
            }

            if (product.quantity < item.quantity) {
                throw new Error(`Insufficient stock for product: ${product.name}`);
            }

            const itemTotalPrice = product.price * item.quantity;
            totalAmount += itemTotalPrice;

            processedItems.push({
                productId: product._id,
                quantity: item.quantity,
                priceAtSale: product.price
            });
        }

        // 2. Decrease Stock in Inventory
        for (const item of saleData.items) {
            const product = await this.productRepository.findById(item.productId);
            if (product) {
                await this.productRepository.update(item.productId, {
                    quantity: product.quantity - item.quantity
                });
            }
        }

        // 3. Document Sale
        const finalSaleParam: any = {
            customerName: saleData.customerName,
            paymentMethod: saleData.paymentMethod,
            items: processedItems,
            totalAmount: totalAmount
        };

        if (saleData.customerId) {
            finalSaleParam.customerId = saleData.customerId;
        }

        return await this.saleRepository.create(finalSaleParam);
    }

    async getSale(id: string): Promise<any> {
        const sale = await this.saleRepository.findById(id);
        if (!sale) throw new Error('Sale not found');
        return sale;
    }

    async getAllSales(query?: string): Promise<any[]> {
        return await this.saleRepository.findAll(query);
    }
}
