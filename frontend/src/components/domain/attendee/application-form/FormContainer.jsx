import SelectionRole from './SelectionRole'
import PersonalInformation from './PersonalInformation'
import DynamicQuestion from './DynamicQuestion'
import { Loader2, Send } from 'lucide-react'
import { Checkbox, Form } from 'antd'

const FormContainer = ({ form, handleSubmit, isFull,
    selectedRole, setSelectedRole, userProfile, isSubmitting,
    renderDynamicField, formSchema, recruitments }) => {

    return (
        <div className="bg-white rounded-[28px] shadow-sm border border-[#eceeef] overflow-hidden">
            <Form
                form={form}
                onFinish={handleSubmit}
                layout='vertical'
                style={{
                    padding: '36px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '40px'
                }}
            >

                <SelectionRole
                    recruitments={recruitments}
                    selectedRole={selectedRole}
                    setSelectedRole={setSelectedRole}
                />

                <PersonalInformation
                    userProfile={userProfile} />

                <DynamicQuestion
                    renderDynamicField={renderDynamicField}
                    formSchema={formSchema} />

                {/* [4] POLICY & SUBMIT */}
                <div className="pt-6 border-t border-[#eceeef] space-y-6">
                    <Form.Item
                        name="agreeToTerms"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) => value
                                    ? Promise.resolve()
                                    : Promise.reject(new Error('Please agree to the terms.'))
                            }
                        ]}
                        className="mx-0"
                    >
                        <Checkbox className="text-sm text-slate-600 leading-relaxed font-medium hover:text-slate-900 transition-colors">
                            I confirm that the information provided is accurate and I agree to the <a className="text-[#89A8B2] underline font-bold" href="#">staff code of conduct</a>.
                        </Checkbox>
                    </Form.Item>

                    <button
                        type="submit"
                        disabled={isFull || !selectedRole || isSubmitting}
                        className="w-full bg-[#89A8B2] hover:opacity-85 hover:scale-[0.98] active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:opacity-100 text-white py-4 rounded-[16px] font-bold text-lg shadow-lg shadow-[#89A8B2]/20 transition-all duration-300 flex items-center justify-center gap-2 uppercase group"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={22} className="animate-spin" />
                                <span>Loading...</span>
                            </>
                        ) : (
                            <>
                                <span>{isFull ? 'Position Full' : 'Submit Application'}</span>
                                {!isFull && <Send size={18} className="group-hover:translate-x-1 transition-transform" />}
                            </>
                        )}
                    </button>
                </div>

            </Form>
        </div>
    )
}

export default FormContainer
