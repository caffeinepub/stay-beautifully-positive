import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMoodCheckIn } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Smile, Meh, Frown, Heart, Sparkles, LogIn } from 'lucide-react';
import { toast } from 'sonner';

const moods = [
    { id: 'great', label: 'Great', icon: Sparkles, color: 'text-calm-sky' },
    { id: 'good', label: 'Good', icon: Smile, color: 'text-calm-lavender' },
    { id: 'okay', label: 'Okay', icon: Meh, color: 'text-calm-rose' },
    { id: 'low', label: 'Low', icon: Frown, color: 'text-calm-deep/50' },
];

export default function MoodCheckInCard() {
    const { identity } = useInternetIdentity();
    const { mutate: checkIn, isPending } = useMoodCheckIn();
    const [selectedMood, setSelectedMood] = useState<string | null>(null);

    const handleCheckIn = () => {
        if (!identity) {
            toast.error('Please sign in first', {
                description: 'You need to be signed in to check in.',
            });
            return;
        }

        if (!selectedMood) {
            toast.error('Select a mood', {
                description: 'Please select how you\'re feeling today.',
            });
            return;
        }

        checkIn(undefined, {
            onSuccess: (newStreak, _variables, context) => {
                const previousStreak = context?.previousStreak ?? 0;
                
                // Show celebratory message only when streak was extended
                if (newStreak > previousStreak) {
                    toast.success('🎉 Streak extended!', {
                        description: `Amazing! You're on a ${newStreak}-day streak. Keep it going!`,
                        duration: 4000,
                    });
                } else {
                    // Already checked in today
                    toast.success('Check-in successful!', {
                        description: `Your streak is ${newStreak} ${newStreak === 1 ? 'day' : 'days'}.`,
                    });
                }
                setSelectedMood(null);
            },
            onError: (error: any) => {
                if (error.message?.includes('sign in')) {
                    toast.error('Please sign in', {
                        description: 'You need to be signed in to check in.',
                    });
                } else {
                    toast.info('Already checked in today', {
                        description: 'You\'ve already checked in today. Come back tomorrow!',
                    });
                }
            }
        });
    };

    if (!identity) {
        return (
            <Card className="bg-white/70 backdrop-blur-md border-white/40 shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-calm-deep">
                        <Heart className="w-5 h-5 text-calm-rose" />
                        Daily Check-In
                    </CardTitle>
                    <CardDescription>
                        Track your mood and build a streak
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-4 space-y-3">
                        <p className="text-calm-deep/60">Sign in to check in and track your mood</p>
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

    return (
        <Card className="bg-white/70 backdrop-blur-md border-white/40 shadow-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-calm-deep">
                    <Heart className="w-5 h-5 text-calm-rose" />
                    Daily Check-In
                </CardTitle>
                <CardDescription>
                    How are you feeling today?
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {moods.map((mood) => {
                        const Icon = mood.icon;
                        const isSelected = selectedMood === mood.id;
                        return (
                            <button
                                key={mood.id}
                                onClick={() => setSelectedMood(mood.id)}
                                disabled={isPending}
                                className={`p-4 rounded-xl border-2 transition-all ${
                                    isSelected
                                        ? 'border-calm-sky bg-calm-sky/10 shadow-glow'
                                        : 'border-white/40 bg-white/40 hover:border-calm-sky/50 hover:bg-white/60'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <Icon className={`w-8 h-8 mx-auto mb-2 ${mood.color}`} />
                                <p className="text-sm font-medium text-calm-deep">{mood.label}</p>
                            </button>
                        );
                    })}
                </div>
                <Button
                    onClick={handleCheckIn}
                    disabled={!selectedMood || isPending}
                    className="w-full bg-gradient-to-r from-calm-sky to-calm-lavender hover:from-calm-sky/90 hover:to-calm-lavender/90 text-white shadow-glow"
                >
                    {isPending ? 'Checking in...' : 'Check In'}
                </Button>
            </CardContent>
        </Card>
    );
}
