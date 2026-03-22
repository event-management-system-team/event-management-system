

const DynamicQuestion = ({ formSchema, renderDynamicField }) => {
    return (
        <section>
            <h2 className="text-xl font-bold mb-6 border-l-4 border-[#89A8B2] pl-4">Additional Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formSchema.map((field) => (
                    <div key={field.fieldId} className={`flex flex-col gap-2 ${['paragraph', 'file_upload'].includes(field.type) ? 'md:col-span-2' : ''}`}>
                        <label className="text-sm font-bold text-slate-700">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {renderDynamicField(field)}
                    </div>
                ))}
            </div>
        </section>
    )
}

export default DynamicQuestion
