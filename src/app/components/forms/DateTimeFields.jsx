"use client";
import InputField from "./InputField";

export default function DateTimeFields({ errors, setErrors }) {
   return (
      <div className="grid grid-cols-3 gap-4">
         <InputField
            label="Date"
            type="date"
            name="date"
            error={errors?.date}
            onFocus={() => setErrors(prev => ({ ...prev, date: null }))}
         />
         <InputField
            label="Time (From)"
            type="time"
            name="timeFrom"
            error={errors?.timeFrom}
            onFocus={() => setErrors(prev => ({ ...prev, timeFrom: null }))}
         />
         <InputField
            label="Time (To)"
            type="time"
            name="timeTo"
            error={errors?.timeTo}
            onFocus={() => setErrors(prev => ({ ...prev, timeTo: null }))}
         />
      </div>
   );
}
