import { useQuery } from '@tanstack/react-query'
import eventService from '../services/event.service'

const useFetchEventSearch = (filters) => {
    return useQuery({
        queryKey: ['events', 'search', filters],
        queryFn: () => eventService.searchEvents(filters)
    })
}

export default useFetchEventSearch
