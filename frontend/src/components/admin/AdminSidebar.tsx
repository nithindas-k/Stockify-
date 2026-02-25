import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Package, Users, ShoppingCart,
    BarChart3, LogOut, Bell, Settings, PanelLeft, ShieldCheck,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

/* ─── constants ────────────────────────────────────────────── */
const SIDEBAR_W = 280;
const ICON_W = 56;
const MOBILE_BP = 768;

/* ─── nav config ────────────────────────────────────────────── */
const navMain = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Package, label: 'Inventory', path: '/admin/inventory' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
];
const navAccount = [
    { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

/* ─── inner body ────────────────────────────────────────────── */
interface SidebarInnerProps {
    showLabels: boolean;
    pathname: string;
    onNav: (path: string) => void;
    user: { name?: string; email?: string } | null;
    logout: () => void;
}

function SidebarInner({ showLabels, pathname, onNav, user, logout }: SidebarInnerProps) {
    return (
        <>
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 border-b border-border/40 h-14 shrink-0">
                <div className="relative flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-[0_0_14px_rgba(157,0,255,0.4)]">
                    <div className="size-3.5 rounded-sm border-2 border-white rotate-12" />
                    {/* Admin shield badge */}
                    <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-0.5">
                        <ShieldCheck className="size-2.5 text-white" />
                    </div>
                </div>
                {showLabels && (
                    <div>
                        <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                            Stockify
                        </span>
                        <p className="text-[9px] text-amber-500 font-bold tracking-widest uppercase leading-none">
                            Admin
                        </p>
                    </div>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-6">
                <div>
                    {showLabels && (
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-2 mb-2">
                            Management
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

            {/* Admin footer */}
            <div className="border-t border-border/40 px-2 py-3 space-y-1 shrink-0">
                {showLabels ? (
                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="size-8 shrink-0 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                            <span className="text-xs font-bold text-amber-400">
                                {user?.name?.[0]?.toUpperCase() ?? 'A'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                                <p className="text-sm font-semibold text-white truncate">{user?.name ?? 'Admin'}</p>
                                <span className="text-[9px] bg-amber-500/20 text-amber-400 font-bold px-1.5 py-0.5 rounded-full leading-none border border-amber-500/30">
                                    ADMIN
                                </span>
                            </div>
                            <p className="text-xs text-white/40 truncate">{user?.email}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center py-1">
                        <div className="size-8 shrink-0 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                            <span className="text-xs font-bold text-amber-400">
                                {user?.name?.[0]?.toUpperCase() ?? 'A'}
                            </span>
                        </div>
                    </div>
                )}
                <button
                    onClick={logout}
                    title={!showLabels ? 'Logout' : undefined}
                    className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium
                        text-red-400 hover:bg-red-500/10 transition-colors
                        ${showLabels ? '' : 'justify-center'}`}
                >
                    <LogOut className="size-4 shrink-0" />
                    {showLabels && <span>Logout</span>}
                </button>
            </div>
        </>
    );
}

/* ─── module-level toggle slot ──────────────────────────────── */
let _adminToggle: () => void = () => { };

export function useAdminSidebarToggle() {
    return _adminToggle;
}

/* ─── exported component ────────────────────────────────────── */
export function AdminSidebar() {
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

    _adminToggle = toggle;

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
export function AdminSidebarToggleBtn() {
    const toggle = useAdminSidebarToggle();
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
