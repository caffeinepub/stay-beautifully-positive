import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export function useDailyMessage() {
    const { actor, isFetching } = useActor();

    return useQuery({
        queryKey: ['dailyMessage'],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not initialized');
            const result = await actor.getDailyMessage();
            // Backend returns { message: string }, normalize to expected shape
            return {
                text: result.message,
                author: 'Daily Inspiration',
                category: 'Positivity'
            };
        },
        enabled: !!actor && !isFetching,
        staleTime: 1000 * 60 * 60, // 1 hour - message changes daily
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
            // Don't retry on actor initialization errors
            if (error instanceof Error && error.message === 'Actor not initialized') {
                return false;
            }
            return failureCount < 2;
        },
    });
}

export function useStreakInfo() {
    const { actor, isFetching: actorFetching } = useActor();
    const { identity } = useInternetIdentity();

    return useQuery({
        queryKey: ['streakInfo', identity?.getPrincipal().toString()],
        queryFn: async () => {
            if (!actor || !identity) throw new Error('Actor or identity not available');
            const principal = identity.getPrincipal();
            const streak = await actor.getUserStreak(principal);
            return {
                streakCount: Number(streak),
                principal: principal.toString()
            };
        },
        enabled: !!actor && !actorFetching && !!identity,
        retry: 1,
        refetchOnWindowFocus: false,
    });
}

export function useMoodCheckIn() {
    const { actor } = useActor();
    const { identity } = useInternetIdentity();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            if (!actor) throw new Error('Actor not available');
            if (!identity) throw new Error('Please sign in to check in');
            
            const newStreak = await actor.updateDailyTracker();
            return Number(newStreak);
        },
        onMutate: async () => {
            // Capture the previous streak value from the cache
            const previousData = queryClient.getQueryData<{ streakCount: number; principal: string }>([
                'streakInfo',
                identity?.getPrincipal().toString()
            ]);
            
            return { previousStreak: previousData?.streakCount ?? 0 };
        },
        onSuccess: (newStreak) => {
            // Invalidate streak info to refresh the display
            queryClient.invalidateQueries({ queryKey: ['streakInfo'] });
            return newStreak;
        },
        onError: (error: any) => {
            // Handle authorization errors gracefully
            if (error.message?.includes('Unauthorized')) {
                throw new Error('Please sign in to check in');
            }
            throw error;
        }
    });
}

export function useCallerUserProfile() {
    const { actor, isFetching: actorFetching } = useActor();
    const { identity } = useInternetIdentity();

    const query = useQuery({
        queryKey: ['currentUserProfile', identity?.getPrincipal().toString()],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not available');
            return actor.getCallerUserProfile();
        },
        enabled: !!actor && !actorFetching && !!identity,
        retry: false,
    });

    return {
        ...query,
        isLoading: actorFetching || query.isLoading,
        isFetched: !!actor && query.isFetched,
    };
}

export function useSaveCallerUserProfile() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (profile: { name: string }) => {
            if (!actor) throw new Error('Actor not available');
            await actor.saveCallerUserProfile(profile);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
        }
    });
}
