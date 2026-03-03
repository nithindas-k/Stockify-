import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { UserSidebar, SidebarToggleBtn } from '../../components/user/UserSidebar';
import {
    Package, Users, TrendingUp,
    AlertTriangle, BarChart3, ChevronRight,
    ShoppingBag,
} from 'lucide-react';
import { NotificationBell } from '../../components/notifications/NotificationBell';
import { dashboardService } from '../../services/dashboard/dashboardService';
import type { DashboardStats } from '../../services/dashboard/dashboardService';
import { Spinner } from '../../components/ui/spinner';

export default function Dashboard() {
    const user = useAuthStore((s) => s.user);
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await dashboardService.getStats();
                setStats(res.data.data);
            } catch (err) {
                console.error('Failed to fetch dashboard stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Items', value: stats?.totalProducts ?? 0, trend: 'Total inventory items', icon: Package, color: 'text-blue-400', urgent: false },
        { label: 'Total Sales', value: `₹${(stats?.totalRevenue ?? 0).toLocaleString()}`, trend: 'Total revenue generated', icon: TrendingUp, color: 'text-emerald-400', urgent: false },
        { label: 'Customers', value: stats?.totalCustomers ?? 0, trend: 'Unique client base', icon: Users, color: 'text-violet-400', urgent: false },
        { label: 'Low Stock', value: stats?.lowStockCount ?? 0, trend: stats?.lowStockCount! > 0 ? 'Requires attention' : 'Inventory healthy', icon: AlertTriangle, color: 'text-red-400', urgent: (stats?.lowStockCount ?? 0) > 0 },
    ];

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
            <UserSidebar />

            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3
                    border-b border-border/40 bg-background/80 backdrop-blur-sm px-4">
                    <SidebarToggleBtn />
                    <div className="h-5 w-px bg-border/50 hidden sm:block" />
                    <span className="text-sm font-medium text-muted-foreground hidden sm:block">Dashboard</span>
                    <div className="flex-1" />
                    <NotificationBell />
                    <div className="size-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{user?.name?.[0]?.toUpperCase()}</span>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="mb-6 md:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                            Welcome back, <span className="text-foreground font-semibold">{user?.name}</span>.
                            Here's what's happening today.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center p-20">
                            <Spinner />
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6 md:mb-8">
                                {statCards.map((s) => (
                                    <div key={s.label} className="rounded-xl border border-border/50 bg-card/40 hover:border-primary/20 hover:bg-card/60 p-5 flex flex-col gap-3 transition-all group cursor-default">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</span>
                                            <s.icon className={`size-4 ${s.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold tracking-tight">{s.value}</p>
                                            <p className={`text-xs mt-1 font-medium ${s.urgent ? 'text-destructive' : 'text-emerald-500'}`}>{s.trend}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="rounded-xl border border-border/50 bg-card/40 p-5 md:p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-base font-semibold">Recent Sales</h2>
                                    <button
                                        onClick={() => navigate('/sales')}
                                        className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
                                    >
                                        View all <ChevronRight className="size-3" />
                                    </button>
                                </div>
                                {stats && stats.recentSales.length > 0 ? (
                                    <div className="space-y-4">
                                        {stats.recentSales.map((sale) => (
                                            <div key={sale.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-border/50">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-9 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                                        <ShoppingBag className="size-4 text-emerald-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">{sale.customer}</p>
                                                        <p className="text-xs text-muted-foreground">{new Date(sale.date).toLocaleDateString()} • {sale.items} items</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-emerald-400">₹{sale.amount.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <BarChart3 className="size-8 text-muted-foreground/30 mb-3" />
                                        <p className="text-sm text-muted-foreground">No recent transactions to display.</p>
                                        <p className="text-xs text-muted-foreground/50 mt-1">Sales will appear here once you start trading.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
