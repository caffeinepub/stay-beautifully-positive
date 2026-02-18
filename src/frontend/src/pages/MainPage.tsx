import { useEffect, useState } from 'react';
import { useDailyMessage, useCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useShareAffirmation } from '../hooks/useShareAffirmation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SiCaffeine } from 'react-icons/si';
import { RefreshCw, Sparkles, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import LoginButton from '../components/LoginButton';
import StreakCard from '../components/StreakCard';
import MoodCheckInCard from '../components/MoodCheckInCard';
import ProfileSetupDialog from '../components/ProfileSetupDialog';
import { APP_VERSION } from '../version';

export default function MainPage() {
    const { data: dailyMessage, isLoading: messageLoading, error: messageError, refetch } = useDailyMessage();
    const { identity } = useInternetIdentity();
    const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useCallerUserProfile();
    const { shareAffirmation, isSharing } = useShareAffirmation();
    const [showContent, setShowContent] = useState(false);
    const [hasShownError, setHasShownError] = useState(false);

    const isAuthenticated = !!identity;
    const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

    useEffect(() => {
        const timer = setTimeout(() => setShowContent(true), 300);
        return () => clearTimeout(timer);
    }, []);

    // Show toast on genuine error (not actor initialization errors)
    useEffect(() => {
        if (messageError) {
            const errorMessage = messageError instanceof Error ? messageError.message : String(messageError);
            // Only show error toast for genuine backend failures, not initialization issues
            if (!errorMessage.includes('Actor not initialized') && !hasShownError) {
                toast.error('Failed to load daily message', {
                    description: 'Please try again or check your connection.',
                });
                setHasShownError(true);
            }
        } else {
            setHasShownError(false);
        }
    }, [messageError, hasShownError]);

    const handleRetry = () => {
        setHasShownError(false);
        refetch();
    };

    const handleShare = () => {
        if (dailyMessage?.text) {
            shareAffirmation(dailyMessage.text);
        }
    };

    // Determine if we should show error UI (only for genuine errors)
    const showError = messageError && messageError instanceof Error && !messageError.message.includes('Actor not initialized');

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background with gradient overlay */}
            <div className="fixed inset-0 -z-10">
                <img 
                    src="/assets/generated/background-gradient.dim_1920x1080.png" 
                    alt="" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-calm-sky/40 via-calm-lavender/30 to-calm-rose/40" />
            </div>

            {/* Profile Setup Dialog */}
            <ProfileSetupDialog open={showProfileSetup} />

            {/* Main Content */}
            <main className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <header className="w-full py-6 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-calm-sky to-calm-lavender flex items-center justify-center shadow-glow">
                                <span className="text-white text-xl font-bold">✨</span>
                            </div>
                            <h1 className="text-xl sm:text-2xl font-semibold text-calm-deep tracking-tight">
                                Stay Beautifully Positive
                            </h1>
                        </div>
                        <LoginButton />
                    </div>
                </header>

                {/* Announcement Banner */}
                <div className="w-full px-4 sm:px-6 lg:px-8 mb-6">
                    <div className="max-w-7xl mx-auto">
                        <Card className="bg-gradient-to-r from-calm-sky/20 via-calm-lavender/20 to-calm-rose/20 backdrop-blur-md border-white/40 shadow-lg rounded-2xl px-4 py-3 sm:px-6 sm:py-4">
                            <div className="flex items-center justify-center gap-2 sm:gap-3">
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-calm-sky flex-shrink-0" />
                                <p className="text-sm sm:text-base font-medium text-calm-deep text-center">
                                    You're on a streak! Keep up the great work.
                                </p>
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-calm-rose flex-shrink-0" />
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Center Content */}
                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                    <div className={`w-full max-w-5xl transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        {/* Motto Card */}
                        <div className="text-center mb-12 animate-gentle-pulse">
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-calm-sky via-calm-lavender to-calm-rose bg-clip-text text-transparent mb-4 leading-tight">
                                Stay Beautifully Positive
                            </h2>
                            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-calm-sky via-calm-lavender to-calm-rose rounded-full shadow-glow" />
                        </div>

                        {/* Daily Message Card */}
                        <Card className="bg-white/70 backdrop-blur-md border-white/40 shadow-2xl p-8 sm:p-12 rounded-3xl transition-all duration-500 hover:shadow-glow-lg mb-8">
                            {messageLoading ? (
                                <div className="text-center space-y-4">
                                    <div className="h-6 bg-calm-sky/20 rounded-full w-3/4 mx-auto animate-pulse" />
                                    <div className="h-6 bg-calm-sky/20 rounded-full w-full animate-pulse" />
                                    <div className="h-6 bg-calm-sky/20 rounded-full w-5/6 mx-auto animate-pulse" />
                                </div>
                            ) : showError ? (
                                <div className="text-center space-y-4">
                                    <div className="inline-block px-4 py-2 bg-destructive/10 rounded-full">
                                        <p className="text-sm font-medium text-destructive uppercase tracking-wider">
                                            Error Loading Message
                                        </p>
                                    </div>
                                    <p className="text-calm-deep/60">
                                        We couldn't load today's inspiration. Please try again.
                                    </p>
                                    <Button 
                                        onClick={handleRetry}
                                        variant="outline"
                                        className="mt-4"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Retry
                                    </Button>
                                </div>
                            ) : dailyMessage ? (
                                <div className="space-y-6 text-center">
                                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-calm-sky/20 to-calm-lavender/20 rounded-full">
                                        <p className="text-sm font-medium text-calm-deep/70 uppercase tracking-wider">
                                            Today's Inspiration
                                        </p>
                                    </div>
                                    
                                    <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-serif text-calm-deep leading-relaxed italic">
                                        "{dailyMessage.text}"
                                    </blockquote>
                                    
                                    <div className="pt-4">
                                        <p className="text-lg text-calm-deep/60 font-medium">
                                            — {dailyMessage.author}
                                        </p>
                                        <div className="mt-3 inline-block px-3 py-1 bg-calm-lavender/20 rounded-full">
                                            <p className="text-xs text-calm-deep/50 uppercase tracking-wide">
                                                {dailyMessage.category}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Share Button */}
                                    <div className="pt-4">
                                        <Button
                                            onClick={handleShare}
                                            disabled={isSharing}
                                            variant="outline"
                                            className="bg-white/50 hover:bg-white/70 border-calm-sky/30 hover:border-calm-sky/50 text-calm-deep transition-all duration-300"
                                        >
                                            <Share2 className="w-4 h-4 mr-2" />
                                            {isSharing ? 'Sharing...' : 'Share Affirmation'}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center text-calm-deep/60">No message available</p>
                            )}
                        </Card>

                        {/* Mood Check-In and Streak Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <MoodCheckInCard />
                            <StreakCard />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="w-full py-6 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto text-center space-y-2">
                        <p className="text-sm text-calm-deep/50 flex items-center justify-center gap-2 flex-wrap">
                            <span>© {new Date().getFullYear()}. Built with</span>
                            <span className="inline-flex items-center gap-1 text-calm-rose">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                            </span>
                            <span>using</span>
                            <a 
                                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-calm-deep/70 hover:text-calm-sky transition-colors font-medium"
                            >
                                <SiCaffeine className="w-4 h-4" />
                                caffeine.ai
                            </a>
                        </p>
                        <p className="text-xs text-calm-deep/30">
                            {APP_VERSION}
                        </p>
                    </div>
                </footer>
            </main>
        </div>
    );
}
