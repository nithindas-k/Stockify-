import React, { useEffect, useState } from 'react';
import { UserSidebar, SidebarToggleBtn } from '../../components/user/UserSidebar';
import { useAuthStore } from '../../store/authStore';
import { FileText, TrendingUp, PackageSearch, Users, Bell } from 'lucide-react';
import { reportService } from '../../services/report/reportService';
import { customerService } from '../../services/customer/customerService';
import { toast } from 'sonner';

// Shadcn components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Spinner } from '../../components/ui/spinner';
import { Badge } from '../../components/ui/badge';

interface SummaryCardProps {
    title: string;
    value: React.ReactNode;
    subtitle?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, subtitle }) => (
    <div className="bg-card border border-white/10 rounded-xl p-5 shadow-lg flex flex-col justify-center">
        <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
);

const ReportsPage: React.FC = () => {
    const user = useAuthStore((s) => s.user);

    // Sales Report state
    const [salesReport, setSalesReport] = useState<any>(null);
    const [salesLoading, setSalesLoading] = useState(false);

    // Items Report state
    const [itemsReport, setItemsReport] = useState<any>(null);
    const [itemsLoading, setItemsLoading] = useState(false);

    // Customer Ledger state
    const [ledgerReport, setLedgerReport] = useState<any>(null);
    const [ledgerLoading, setLedgerLoading] = useState(false);

    // Dependencies
    const [customers, setCustomers] = useState<any[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');

    const fetchSales = async () => {
        setSalesLoading(true);
        try {
            const res = await reportService.getSalesReport();
            setSalesReport(res.data.data || res.data);
        } catch (error: any) {
            toast.error('Failed to load Sales Report');
        } finally {
            setSalesLoading(false);
        }
    };

    const fetchItems = async () => {
        setItemsLoading(true);
        try {
            const res = await reportService.getInventoryReport();
            setItemsReport(res.data.data || res.data);
        } catch (error: any) {
            toast.error('Failed to load Items Report');
        } finally {
            setItemsLoading(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            const res = await customerService.getAll();
            setCustomers(res.data.data || res.data);
        } catch (error) { }
    };

    const fetchLedger = async (customerId: string) => {
        if (!customerId) return;
        setLedgerLoading(true);
        try {
            const res = await reportService.getCustomerLedger(customerId);
            setLedgerReport(res.data.data || res.data);
        } catch (error: any) {
            toast.error('Failed to load Customer Ledger');
            setLedgerReport(null);
        } finally {
            setLedgerLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
        fetchItems();
        fetchCustomers();
    }, []);

    useEffect(() => {
        if (selectedCustomerId) {
            fetchLedger(selectedCustomerId);
        }
    }, [selectedCustomerId]);

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
            <UserSidebar />

            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border/40 bg-background/80 backdrop-blur-sm px-4">
                    <SidebarToggleBtn />
                    <div className="h-5 w-px bg-border/50 hidden sm:block" />
                    <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                        Analytics & Reports
                    </span>
                    <div className="flex-1" />
                    <button className="relative p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
                        <Bell className="size-4" />
                    </button>
                    <div className="size-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">
                            {user?.name?.[0]?.toUpperCase() ?? 'U'}
                        </span>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <Tabs defaultValue="sales" className="w-full space-y-6">
                        <TabsList className="bg-card border border-white/10 p-1 flex w-full max-w-md mx-auto sm:mx-0">
                            <TabsTrigger value="sales" className="flex-1 gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg">
                                <TrendingUp className="w-4 h-4" /> Sales
                            </TabsTrigger>
                            <TabsTrigger value="items" className="flex-1 gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg">
                                <PackageSearch className="w-4 h-4" /> Items
                            </TabsTrigger>
                            <TabsTrigger value="ledger" className="flex-1 gap-2 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg">
                                <Users className="w-4 h-4" /> Ledger
                            </TabsTrigger>
                        </TabsList>

                        {/* --- SALES REPORT TAB --- */}
                        <TabsContent value="sales" className="space-y-6 animate-in fade-in-50 zoom-in-95 duration-300">
                            {salesLoading ? (
                                <Spinner className="mx-auto" />
                            ) : salesReport ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <SummaryCard title="Total Revenue" value={`₹${salesReport.summary?.totalRevenue?.toFixed(2) || '0.00'}`} subtitle="Across selected period" />
                                        <SummaryCard title="Total Transactions" value={salesReport.summary?.totalSales || 0} subtitle="Count of completed sales" />
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-card overflow-hidden shadow-lg">
                                        <Table>
                                            <TableHeader className="bg-white/5">
                                                <TableRow className="border-white/10">
                                                    <TableHead>Transaction</TableHead>
                                                    <TableHead>Customer</TableHead>
                                                    <TableHead>Items Count</TableHead>
                                                    <TableHead className="text-right">Total Amount</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {salesReport.sales?.length === 0 ? (
                                                    <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No sales found.</TableCell></TableRow>
                                                ) : (
                                                    salesReport.sales?.map((s: any) => (
                                                        <TableRow key={s._id} className="border-white/5">
                                                            <TableCell>
                                                                <div className="font-semibold text-xs tracking-wider">TXN-{s._id.slice(-6).toUpperCase()}</div>
                                                                <div className="text-[10px] text-muted-foreground">{new Date(s.saleDate).toLocaleString()}</div>
                                                            </TableCell>
                                                            <TableCell>{s.customerName}</TableCell>
                                                            <TableCell>{s.items?.length}</TableCell>
                                                            <TableCell className="text-right font-medium text-primary">₹{s.totalAmount?.toFixed(2)}</TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </>
                            ) : null}
                        </TabsContent>

                        {/* --- ITEMS REPORT TAB --- */}
                        <TabsContent value="items" className="space-y-6 animate-in fade-in-50 zoom-in-95 duration-300">
                            {itemsLoading ? (
                                <Spinner className="mx-auto" />
                            ) : itemsReport ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <SummaryCard title="Total Catalog Items" value={itemsReport.summary?.totalItems || 0} />
                                        <SummaryCard title="Inventory Value" value={`₹${itemsReport.summary?.totalValue?.toFixed(2) || '0.00'}`} subtitle="Capital locked in stock" />
                                        <SummaryCard title="Low Stock Warnings" value={itemsReport.summary?.lowStockItems || 0} subtitle="Items below threshold" />
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-card overflow-hidden shadow-lg">
                                        <Table>
                                            <TableHeader className="bg-white/5">
                                                <TableRow className="border-white/10">
                                                    <TableHead>Product</TableHead>
                                                    <TableHead>Category</TableHead>
                                                    <TableHead className="text-right">Stock Level</TableHead>
                                                    <TableHead className="text-right">Stock Value</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {itemsReport.items?.length === 0 ? (
                                                    <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No items found.</TableCell></TableRow>
                                                ) : (
                                                    itemsReport.items?.map((item: any) => (
                                                        <TableRow key={item._id} className="border-white/5">
                                                            <TableCell>
                                                                <div className="font-medium">{item.name}</div>
                                                                <div className="text-[10px] text-muted-foreground max-w-[200px] truncate">{item.description}</div>
                                                            </TableCell>
                                                            <TableCell><Badge variant="outline" className="text-[10px]">{item.category}</Badge></TableCell>
                                                            <TableCell className="text-right">
                                                                <span className={item.quantity <= item.lowStockThreshold ? 'text-destructive font-bold' : ''}>
                                                                    {item.quantity}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="text-right font-medium text-emerald-500">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </>
                            ) : null}
                        </TabsContent>

                        {/* --- CUSTOMER LEDGER TAB --- */}
                        <TabsContent value="ledger" className="space-y-6 animate-in fade-in-50 zoom-in-95 duration-300">
                            <div className="bg-card border border-white/10 rounded-xl p-6 shadow-lg space-y-4">
                                <h3 className="text-lg font-medium">Customer Selection</h3>
                                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                                    <SelectTrigger className="w-full max-w-md bg-background border-border">
                                        <SelectValue placeholder="Search or select a customer to view ledger..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers.map((c: any) => (
                                            <SelectItem key={c._id} value={c._id}>{c.name} ({c.mobile})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {ledgerLoading ? (
                                <Spinner className="mx-auto mt-8" />
                            ) : ledgerReport && selectedCustomerId ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <SummaryCard title="Lifetime Purchases" value={ledgerReport.summary?.totalPurchases || 0} />
                                        <SummaryCard title="Lifetime Spent" value={`₹${ledgerReport.summary?.totalSpent?.toFixed(2) || '0.00'}`} />
                                    </div>

                                    <div className="rounded-xl border border-white/10 bg-card overflow-hidden shadow-lg mt-6">
                                        <Table>
                                            <TableHeader className="bg-white/5">
                                                <TableRow className="border-white/10">
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Transaction ID</TableHead>
                                                    <TableHead>Payment Method</TableHead>
                                                    <TableHead className="text-right">Amount</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {ledgerReport.transactions?.length === 0 ? (
                                                    <TableRow><TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No transactions found for this customer.</TableCell></TableRow>
                                                ) : (
                                                    ledgerReport.transactions?.map((t: any) => (
                                                        <TableRow key={t._id} className="border-white/5">
                                                            <TableCell className="text-sm">{new Date(t.saleDate).toLocaleDateString()}</TableCell>
                                                            <TableCell className="font-semibold text-xs tracking-wider">TXN-{t._id.slice(-6).toUpperCase()}</TableCell>
                                                            <TableCell><Badge variant="outline" className="text-[10px]">{t.paymentMethod}</Badge></TableCell>
                                                            <TableCell className="text-right font-medium text-primary">₹{t.totalAmount.toFixed(2)}</TableCell>
                                                        </TableRow>
                                                    ))
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </>
                            ) : selectedCustomerId ? (
                                <div className="text-center text-muted-foreground mt-12 flex flex-col items-center">
                                    <FileText className="w-12 h-12 mb-4 opacity-20" />
                                    <p>Select a customer to view their transactions.</p>
                                </div>
                            ) : null}
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </div>
    );
};

export default ReportsPage;
