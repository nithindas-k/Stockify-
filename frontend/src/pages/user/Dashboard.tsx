import { useAuthStore } from '../../store/authStore';
import { UserSidebar, SidebarToggleBtn } from '../../components/user/UserSidebar';
import {
    Package, Users, TrendingUp,
    AlertTriangle, BarChart3, Bell, ChevronRight,
} from 'lucide-react';

/* ─── stats ─────────────────────────────────────────────────── */
const stats = [
    { label: 'Total Items', value: '1,234', trend: '+12% this month', icon: Package, color: 'text-blue-400', urgent: false },
    { label: 'Total Sales', value: '$45,678', trend: '+8% this month', icon: TrendingUp, color: 'text-emerald-400', urgent: false },
    { label: 'Customers', value: '567', trend: '+24 this week', icon: Users, color: 'text-violet-400', urgent: false },
    { label: 'Low Stock', value: '12', trend: 'Requires attention', icon: AlertTriangle, color: 'text-red-400', urgent: true },
];

export default function Dashboard() {
    const user = useAuthStore((s) => s.user);

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">

            {/* Sidebar — self-contained, publishes toggle internally */}
            <UserSidebar />

            {/* Main content */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

                {/* Top bar */}
                <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3
                    border-b border-border/40 bg-background/80 backdrop-blur-sm px-4">
                    <SidebarToggleBtn />

                    <div className="h-5 w-px bg-border/50 hidden sm:block" />
                    <span className="text-sm font-medium text-muted-foreground hidden sm:block">
                        Dashboard
                    </span>
                    <div className="flex-1" />

                    <button className="relative p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
                        <Bell className="size-4" />
                        <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />
                    </button>
                    <div className="size-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">
                            {user?.name?.[0]?.toUpperCase()}
                        </span>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

                    <div className="mb-6 md:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                            Welcome back,{' '}
                            <span className="text-foreground font-semibold">{user?.name}</span>.
                            Here's what's happening today.
                        </p>
                    </div>

                    {/* Stats — 1 → 2 → 4 cols */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6 md:mb-8">
                        {stats.map((s) => (
                            <div
                                key={s.label}
                                className="rounded-xl border border-border/50 bg-card/40
                                    hover:border-primary/20 hover:bg-card/60 p-5
                                    flex flex-col gap-3 transition-all group cursor-default"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        {s.label}
                                    </span>
                                    <s.icon className={`size-4 ${s.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold tracking-tight">{s.value}</p>
                                    <p className={`text-xs mt-1 font-medium ${s.urgent ? 'text-destructive' : 'text-emerald-500'}`}>
                                        {s.trend}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent activity */}
                    <div className="rounded-xl border border-border/50 bg-card/40 p-5 md:p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-base font-semibold">Recent Activity</h2>
                            <button className="text-xs text-primary hover:underline font-medium flex items-center gap-1">
                                View all <ChevronRight className="size-3" />
                            </button>
                        </div>
                        <div className="flex flex-col items-center justify-center py-12">
                            <BarChart3 className="size-8 text-muted-foreground/30 mb-3" />
                            <p className="text-sm text-muted-foreground">No recent transactions to display.</p>
                            <p className="text-xs text-muted-foreground/50 mt-1">
                                Sales will appear here once you start trading.
                            </p>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}
