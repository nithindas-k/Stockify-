export interface IDashboardService {
    getStats(userId: string): Promise<any>;
}
