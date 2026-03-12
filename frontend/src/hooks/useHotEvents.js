import eventService from '../services/event.service';
import { useQuery } from '@tanstack/react-query';

export const useHotEvents = () => {
    return useQuery({
        queryKey: ['events', 'hot'],
        queryFn: () => eventService.getTopHotEvents(),
    })
};

