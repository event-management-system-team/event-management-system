import { useQuery } from '@tanstack/react-query'
import eventService from '../services/event.service'

const useFetchEventSearch = (keyword, location) => {
    return useQuery({
        queryKey: ['events', 'search', keyword, location],
        queryFn: () => eventService.searchEvents(keyword, location)
    })
}

export default useFetchEventSearch
