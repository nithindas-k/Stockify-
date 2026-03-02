import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentProcessingProps {
    isOpen: boolean;
    onComplete: () => void;
    amount: number;
}

export const PaymentProcessing: React.FC<PaymentProcessingProps> = ({ isOpen, onComplete, amount }) => {
    const [step, setStep] = useState<'verifying' | 'processing' | 'success'>('verifying');

    useEffect(() => {
        if (isOpen) {
            setStep('verifying');
            const timer1 = setTimeout(() => setStep('processing'), 1000);
            const timer2 = setTimeout(() => setStep('success'), 2500);
            const timer3 = setTimeout(() => {
                onComplete();
            }, 4500);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
            };
        }
    }, [isOpen, onComplete]);

    useEffect(() => {
        if (step === 'success') {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#9d00ff', '#00d1ff', '#ffffff']
            });
        }
    }, [step]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-xl p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full sm:max-w-md p-6 sm:p-10 bg-card border border-white/10 rounded-[2rem] sm:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
            >
                {/* Background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -z-10" />

                <div className="flex flex-col items-center text-center space-y-6">
                    <AnimatePresence mode="wait">
                        {step === 'verifying' && (
                            <motion.div
                                key="verifying"
                                initial={{ opacity: 0, rotate: -20 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="relative"
                            >
                                <div className="size-20 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                                    <ShieldCheck className="size-10 text-primary animate-pulse" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 size-6 bg-background border border-border rounded-full flex items-center justify-center">
                                    <Loader2 className="size-4 text-primary animate-spin" />
                                </div>
                            </motion.div>
                        )}

                        {step === 'processing' && (
                            <motion.div
                                key="processing"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="relative"
                            >
                                <div className="size-20 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                                    <CreditCard className="size-10 text-blue-500" />
                                </div>
                                <div className="absolute inset-0 border-4 border-blue-500/30 border-t-blue-500 rounded-2xl animate-spin" />
                            </motion.div>
                        )}

                        {step === 'success' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1, rotate: [0, -10, 10, 0] }}
                                className="size-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20"
                            >
                                <CheckCircle2 className="size-12 text-green-500" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            {step === 'verifying' && "Verifying Transaction"}
                            {step === 'processing' && "Processing Payment"}
                            {step === 'success' && "Payment Successful!"}
                        </h2>
                        <p className="text-muted-foreground">
                            {step === 'verifying' && "Checking transaction integrity..."}
                            {step === 'processing' && `Securing payment of ₹${amount.toFixed(2)}`}
                            {step === 'success' && "Sale has been recorded successfully."}
                        </p>
                    </div>

                    {step !== 'success' && (
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: step === 'verifying' ? "40%" : "100%" }}
                                transition={{ duration: step === 'verifying' ? 1 : 1.5 }}
                                className="h-full bg-primary shadow-[0_0_10px_rgba(157,0,255,0.5)]"
                            />
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
