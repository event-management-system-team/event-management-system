import { useState } from 'react';
import { Form } from 'antd';

export const useApplicationForm = (recruitmentList, loggedInUser) => {

    const [form] = Form.useForm();
    const [selectedRole, setSelectedRole] = useState('');

    const selectedPosition = recruitmentList?.find(r => r.recruitmentId === selectedRole);
    const isFull = selectedPosition && selectedPosition.availableSlots <= 0;

    const handleSubmit = (values) => {
        const finalPayload = {
            recruitmentId: selectedRole,
            userId: loggedInUser.userId,
            answers: values
        };
        console.log('Payload gửi lên Server:', finalPayload);
        // axios.post('/api/...', finalPayload)
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