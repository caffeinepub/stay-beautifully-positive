import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { InspirationalMessage } from '../backend';

export function useDailyMessage() {
    const { actor, isFetching } = useActor();

    return useQuery<InspirationalMessage>({
        queryKey: ['dailyMessage'],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.getDailyMessage();
        },
        enabled: !!actor && !isFetching,
        staleTime: 1000 * 60 * 60, // 1 hour - message changes daily
        refetchOnWindowFocus: false,
    });
}

export function useAppMotto() {
    const { actor, isFetching } = useActor();

    return useQuery<string>({
        queryKey: ['appMotto'],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.getAppMotto();
        },
        enabled: !!actor && !isFetching,
        staleTime: Infinity, // Motto never changes
        refetchOnWindowFocus: false,
    });
}

export function useAllMessages() {
    const { actor, isFetching } = useActor();

    return useQuery<InspirationalMessage[]>({
        queryKey: ['allMessages'],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.getAllMessages();
        },
        enabled: !!actor && !isFetching,
        staleTime: Infinity,
    });
}

export function useMessagesByCategory(category: string) {
    const { actor, isFetching } = useActor();

    return useQuery<InspirationalMessage[]>({
        queryKey: ['messagesByCategory', category],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.getMessageByCategory(category);
        },
        enabled: !!actor && !isFetching && !!category,
        staleTime: Infinity,
    });
}
