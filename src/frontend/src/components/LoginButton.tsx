import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

export default function LoginButton() {
    const { login, clear, loginStatus, identity } = useInternetIdentity();
    const queryClient = useQueryClient();

    const isAuthenticated = !!identity;
    const isLoggingIn = loginStatus === 'logging-in';

    const handleAuth = async () => {
        if (isAuthenticated) {
            await clear();
            queryClient.clear();
        } else {
            try {
                await login();
            } catch (error: any) {
                console.error('Login error:', error);
                if (error.message === 'User is already authenticated') {
                    await clear();
                    setTimeout(() => login(), 300);
                }
            }
        }
    };

    return (
        <Button
            onClick={handleAuth}
            disabled={isLoggingIn}
            variant={isAuthenticated ? 'outline' : 'default'}
            className={`transition-all ${
                isAuthenticated
                    ? 'bg-white/80 hover:bg-white text-calm-deep border-calm-sky/30'
                    : 'bg-gradient-to-r from-calm-sky to-calm-lavender hover:from-calm-sky/90 hover:to-calm-lavender/90 text-white border-0 shadow-glow'
            }`}
        >
            {isLoggingIn ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                </>
            ) : isAuthenticated ? (
                <>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                </>
            ) : (
                <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                </>
            )}
        </Button>
    );
}
