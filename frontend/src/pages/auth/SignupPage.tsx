import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

const SignupPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await apiClient.post('/auth/send-otp', { email });
            // Navigate to verify page with user data
            navigate('/verify', {
                state: { name, email, password }
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans selection:bg-primary/20">
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
                            Create account
                        </CardTitle>
                        <CardDescription className="text-center text-muted-foreground font-medium">
                            Join thousands of traders managing portfolios today.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm font-semibold rounded-lg text-center animate-in fade-in zoom-in duration-200">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                    className="h-11 border-border/50 focus:border-primary/50 transition-all rounded-lg pl-3 font-medium"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                    className="h-11 border-border/50 focus:border-primary/50 transition-all rounded-lg pl-3 font-medium"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Create a strong password"
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                    className="h-11 border-border/50 focus:border-primary/50 transition-all rounded-lg pl-3 font-medium"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Repeat your password"
                                    value={confirmPassword}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                                    className="h-11 border-border/50 focus:border-primary/50 transition-all rounded-lg pl-3 font-medium"
                                    required
                                />
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
                    Stockify Financial Services &copy; 2024
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
