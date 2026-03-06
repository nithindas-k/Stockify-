import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/auth/authService';
import { ChevronRight, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';


const SignupPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!name.trim()) {
            newErrors.name = 'Full name is required';
        } else if (name.trim().length < 3) {
            newErrors.name = 'Name must be at least 3 characters';
        }

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

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        try {
            const res = await authService.signup({ name, email, password });
            setAuth(res.data.user, res.data.token);
            toast.success('Welcome to Stockify! Account created successfully.');
            navigate('/');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = (id: string) => `
        h-11 border-border/50 focus:border-primary/50 transition-all rounded-lg pl-3 font-medium
        ${errors[id] ? 'border-destructive/60 bg-destructive/5' : ''}
    `;

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans selection:bg-primary/20">
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
                            Create account
                        </CardTitle>
                        <CardDescription className="text-center text-muted-foreground font-medium">
                            Join thousands of traders managing portfolios today.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="space-y-2 relative">
                                <Label htmlFor="name" className={errors.name ? 'text-destructive' : ''}>Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setName(e.target.value);
                                        if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                                    }}
                                    className={inputClasses('name')}
                                />
                                {errors.name && (
                                    <p className="text-[11px] font-semibold text-destructive mt-1 animate-in slide-in-from-top-1 duration-200">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
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
                                        placeholder="Create a strong password"
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
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className={errors.confirmPassword ? 'text-destructive' : ''}>Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Repeat your password"
                                        value={confirmPassword}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setConfirmPassword(e.target.value);
                                            if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                                        }}
                                        className={`${inputClasses('confirmPassword')} pr-10`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-[11px] font-semibold text-destructive mt-1 animate-in slide-in-from-top-1 duration-200">
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg mt-2 flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(157,0,255,0.2)] transition-all active:scale-95"
                                disabled={loading}
                            >
                                {loading ? <Spinner /> : 'Continue'}
                                {!loading && <ChevronRight className="w-4 h-4" />}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col pt-6 border-t border-border/40">
                        <p className="text-sm text-center text-muted-foreground font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4 decoration-2">
                                Log in
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

export default SignupPage;
