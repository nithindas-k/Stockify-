export interface ISaleService {
    createSale(data: any): Promise<any>;
    getSale(userId: string, id: string): Promise<any>;
    getAllSales(userId: string, query?: string): Promise<any[]>;
}
