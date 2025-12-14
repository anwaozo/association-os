import React, { useState, useRef, useEffect } from 'react';

function Chip({ label, onRemove }) {
   return (
      <span className="flex items-center gap-2 bg-gray-100 text-sm px-2 py-1 rounded-md">
         <span className="truncate max-w-[120px]">{label}</span>
         <button
         onClick={(e) => { e.stopPropagation(); onRemove(); }}
         aria-label={`Remove ${label}`}
         className="text-xs leading-none focus:outline-none"
         >
         ✕
         </button>
      </span>
   );
}

function SearchInput({ value, onChange, onKeyDown, placeholder, inputRef }) {
   return (
      <input
         ref={inputRef}
         value={value}
         onChange={(e) => onChange(e.target.value)}
         onKeyDown={onKeyDown}
         className="flex-1 w-full outline-none text-sm p-1 "
         placeholder={placeholder}
         aria-label="Search options"
      />
   );
}

function DropdownList({ children, style }) {
   return (
      <div
         className="absolute z-50 mt-1 w-full bg-white border rounded shadow max-h-[250px] overflow-auto"
         style={style}
      >
         {children}
      </div>
   );
}

function DropdownItem({ option, checked, onToggle, onRemove }) {
   return (
      <li
         className="p-2 flex items-center justify-between cursor-pointer hover:bg-gray-50"
         onClick={(e) => { e.stopPropagation(); onToggle(option.value); }}
      >
         <div className="flex items-center gap-2">
         <input type="checkbox" readOnly checked={checked} tabIndex={-1} />
         <span className="truncate">{option.label}</span>
         </div>
         {checked && (
         <button
            onClick={(e) => { e.stopPropagation(); onRemove(option.value); }}
            className="text-sm"
         >
            Remove
         </button>
         )}
      </li>
   );
}

export default function MultiSelect({
   label = '',
   options = [],
   value = [],
   onChange = () => {},
   placeholder = 'Select...',
   searchable = true,
   maxHeight = 200,
   error
}) {
   const [open, setOpen] = useState(false);
   const [filter, setFilter] = useState('');
   const [internalSelected, setInternalSelected] = useState(value);
   const containerRef = useRef(null);
   const inputRef = useRef(null);

   useEffect(() => setInternalSelected(value), [value]);

   useEffect(() => {
      function onDocClick(e) {
         if (containerRef.current && !containerRef.current.contains(e.target)) {
         setOpen(false);
         }
      }
      document.addEventListener('click', onDocClick);
      return () => document.removeEventListener('click', onDocClick);
   }, []);

   function toggleOption(val) {
      let next;
      if (internalSelected.includes(val)) next = internalSelected.filter((v) => v !== val);
      else next = [...internalSelected, val];
      setInternalSelected(next);
      onChange(next);
   }

   function removeValue(val) {
      const next = internalSelected.filter((v) => v !== val);
      setInternalSelected(next);
      onChange(next);
   }

   function clearAll(e) {
      e.stopPropagation();
      setInternalSelected([]);
      onChange([]);
   }

   const filtered = options.filter((o) => o.label.toLowerCase().includes(filter.toLowerCase()));

   function handleKeyDown(e) {
      if (e.key === 'Backspace' && !filter && internalSelected.length) {
         removeValue(internalSelected[internalSelected.length - 1]);
      }
      if (e.key === 'Escape') setOpen(false);
   }

   return (
      <div className="relative w-full" ref={containerRef}>
         <label className="block">
            <span className="text-gray-700 font-medium mb-1 block">{label}</span>
         </label>
         <div
            className="border rounded p-2 flex flex-wrap items-center gap-2 cursor-text bg-white"
            onClick={() => { setOpen(true); inputRef.current?.focus(); }}
         >
         {internalSelected.length ? (
            internalSelected.map((val) => {
               const opt = options.find((o) => o.value === val);
               return (
               <Chip key={val} label={opt?.label || val} onRemove={() => removeValue(val)} />
               );
            })
         ) : (
            <span className="text-gray-400 text-sm"></span>
         )}

         <SearchInput
            value={filter}
            onChange={setFilter}
            onKeyDown={handleKeyDown}
            placeholder={internalSelected.length ? '' : placeholder}
            inputRef={inputRef}
         />

         {internalSelected.length > 0 && (
            <button title="Clear all" onClick={clearAll} className="text-sm">
               Clear
            </button>
         )}
         </div>

         {open && (
         <DropdownList style={{ maxHeight }}>
            {searchable && (
               <div className="p-2">
               <input
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                  placeholder="Search..."
                  autoFocus
               />
               </div>
            )}

            <ul style={{ maxHeight, overflow: 'auto' }}>
               {filtered.length === 0 ? (
               <li className="p-3 text-sm text-gray-500">No options</li>
               ) : (
               filtered.map((opt) => (
                  <DropdownItem
                     key={opt.value}
                     option={opt}
                     checked={internalSelected.includes(opt.value)}
                     onToggle={toggleOption}
                     onRemove={removeValue}
                  />
               ))
               )}
            </ul>
         </DropdownList>
         )}
         {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
   );
}
