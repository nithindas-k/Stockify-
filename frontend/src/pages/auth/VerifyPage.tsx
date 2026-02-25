import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { useAuthStore } from '../../store/authStore';
import { CheckCircle2, ChevronRight, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

const VerifyPage: React.FC = () => {
    const setAuth = useAuthStore((state) => state.setAuth);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [resendTimer, setResendTimer] = useState(60);

    const navigate = useNavigate();
    const location = useLocation();


    const { name, email, password } = location.state || {};

    useEffect(() => {

        if (!email) {
            navigate('/signup');
        }
    }, [email, navigate]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval!);
    }, [resendTimer]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await apiClient.post('/auth/verify-otp', { name, email, password, otp });
            // Log user in immediately and go to home
            setAuth(response.data.user, response.data.token);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid verification code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (resendTimer > 0) return;
        setResending(true);
        setError('');
        setSuccessMsg('');

        try {
            await apiClient.post('/auth/send-otp', { email });
            setResendTimer(60);
            setSuccessMsg('A new verification code has been sent.');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to resend code.');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans selection:bg-primary/20">
            <div className="w-full max-w-[420px] space-y-6 animate-in fade-in duration-700">
                <div className="flex flex-col items-center space-y-2 mb-2">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(157,0,255,0.3)]">
                        <div className="w-4 h-4 border-2 border-white rounded-sm rotate-12" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">Stockify</span>
                </div>

                <Card className="border-border/60 bg-card/30 backdrop-blur-sm shadow-xl rounded-2xl">
                    <CardHeader className="space-y-1.5 pb-6 text-center">
                        <CardTitle className="text-2xl font-semibold tracking-tight">Verify your email</CardTitle>
                        <CardDescription className="text-muted-foreground font-medium px-4">
                            We've sent a 6-digit confirmation code to <span className="text-foreground">{email}</span>
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

                        <form onSubmit={handleVerify} className="space-y-6">
                            <div className="space-y-3 text-center">
                                <Label htmlFor="otp" className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Confirmation Code</Label>
                                <Input
                                    id="otp"
                                    placeholder="000 000"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    className="h-16 text-center text-4xl tracking-[0.4em] font-black bg-white/[0.02] border-border/50 focus:border-primary transition-all rounded-xl text-primary"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_20px_0_rgba(157,0,255,0.3)] transition-all active:scale-95"
                                disabled={loading || otp.length !== 6}
                            >
                                {loading ? <Spinner /> : 'Complete Verification'}
                                {!loading && <ChevronRight className="w-4 h-4" />}
                            </Button>

                            <div className="flex flex-col items-center gap-4 pt-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Didn't receive the code?</span>
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        disabled={resendTimer > 0 || resending}
                                        className="text-primary font-bold hover:underline disabled:opacity-30 flex items-center gap-1.5 transition-all"
                                    >
                                        {resending ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Resend'}
                                        {resendTimer > 0 && <span>({resendTimer}s)</span>}
                                    </button>
                                </div>
                                <Link
                                    to="/signup"
                                    className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                                >
                                    <ArrowLeft className="w-3 h-3" />
                                    Use a different email
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-[10px] text-muted-foreground/40 font-medium uppercase tracking-[0.1em]">
                    Secure Infrastructure &copy; 2024 Stockify
                </p>
            </div>
        </div>
    );
};

export default VerifyPage;
