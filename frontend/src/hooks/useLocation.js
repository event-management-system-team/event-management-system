import { useQuery } from '@tanstack/react-query';
import eventService from '../services/event.service';
import { useTranslation } from 'react-i18next';

export const useLocation = () => {
    const { t } = useTranslation();

    return useQuery({
        queryKey: ['provinces'],
        queryFn: () => eventService.getProvinces(),
        select: (rawData) => {

            if (!rawData || !Array.isArray(rawData)) {
                return [{ value: '', label: t('everywhere') }];
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
                { value: '', label: t('everywhere') },
                ...formattedData
            ]
        }
    })
}

