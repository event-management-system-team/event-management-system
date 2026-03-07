import { useState } from 'react';
import { Form, message } from 'antd';
import recruitmentService from '../services/recruitment.service'

export const useApplicationForm = (recruitmentList, userProfile, eventSlug) => {

    const [form] = Form.useForm();
    const [selectedRole, setSelectedRole] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedPosition = recruitmentList?.find(r => r.recruitmentId === selectedRole);
    const isFull = selectedPosition && selectedPosition.availableSlots <= 0;

    const handleSubmit = async (values) => {
        setIsSubmitting(true);

        try {
            const formData = new FormData();

            formData.append('recruitmentId', selectedRole);
            formData.append('userId', userProfile.userId);

            const cvFile = values.cv[0].originFileObj;
            formData.append('files', cvFile);

            const { cv, ...answersOnlyText } = values;
            formData.append('answers', JSON.stringify(answersOnlyText));

            const responseData = await recruitmentService.postApplicationForm(eventSlug, formData);

            message.success("Your application has been submitted successfully!");

            form.resetFields();
            setSelectedRole('');

        } catch (error) {
            const errorMsg = error.response?.data || "Failed to submit application. Please try again!";
            message.error(errorMsg);
            console.error("Error submit form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        form,
        selectedRole,
        setSelectedRole,
        selectedPosition,
        isSubmitting,
        isFull,
        handleSubmit
    };
};