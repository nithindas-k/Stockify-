import { ISaleRepository } from '../repositories/interfaces/ISaleRepository';
import { IProductRepository } from '../repositories/interfaces/IProductRepository';
import { CreateSaleDTO } from '../dtos/SaleDTO';
import { INotificationService } from './interfaces/INotificationService';
import { ISaleService } from './interfaces/ISaleService';

export class SaleService implements ISaleService {
    constructor(
        private saleRepository: ISaleRepository,
        private productRepository: IProductRepository,
        private notificationService: INotificationService
    ) { }

    async createSale(saleData: CreateSaleDTO): Promise<any> {
        let totalAmount = 0;
        const processedItems = [];

        for (const item of saleData.items) {
            const product = await this.productRepository.findById(saleData.userId as string, item.productId);
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

        for (const item of saleData.items) {
            const product = await this.productRepository.findById(saleData.userId as string, item.productId);
            if (product) {
                const newQuantity = product.quantity - item.quantity;
                await this.productRepository.update(saleData.userId as string, item.productId, {
                    quantity: newQuantity
                });

                // Check for low stock notification (< 5 as requested or based on threshold)
                if (newQuantity < 5) {
                    await this.notificationService.createLowStockNotification(
                        saleData.userId as string,
                        product._id.toString(),
                        product.name,
                        newQuantity
                    );
                }
            }
        }

        const finalSaleParam: any = {
            customerName: saleData.customerName,
            paymentMethod: saleData.paymentMethod,
            items: processedItems,
            totalAmount: totalAmount
        };

        if (saleData.customerId) {
            finalSaleParam.customerId = saleData.customerId;
        }

        if (saleData.userId) {
            finalSaleParam.userId = saleData.userId;
        }

        return await this.saleRepository.create(finalSaleParam);
    }

    async getSale(userId: string, id: string): Promise<any> {
        const sale = await this.saleRepository.findById(userId, id);
        if (!sale) throw new Error('Sale not found');
        return sale;
    }

    async getAllSales(userId: string, query?: string): Promise<any[]> {
        return await this.saleRepository.findAll(userId, query);
    }
}
