import { useState } from 'react';
import { Form } from 'antd';

export const useApplicationForm = (recruitmentList, userProfile) => {

    const [form] = Form.useForm();
    const [selectedRole, setSelectedRole] = useState('');

    const selectedPosition = recruitmentList?.find(r => r.recruitmentId === selectedRole);
    const isFull = selectedPosition && selectedPosition.availableSlots <= 0;

    const handleSubmit = (values) => {
        const formData = new FormData();

        formData.append('recruitmentId', selectedRole);
        formData.append('userId', userProfile.userId);

        const cvFile = values.cv[0].originFileObj;
        formData.append('files', cvFile);

        const { cv, ...answersOnlyText } = values;

        formData.append('answers', JSON.stringify(answersOnlyText));

        // axiosInstance.post('/api/recruitments/bridgefest/apply-staff', formData)

        console.log('--- KIỂM TRA KIỆN HÀNG FORMDATA ---');
        for (let [key, value] of formData.entries()) {
            console.log(`🔑 Ngăn [${key}]:`, value);
        }
        console.log('-----------------------------------');
    };

    return {
        form,
        selectedRole,
        setSelectedRole,
        selectedPosition,
        isFull,
        handleSubmit
    };
};