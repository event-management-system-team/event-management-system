import { useState, useEffect } from 'react';
import eventService from '../services/event.service';

export const useFeaturedEvents = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsLoading(true);
                const data = await eventService.getTopFeaturedEvents();
                setEvents(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load event list');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return { events, isLoading, error };
};