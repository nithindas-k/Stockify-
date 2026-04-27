import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '../ui/button';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
       
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private _handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    private _handleReload = () => {
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background p-4 flex-col text-center space-y-6 animate-in fade-in duration-500">
                    <div className="w-20 h-20 bg-destructive/10 rounded-2xl flex items-center justify-center border border-destructive/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                        <AlertTriangle className="w-10 h-10 text-destructive" />
                    </div>

                    <div className="space-y-2 max-w-md">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">Something went wrong</h1>
                        <p className="text-muted-foreground font-medium">
                            We've encountered an unexpected error. Don't worry, your data is safe.
                        </p>
                    </div>

                    {import.meta.env.DEV && this.state.error && (
                        <div className="w-full max-w-2xl bg-muted/50 border border-border rounded-lg p-4 text-left overflow-auto max-h-48">
                            <p className="text-xs font-mono text-destructive break-words">
                                {this.state.error.toString()}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                        <Button
                            onClick={this._handleReload}
                            className="flex-1 gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-12 rounded-xl text-base font-bold transition-all active:scale-95"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            Try Again
                        </Button>
                        <Button
                            variant="outline"
                            onClick={this._handleReset}
                            className="flex-1 gap-2 border-border hover:bg-muted h-12 rounded-xl text-base font-bold transition-all active:scale-95"
                        >
                            <Home className="w-4 h-4" />
                            Go to Home
                        </Button>
                    </div>

                    <p className="text-[10px] text-muted-foreground/40 font-medium uppercase tracking-[0.2em]">
                        Stockify Rescue Protocol &copy; 2026
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
