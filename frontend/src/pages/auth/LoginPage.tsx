import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/auth/authService';
import { ChevronRight, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const navigate = useNavigate();
    const location = useLocation();
    const setAuth = useAuthStore((state) => state.setAuth);

    useEffect(() => {
        if (location.state?.message) {
            toast.success(location.state.message);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            newErrors.email = 'Email address is required';
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        try {
            const response = await authService.login({ email, password });
            setAuth(response.data.user, response.data.token);
            navigate('/');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = (id: string) => `
        h-11 border-border/50 focus:border-primary/50 transition-all rounded-lg pl-3
        ${errors[id] ? 'border-destructive/60 bg-destructive/5' : ''}
    `;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 selection:bg-primary/20">
            <div className="w-full max-w-[420px] space-y-6 animate-in fade-in duration-700">
                {/* Brand Identity */}
                <div className="flex flex-col items-center space-y-2 mb-2">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">Stockify</span>
                </div>

                <Card className="border-border/60 bg-card/30 backdrop-blur-sm shadow-xl rounded-2xl">
                    <CardHeader className="space-y-1.5 pb-6">
                        <CardTitle className="text-2xl font-semibold tracking-tight text-center">
                            Welcome back
                        </CardTitle>
                        <CardDescription className="text-center text-muted-foreground font-medium">
                            Please enter your details to sign in to your account.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className={errors.email ? 'text-destructive' : ''}>Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setEmail(e.target.value);
                                        if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                                    }}
                                    className={inputClasses('email')}
                                />
                                {errors.email && (
                                    <p className="text-[11px] font-semibold text-destructive mt-1 animate-in slide-in-from-top-1 duration-200">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className={errors.password ? 'text-destructive' : ''}>Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setPassword(e.target.value);
                                            if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                                        }}
                                        className={`${inputClasses('password')} pr-10`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-[11px] font-semibold text-destructive mt-1 animate-in slide-in-from-top-1 duration-200">
                                        {errors.password}
                                    </p>
                                )}
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
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-primary font-bold hover:underline underline-offset-4 decoration-2 transition-all">
                                Create Account
                            </Link>
                        </p>
                    </CardFooter>
                </Card>

                <p className="text-center text-[10px] text-muted-foreground/40 font-medium uppercase tracking-[0.1em]">
                    Stockify Financial Services &copy; 2026
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
