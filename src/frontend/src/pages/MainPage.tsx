import { useEffect, useState } from 'react';
import { useDailyMessage, useAppMotto } from '../hooks/useQueries';
import { Card } from '@/components/ui/card';
import { SiCaffeine } from 'react-icons/si';

export default function MainPage() {
    const { data: dailyMessage, isLoading: messageLoading } = useDailyMessage();
    const { data: motto, isLoading: mottoLoading } = useAppMotto();
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowContent(true), 300);
        return () => clearTimeout(timer);
    }, []);

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

            {/* Main Content */}
            <main className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <header className="w-full py-6 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto flex justify-center items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-calm-sky to-calm-lavender flex items-center justify-center shadow-glow">
                                <span className="text-white text-xl font-bold">✨</span>
                            </div>
                            <h1 className="text-xl sm:text-2xl font-semibold text-calm-deep tracking-tight">
                                Stay Beautifully Positive
                            </h1>
                        </div>
                    </div>
                </header>

                {/* Center Content */}
                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                    <div className={`w-full max-w-3xl transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        {/* Motto Card */}
                        <div className="text-center mb-12 animate-gentle-pulse">
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-calm-sky via-calm-lavender to-calm-rose bg-clip-text text-transparent mb-4 leading-tight">
                                {mottoLoading ? 'Loading...' : motto}
                            </h2>
                            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-calm-sky via-calm-lavender to-calm-rose rounded-full shadow-glow" />
                        </div>

                        {/* Daily Message Card */}
                        <Card className="bg-white/70 backdrop-blur-md border-white/40 shadow-2xl p-8 sm:p-12 rounded-3xl transition-all duration-500 hover:shadow-glow-lg">
                            {messageLoading ? (
                                <div className="text-center space-y-4">
                                    <div className="h-6 bg-calm-sky/20 rounded-full w-3/4 mx-auto animate-pulse" />
                                    <div className="h-6 bg-calm-sky/20 rounded-full w-full animate-pulse" />
                                    <div className="h-6 bg-calm-sky/20 rounded-full w-5/6 mx-auto animate-pulse" />
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
                                </div>
                            ) : (
                                <p className="text-center text-calm-deep/60">No message available</p>
                            )}
                        </Card>
                    </div>
                </div>

                {/* Footer */}
                <footer className="w-full py-6 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto text-center">
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
                    </div>
                </footer>
            </main>
        </div>
    );
}
