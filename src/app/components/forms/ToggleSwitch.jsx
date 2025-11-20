
import InputField from '@/app/components/forms/InputField';
export default function ToggleSwitch ({ enabled, setEnabled, label, description, input, error, onFocus, data }) {
   return ( 
      <div className="flex mb-4 items-center justify-between p-4 bg-gray-100 rounded-xl border border-gray-300">
         <div>
            {/* Changed text-white to text-gray-900 */}
            <p className="text-gray-900 font-medium">{label}</p>
            {/* Changed text-gray-400 to text-gray-600 */}
            <p className="text-sm text-gray-600">{description}</p>

            {input == 'text' && enabled && (
               <InputField
                  label=""
                  name="notify_email"
                  type="email"
                  placeholder="e.g., jhon@mail.com"
                  error={error}
                  onFocus={onFocus}
               />
            )}

            {input == 'select' && enabled && (
               data
            )}
         </div>
         
         <div 
            onClick={() => setEnabled(!enabled)}
            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 ${enabled ? 'bg-[#FF884D]' : 'bg-gray-400'}`}
         >
            <span
               aria-hidden="true"
               className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`}
            ></span>
         </div>
      </div>
   )
}