import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Package, Users, ShoppingCart,
    BarChart3, LogOut, Bell, PanelLeft, TrendingUp
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '../ui/alert-dialog';

/* ─── constants ────────────────────────────────────────────── */
const SIDEBAR_W = 280;
const ICON_W = 56;
const MOBILE_BP = 768;

/* ─── nav config ────────────────────────────────────────────── */
const navMain = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: ShoppingCart, label: 'Sales', path: '/sales' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
];
const navAccount = [
    { icon: Bell, label: 'Notifications', path: '/notifications' },
];

/* ─── inner body (same HTML for both render modes) ─────────── */
interface SidebarInnerProps {
    showLabels: boolean;
    pathname: string;
    onNav: (path: string) => void;
    user: { name?: string; email?: string } | null;
    logout: () => void;
}

function SidebarInner({ showLabels, pathname, onNav, user, logout }: SidebarInnerProps) {
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

    return (
        <>
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 border-b border-border/40 h-14 shrink-0">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                    <TrendingUp className="size-4 text-white" />
                </div>
                {showLabels && (
                    <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                        Stockify
                    </span>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-6">
                <div>
                    {showLabels && (
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-2 mb-2">
                            Main Menu
                        </p>
                    )}
                    <ul className="space-y-1">
                        {navMain.map((item) => {
                            const active = pathname === item.path;
                            return (
                                <li key={item.label}>
                                    <button
                                        onClick={() => onNav(item.path)}
                                        title={!showLabels ? item.label : undefined}
                                        className={`w-full flex items-center gap-3 rounded-lg text-sm font-medium
                                            transition-colors whitespace-nowrap px-2 py-2
                                            ${showLabels ? '' : 'justify-center'}
                                            ${active
                                                ? 'bg-primary/15 text-primary border border-primary/20'
                                                : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                                    >
                                        <item.icon className="size-4 shrink-0" />
                                        {showLabels && <span>{item.label}</span>}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div>
                    {showLabels && (
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-2 mb-2">
                            Account
                        </p>
                    )}
                    <ul className="space-y-1">
                        {navAccount.map((item) => {
                            const active = pathname === item.path;
                            return (
                                <li key={item.label}>
                                    <button
                                        onClick={() => onNav(item.path)}
                                        title={!showLabels ? item.label : undefined}
                                        className={`w-full flex items-center gap-3 rounded-lg text-sm font-medium
                                            transition-colors whitespace-nowrap px-2 py-2
                                            ${showLabels ? '' : 'justify-center'}
                                            ${active
                                                ? 'bg-primary/15 text-primary border border-primary/20'
                                                : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                                    >
                                        <item.icon className="size-4 shrink-0" />
                                        {showLabels && <span>{item.label}</span>}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>

            {/* User footer */}
            <div className="border-t border-border/40 px-2 py-3 space-y-1 shrink-0">
                {showLabels ? (
                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="size-8 shrink-0 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">{user?.name?.[0]?.toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                            <p className="text-xs text-white/40 truncate">{user?.email}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center py-1">
                        <div className="size-8 shrink-0 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">{user?.name?.[0]?.toUpperCase()}</span>
                        </div>
                    </div>
                )}
                <AlertDialog open={isLogoutConfirmOpen} onOpenChange={setIsLogoutConfirmOpen}>
                    <button
                        onClick={() => setIsLogoutConfirmOpen(true)}
                        title={!showLabels ? 'Logout' : undefined}
                        className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium
                            text-red-400 hover:bg-red-500/10 transition-colors
                            ${showLabels ? '' : 'justify-center'}`}
                    >
                        <LogOut className="size-4 shrink-0" />
                        {showLabels && <span>Logout</span>}
                    </button>
                    <AlertDialogContent className="bg-card border-border rounded-xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Ready to leave?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to log out? You will need to sign back in to access your data.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-transparent border-white/10 text-foreground hover:bg-white/5">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={logout} className="bg-red-500 hover:bg-red-600 text-white shadow-md">
                                Logout
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    );
}

export function useSidebarToggle() {
    return _publishedToggle;
}

let _publishedToggle: () => void = () => { };


export function UserSidebar() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BP);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [desktopOpen, setDesktopOpen] = useState(true);

    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const toggle = useCallback(() => {
        if (window.innerWidth < MOBILE_BP) setMobileOpen((v) => !v);
        else setDesktopOpen((v) => !v);
    }, []);


    _publishedToggle = toggle;

    useEffect(() => {
        const handler = () => {
            const mobile = window.innerWidth < MOBILE_BP;
            setIsMobile(mobile);
            if (!mobile) setMobileOpen(false);
        };
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);

    const handleNav = (path: string) => {
        navigate(path);
        if (window.innerWidth < MOBILE_BP) setMobileOpen(false);
    };

    const showLabels = isMobile ? true : desktopOpen;
    const innerProps: SidebarInnerProps = { showLabels, pathname, onNav: handleNav, user, logout };
    const base = 'flex flex-col h-full bg-[hsl(240_10%_4%)] border-r border-border/50 overflow-hidden';

    return (
        <>
            {/* Mobile backdrop */}
            {isMobile && mobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {isMobile ? (
                /* Mobile: fixed overlay */
                <aside
                    style={{ width: SIDEBAR_W }}
                    className={`fixed inset-y-0 left-0 z-40 ${base}
                        transition-transform duration-200 ease-in-out
                        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <SidebarInner {...innerProps} />
                </aside>
            ) : (
                /* Desktop: inline push */
                <aside
                    style={{
                        width: desktopOpen ? SIDEBAR_W : ICON_W,
                        minWidth: desktopOpen ? SIDEBAR_W : ICON_W,
                    }}
                    className={`shrink-0 ${base} transition-[width,min-width] duration-200 ease-in-out`}
                >
                    <SidebarInner {...innerProps} />
                </aside>
            )}
        </>
    );
}

/* ─── convenience toggle button ─────────────────────────────── */
export function SidebarToggleBtn() {
    const toggle = useSidebarToggle();
    return (
        <button
            onClick={toggle}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            title="Toggle sidebar"
        >
            <PanelLeft className="size-4" />
        </button>
    );
}
