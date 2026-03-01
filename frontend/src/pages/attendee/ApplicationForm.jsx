import SidebarPosition from '../../components/domain/application-form/SidebarPosition';
import FormContainer from '../../components/domain/application-form/FormContainer';
import { useApplicationForm } from '../../hooks/useApplicationForm';
import { Upload as UploadIcon, ChevronRight } from 'lucide-react';
import { Form, Input, Select, Upload } from 'antd'
import { useQuery } from '@tanstack/react-query'
import recruitmentService from '../../services/recruitment.service'
import LoadingState from '../../components/common/LoadingState'
import EmptyState from '../../components/common/EmptyState'
import { useParams } from 'react-router-dom';
import profileService from '../../services/profile.service'




const ApplicationFormPage = () => {

    const { eventSlug } = useParams();

    const { data: recruitmentData, isLoading, isError } = useQuery({
        queryKey: ['recruitments', eventSlug, 'applicationForm'],
        queryFn: () => recruitmentService.getApplicationForm(eventSlug),
        enabled: !!eventSlug,
    })

    const {
        data: userProfile,
        isLoading: isProfileLoading,
        isError: isProfileError
    } = useQuery({
        queryKey: ['myProfile'],
        queryFn: () => profileService.getMyProfile(),
    });

    const { form, selectedRole, setSelectedRole, selectedPosition, isFull, handleSubmit } = useApplicationForm(recruitmentData?.recruitments, userProfile);

    if (isLoading || isProfileLoading) {
        return <LoadingState />;
    }

    if (isError || !recruitmentData || isProfileError || !userProfile) {
        return <EmptyState />;
    }

    const { formSchema, eventName, deadline, location, recruitments } = recruitmentData;
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const renderDynamicField = (field) => {

        // [1] TYPE: DROPDOWN
        if (field.type === 'dropdown') {
            return (
                <Form.Item
                    name={field.fieldId}
                    rules={[{ required: field.required, message: 'Please select an item in the list!' }]}
                    className="m-0"
                >
                    <Select
                        size="large"
                        placeholder="-- Select an option --"
                        className="w-full h-12 [&_.ant-select-selector]:rounded-[16px] [&_.ant-select-selector]:border-[#d8ddde]"
                    >
                        {field.options?.map((opt, idx) => (
                            <Select.Option key={idx} value={opt}>{opt}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            );
        }

        // [2] TYPE: PARAGRAPH
        if (field.type === 'paragraph') {
            return (
                <Form.Item
                    name={field.fieldId}
                    rules={[{ required: field.required, message: 'Please fill out this field!' }]}
                    className="m-0"
                >
                    <Input.TextArea
                        placeholder={field.placeholder}
                        rows={4}
                        className="rounded-[16px] border-[#d8ddde] focus:border-[#89A8B2] hover:border-[#89A8B2] p-4 transition-all"
                    />
                </Form.Item>
            );
        }

        // [3] TYPE: FILE UPLOAD 
        if (field.type === 'file_upload') {
            return (
                <Form.Item
                    name={field.fieldId}
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[{ required: field.required, message: 'Please upload file!' }]}
                    className="m-0"
                >
                    <Upload.Dragger
                        name="file"
                        multiple={false}
                        maxCount={1}
                        beforeUpload={() => false}
                        className=" [&_.ant-upload]:p-8"
                    >
                        <p className="ant-upload-drag-icon flex justify-center">
                            <UploadIcon className="text-[#4ECDC4] w-8 h-8 mb-1 transition-transform group-hover:scale-110" />
                        </p>
                        <p className="ant-upload-text font-bold text-slate-500!">
                            Click to upload or drag & drop
                        </p>
                        <div className="mt-3 px-3 py-1 bg-white/60 rounded-full text-[10px] uppercase tracking-wider font-bold text-[#6a777c] inline-block">
                            Max file size: {field.maxSize || '5MB'}
                        </div>
                    </Upload.Dragger>
                </Form.Item>
            );
        }

        return null;
    };


    return (
        <div className="bg-[#F1F0E8] min-h-screen font-sans">
            <main className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8 items-start">

                <div className="flex-1 w-full space-y-6">

                    <div>
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 mb-4 text-[#6a777c] text-sm font-medium">
                            <span className="hover:text-[#89A8B2] cursor-pointer transition-colors">Recruitment</span>
                            <ChevronRight size={14} />
                            <span className="text-[#89A8B2]">Application</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-1">Staff Application</h1>
                        <p className="text-[#89A8B2] font-semibold text-lg">{eventName}</p>
                    </div>

                    {/* Form Container */}
                    <FormContainer
                        form={form}
                        recruitments={recruitments}
                        handleSubmit={handleSubmit}
                        selectedRole={selectedRole}
                        setSelectedRole={setSelectedRole}
                        userProfile={userProfile}
                        formSchema={formSchema}
                        renderDynamicField={renderDynamicField}
                        isFull={isFull}
                    />
                </div>

                <SidebarPosition
                    isFull={isFull}
                    selectedPosition={selectedPosition}
                    deadline={deadline}
                    location={location}
                />

            </main>
        </div>
    );
}



export default ApplicationFormPage;