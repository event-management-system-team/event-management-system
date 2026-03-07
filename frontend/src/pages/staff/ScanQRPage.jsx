import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import staffService from '../../services/staff.service';

const ScanQRPage = () => {
    const navigate = useNavigate();
    const { eventSlug } = useParams();

    const { data } = useQuery({
        queryKey: ['workspace', eventSlug],
        queryFn: () => staffService.getWorkspace(eventSlug),
        enabled: !!eventSlug
    });

    useEffect(() => {
        if (data) {
            const role = data.staffRole?.toLowerCase() || '';
            const isCheckInStaff = role.includes('check-in') || role.includes('check in');

            if (!isCheckInStaff) {

                alert('You not allow access QR Scan');

                navigate(`/staff/${eventSlug}`, { replace: true });
            }
        }
    }, [data, navigate, eventSlug]);

    return (
        <div>QR Scan</div>
    );
};

export default ScanQRPage;