"use client";
import { useState } from "react";

export default function TagInput({ name, placeholder = "Type and press Enter...", initial = [] }) {
   const [tags, setTags] = useState(() => (Array.isArray(initial) ? initial.map(String) : []));
   const [inputValue, setInputValue] = useState("");

   const addTag = (value) => {
      const newTag = value.trim();
      if (newTag && !tags.includes(newTag)) {
         setTags([...tags, newTag]);
      }
      setInputValue("");
   };

   const removeTag = (index) => {
      setTags(tags.filter((_, i) => i !== index));
   };

   const handleKeyDown = (e) => {
      if (e.key === "Enter" || e.key === ",") {
         e.preventDefault();
         addTag(inputValue);
      } else if (e.key === "Backspace" && !inputValue && tags.length) {
         removeTag(tags.length - 1);
      }
   };

   return (
      <div className="border border-gray-200 rounded-lg w-full p-3 flex flex-wrap gap-2 focus:border-orange-500 focus:ring-blue-400">
         <input type="hidden" name={name} value={JSON.stringify(tags)} />
         {tags.map((tag, index) => (
         <span
            key={index}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2"
         >
            {tag}
            <button
               type="button"
               className="text-blue-500 hover:text-blue-700 text-sm"
               onClick={() => removeTag(index)}
            >
               ×
            </button>
         </span>
         ))}
         <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-grow outline-none min-w-[120px]"
         />
      </div>
   );
}
