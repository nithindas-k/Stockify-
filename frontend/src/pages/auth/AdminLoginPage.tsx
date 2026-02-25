import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { adminAuthService } from '../../services/auth/authService';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

const AdminLoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await adminAuthService.login({ email, password });
            const { user, token } = response.data;

            if (user.role !== 'admin') {
                toast.error('Access denied. Admin accounts only.');
                setLoading(false);
                return;
            }

            setAuth(user, token);
            toast.success('Welcome back, Admin!');
            navigate('/admin/dashboard');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 selection:bg-primary/20">
            <div className="w-full max-w-[420px] space-y-6 animate-in fade-in duration-700">

                {/* Brand Identity */}
                <div className="flex flex-col items-center space-y-2 mb-2">
                    <div className="relative">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_24px_rgba(157,0,255,0.45)]">
                            <div className="w-5 h-5 border-2 border-white rounded-sm rotate-12" />
                        </div>
                        {/* Admin badge */}
                        <div className="absolute -bottom-1.5 -right-1.5 bg-amber-500 rounded-full p-0.5 shadow-md">
                            <ShieldCheck className="w-3 h-3 text-white" />
                        </div>
                    </div>
                    <div className="text-center">
                        <span className="text-xl font-bold tracking-tight text-foreground">Stockify</span>
                        <p className="text-[11px] text-amber-500 font-semibold tracking-widest uppercase mt-0.5">
                            Admin Portal
                        </p>
                    </div>
                </div>

                <Card className="border-border/60 bg-card/30 backdrop-blur-sm shadow-xl rounded-2xl">
                    <CardHeader className="space-y-1.5 pb-6">
                        <CardTitle className="text-2xl font-semibold tracking-tight text-center">
                            Admin Sign In
                        </CardTitle>
                        <CardDescription className="text-center text-muted-foreground font-medium">
                            Restricted access. Authorised personnel only.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="admin-email">Email address</Label>
                                <Input
                                    id="admin-email"
                                    type="email"
                                    placeholder="admin@stockify.com"
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                    className="h-11 border-border/50 focus:border-primary/50 transition-all rounded-lg pl-3"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="admin-password">Password</Label>
                                <Input
                                    id="admin-password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                    className="h-11 border-border/50 focus:border-primary/50 transition-all rounded-lg pl-3"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg mt-2 flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(157,0,255,0.2)] transition-all active:scale-95"
                                disabled={loading}
                            >
                                {loading ? <Spinner /> : 'Sign In'}
                                {!loading && <ChevronRight className="w-4 h-4" />}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col pt-6 border-t border-border/40">
                        <p className="text-sm text-center text-muted-foreground font-medium">
                            Not an admin?{' '}
                            <a
                                href="/login"
                                className="text-primary font-bold hover:underline underline-offset-4 decoration-2 transition-all"
                            >
                                User Login
                            </a>
                        </p>
                    </CardFooter>
                </Card>

                <p className="text-center text-[10px] text-muted-foreground/40 font-medium uppercase tracking-[0.1em]">
                    Stockify Financial Services &copy; 2024
                </p>
            </div>
        </div>
    );
};

export default AdminLoginPage;
