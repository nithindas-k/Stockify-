import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import apiClient from '../../api/apiClient';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const setAuth = useAuthStore((state) => state.setAuth);

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMsg(location.state.message);
            // Clear location state
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            const response = await apiClient.post('/auth/login', { email, password });
            setAuth(response.data.user, response.data.token);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 selection:bg-primary/20">
            <div className="w-full max-w-[420px] space-y-6 animate-in fade-in duration-700">
                {/* Brand Identity */}
                <div className="flex flex-col items-center space-y-2 mb-2">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(157,0,255,0.3)]">
                        <div className="w-4 h-4 border-2 border-white rounded-sm rotate-12" />
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
                        {error && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm font-semibold rounded-lg text-center animate-in fade-in zoom-in duration-200">
                                {error}
                            </div>
                        )}

                        {successMsg && !error && (
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-200">
                                <CheckCircle2 className="w-4 h-4" />
                                {successMsg}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                    className="h-11 border-border/50 focus:border-primary/50 transition-all rounded-lg pl-3"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
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
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-primary font-bold hover:underline underline-offset-4 decoration-2 transition-all">
                                Create Account
                            </Link>
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

export default LoginPage;
