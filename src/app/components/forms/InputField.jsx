"use client";
export default function InputField({ label, name, type, placeholder, error, onFocus, info, ...props }) {
   return (
      <label className="block">
         <span className="text-gray-700 font-medium mb-1 block">{label}</span>
         {type === "textarea" ? (
            <textarea
               name={name}
               placeholder={placeholder}
               onFocus={onFocus}
               rows="4"
               {...props}
               className={`w-full p-3 border rounded-lg bg-gray-50 focus:ring-orange-500 focus:border-orange-500 ${error ? 'border-red-500' : 'border-gray-200'}`}
            />
         ) : type === 'select' ? (
            <select
               name={name}
               onFocus={onFocus}
               {...props}
               className={`w-full p-3 border rounded-lg bg-gray-50 focus:ring-orange-500 focus:border-orange-500 ${error ? 'border-red-500' : 'border-gray-200'}`}
            >
               <option value="" selected>Select {label}</option>
               {props.values && props.values.map((val, idx) => (
                  <option key={val.id} value={val.id}>{val.value}</option>
               ))}
            </select>   
         ) : (
            <input
               type={type}
               name={name}
               placeholder={placeholder}
               onFocus={onFocus}
               {...props}
               className={`w-full p-3 border rounded-lg bg-gray-50 focus:ring-orange-500 focus:border-orange-500 ${error ? 'border-red-500' : 'border-gray-200'}`}
            />
         )}
         {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
         <small className="text-gray-500">{info}</small>
      </label>
   );
}
