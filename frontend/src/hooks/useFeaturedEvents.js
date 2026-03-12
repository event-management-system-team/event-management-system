import eventService from '../services/event.service';
import { useQuery } from '@tanstack/react-query';

export const useFeaturedEvents = () => {

    return useQuery({
        queryKey: ['events', 'featured'],
        queryFn: () => eventService.getTopFeaturedEvents(),
    });
};