"use client";
export default function NumberField({ label, name, placeholder }) {
  return (
    <label className="block">
      <span className="text-gray-700 font-medium mb-1 block">{label}</span>
      <input
        type="number"
        name={name}
        placeholder={placeholder}
        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition shadow-inner"
      />
    </label>
  );
}
