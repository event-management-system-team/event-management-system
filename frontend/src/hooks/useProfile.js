import { useState, useEffect } from 'react';
import axiosInstance from '../config/axios';

const useProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosInstance.get('/profile/me')
            .then(res => setProfile(res.data))
            .catch(() => setProfile(null))
            .finally(() => setLoading(false));
    }, []);

    return { profile, loading };
};

export default useProfile;
