import { Calendar, Clock } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FieldError, inputCls } from "./RecruitmentShared";

const Step2Requirements = ({ form, onChange, errors = {}, eventStartDate }) => {
  // Deadline tối đa: trước ngày sự kiện bắt đầu 1 ngày
  const maxDeadline = eventStartDate
    ? (() => {
        const d = new Date(eventStartDate);
        d.setDate(d.getDate() - 1);
        return d;
      })()
    : null;

  return (
    <div className="space-y-6">
      {/* ── Deadline ── */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
        <h2 className="flex items-center justify-between gap-2 text-base font-bold text-gray-800 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#4a9e9e]/15 flex items-center justify-center">
              <Calendar size={13} className="text-[#4a9e9e]" />
            </div>
            Application Deadline
          </div>
          <span className="text-xs font-medium text-red-400">Required</span>
        </h2>
        <DatePicker
          selected={form.deadline}
          onChange={(date) => onChange({ deadline: date })}
          dateFormat="dd/MM/yyyy"
          placeholderText="Select application deadline..."
          minDate={new Date()}
          maxDate={maxDeadline}
          className={inputCls(errors.deadline)}
          wrapperClassName="w-full"
        />
        <p className="mt-1.5 text-xs text-gray-400 flex items-start gap-1.5">
          <Clock size={11} className="mt-0.5 shrink-0" />
          {maxDeadline
            ? `Must be before event start (${maxDeadline.toLocaleDateString("en-GB")}).`
            : "Choose when applications will stop being accepted."}
        </p>
        <FieldError msg={errors.deadline} />
      </section>
    </div>
  );
};

export default Step2Requirements;
