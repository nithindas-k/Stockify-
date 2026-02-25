import React, { useEffect, useState } from 'react';
import { AdminSidebar, AdminSidebarToggleBtn } from '../../components/admin/AdminSidebar';
import { useAuthStore } from '../../store/authStore';
import { ShoppingBag, Search, Bell, Calendar, User as UserIcon } from 'lucide-react';
import { saleService } from '../../services/sale/saleService';
import { toast } from 'sonner';

// Shadcn components
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Spinner } from '../../components/ui/spinner';
import { Badge } from '../../components/ui/badge';

interface Sale {
    _id: string;
    customerName: string;
    totalAmount: number;
    saleDate: string;
    paymentMethod: string;
    items: {
        productId: { name: string, _id: string };
        quantity: number;
        priceAtSale: number;
    }[];
    userId?: {
        _id: string;
        name: string;
        email: string;
    };
}

const AdminOrdersPage: React.FC = () => {
    const adminUser = useAuthStore((s) => s.user);
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    const fetchSales = async () => {
        setLoading(true);
        try {
            const res = await saleService.getAll({ search });
            setSales(res.data.data || res.data);
        } catch (error: any) {
            toast.error('Failed to load global sales');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, [search]);

    // Apply client-side date filter if selected
    const filteredSales = sales.filter(sale => {
        if (!dateFilter) return true;

        const saleDate = new Date(sale.saleDate).toISOString().split('T')[0];
        return saleDate === dateFilter;
    });

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
            <AdminSidebar />

            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border/40 bg-background/80 backdrop-blur-sm px-4">
                    <AdminSidebarToggleBtn />

                    <div className="h-5 w-px bg-border/50 hidden sm:block" />
                    <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                        Global Orders & Sales
                    </span>
                    <div className="flex-1" />

                    <button className="relative p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
                        <Bell className="size-4" />
                    </button>
                    <div className="size-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                        <span className="text-xs font-bold text-amber-400">
                            {adminUser?.name?.[0]?.toUpperCase() ?? 'A'}
                        </span>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by customer name..."
                                className="pl-9 bg-card border-border border-white/5"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Calendar className="w-4 h-4 text-muted-foreground hidden sm:block" />
                            <Input
                                type="date"
                                className="bg-card border-border border-white/5 w-full sm:w-auto"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                            {dateFilter && (
                                <button
                                    onClick={() => setDateFilter('')}
                                    className="text-xs text-primary hover:text-primary/80 ml-2"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-card overflow-hidden shadow-lg">
                        <Table>
                            <TableHeader className="bg-white/5">
                                <TableRow className="hover:bg-transparent border-white/10">
                                    <TableHead className="font-semibold text-foreground">Transaction ID & Date</TableHead>
                                    <TableHead className="font-semibold text-foreground">Processed By</TableHead>
                                    <TableHead className="font-semibold text-foreground">Customer</TableHead>
                                    <TableHead className="font-semibold text-foreground">Payment</TableHead>
                                    <TableHead className="text-right font-semibold text-foreground">Total Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-64 text-center">
                                            <Spinner className="mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : filteredSales.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-64 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center gap-4 opacity-50">
                                                <ShoppingBag className="size-12" />
                                                <p>No sales records found.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredSales.map((sale) => (
                                        <TableRow key={sale._id} className="border-white/5 hover:bg-white/5 transition-colors group">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 transition-colors">
                                                        <ShoppingBag className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-foreground text-xs uppercase tracking-wider">TXN-{sale._id.slice(-6)}</div>
                                                        <div className="text-xs text-muted-foreground">{new Date(sale.saleDate).toLocaleString()}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {sale.userId ? (
                                                    <div className="flex items-center gap-2">
                                                        <UserIcon className="w-4 h-4 text-primary" />
                                                        <span className="text-sm font-medium">{sale.userId.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground italic">System / Unknown</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-foreground">{sale.customerName}</div>
                                                <div className="text-xs text-muted-foreground">{sale.items.length} unique items</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="border-white/10">{sale.paymentMethod}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="font-bold text-lg text-primary">₹{sale.totalAmount.toFixed(2)}</div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminOrdersPage;
