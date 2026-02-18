import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStreakInfo } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Flame, RefreshCw, LogIn } from 'lucide-react';

export default function StreakCard() {
    const { identity } = useInternetIdentity();
    const { data: streakInfo, isLoading, error, refetch } = useStreakInfo();

    if (!identity) {
        return (
            <Card className="bg-white/70 backdrop-blur-md border-white/40 shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-calm-deep">
                        <Flame className="w-5 h-5 text-calm-rose" />
                        Your Streak
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-4 space-y-3">
                        <p className="text-calm-deep/60">Sign in to track your daily check-in streak</p>
                        <div className="flex justify-center">
                            <Button variant="outline" size="sm" disabled className="gap-2">
                                <LogIn className="w-4 h-4" />
                                Sign in above
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (isLoading) {
        return (
            <Card className="bg-white/70 backdrop-blur-md border-white/40 shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-calm-deep">
                        <Flame className="w-5 h-5 text-calm-rose" />
                        Your Streak
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-4">
                        <div className="h-16 bg-calm-sky/20 rounded-lg animate-pulse" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="bg-white/70 backdrop-blur-md border-white/40 shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-calm-deep">
                        <Flame className="w-5 h-5 text-calm-rose" />
                        Your Streak
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-4 space-y-3">
                        <p className="text-destructive text-sm">Failed to load streak</p>
                        <Button onClick={() => refetch()} variant="outline" size="sm" className="gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Retry
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const streakCount = streakInfo?.streakCount ?? 0;

    return (
        <Card className="bg-white/70 backdrop-blur-md border-white/40 shadow-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-calm-deep">
                    <Flame className="w-5 h-5 text-calm-rose" />
                    Your Streak
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-2">
                    <div className="inline-flex items-baseline gap-2">
                        <span className="text-5xl font-bold bg-gradient-to-r from-calm-rose via-calm-lavender to-calm-sky bg-clip-text text-transparent">
                            {streakCount}
                        </span>
                        <span className="text-lg text-calm-deep/60 font-medium">
                            {streakCount === 1 ? 'day' : 'days'}
                        </span>
                    </div>
                    {streakCount > 0 && (
                        <p className="text-sm text-calm-deep/50 mt-2">
                            Keep it going! 🎉
                        </p>
                    )}
                    {streakCount === 0 && (
                        <p className="text-sm text-calm-deep/50 mt-2">
                            Check in today to start your streak!
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
