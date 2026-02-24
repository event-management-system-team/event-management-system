import { useQuery } from '@tanstack/react-query';
import eventService from '../services/event.service';


export const useLocation = () => {

    return useQuery({
        queryKey: ['provinces'],
        queryFn: () => eventService.getProvinces(),
        select: (rawData) => {

            if (!rawData || !Array.isArray(rawData)) {
                return [{ value: '', label: 'Everywhere' }];
            }

            const formattedData = rawData.map(province => {

                let value = province.name
                    .replace('Thành phố ', '')
                    .replace('Tỉnh ', '');

                return {
                    value: value,
                    label: province.name,
                    code: province.code,
                };
            });

            return [
                { value: '', label: 'Everywhere' },
                ...formattedData
            ]
        }
    })
}

