"use client";

import { useState, useMemo } from "react";
import { Menu, MenuItem, MenuItems, MenuButton } from "@headlessui/react";
import { FaEllipsisV } from 'react-icons/fa';

interface Column {
  key: string;
  label: string;
}

interface DataTableProps {
   name?: string;
   columns: Column[];
   data: Record<string, any>[];
   actions?: {
      label: string;
      icon?: string;
      onClick: (row: Record<string, any>) => void;
      color?: string;
   }[];
   rowsPerPage?: number;
}

export default function DataTable({ name, columns, data, actions = [], rowsPerPage = 5 }: DataTableProps) {
   const [search, setSearch] = useState("");
   const [sortKey, setSortKey] = useState<string>(columns[0].key);
   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
   const [currentPage, setCurrentPage] = useState(1);

   // Filtered + Sorted data
   const filteredData = useMemo(() => {
      return data
         .filter((row) =>
         Object.values(row).some((val) =>
            String(val).toLowerCase().includes(search.toLowerCase())
         )
         )
         .sort((a, b) => {
         const aVal = a[sortKey];
         const bVal = b[sortKey];
         if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
         if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
         return 0;
         });
   }, [data, search, sortKey, sortOrder]);

   // Pagination logic
   const totalPages = Math.ceil(filteredData.length / rowsPerPage);
   const paginatedData = filteredData.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
   );

   // Toggle sort
   const handleSort = (key: string) => {
      if (sortKey === key) {
         setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
         setSortKey(key);
         setSortOrder("asc");
      }
   };

   return (
      <div className="bg-gray-50 rounded-md border border-gray-200 p-3">
         <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{name}</h1>
            <input
               type="text"
               placeholder="Search..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
         </div>

         <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
               <thead className="bg-gray-100">
                  <tr>
                     {columns.map((col) => (
                     <th
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                        className="p-3 text-left border-b cursor-pointer select-none"
                     >
                        <div className="flex items-center gap-1">
                        {col.label}
                        {sortKey === col.key && (
                           <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                        )}
                        </div>
                     </th>
                     ))}
                     {actions.length > 0 && (
                     <th className="p-3 text-left border-b cursor-pointer select-none"></th>
                     )}
                  </tr>
               </thead>
               <tbody>
                  {paginatedData.map((row, i) => (
                     <tr key={i} className="hover:bg-gray-50">
                        {columns.map((col) => (
                           <td key={col.key} className="p-3 border-b">
                           {row[col.key]}
                           </td>
                        ))}
                        {actions.length > 0 && (
                        <td className="p-3 border-b">
                           <Menu as="div" className="relative inline-block text-left">
                              <MenuButton className="p-2 rounded hover:bg-gray-100">
                                 <FaEllipsisV className="w-5 h-5 text-gray-600" />
                              </MenuButton>

                              <MenuItems className="absolute right-0 mt-2 w-30 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg z-10">
                              <div className="py-1">
                                 {actions.map((action, i) => (
                                    <MenuItem key={i}>
                                    {({ active }) => (
                                       <button
                                          onClick={() => action.onClick(row)}
                                          className={`${
                                          active ? "bg-gray-100" : ""
                                          } block w-full text-left px-4 py-2 text-sm text-gray-700 flex items-center gap-2 ${action.color=="red" ? "text-red-600": ''}`}
                                       >
                                          {action.icon && <span>{action.icon} </span>}
                                          <span>{action.label}</span>
                                       </button>
                                    )}
                                    </MenuItem>
                                 ))}
                              </div>
                              </MenuItems>
                           </Menu>
                        </td>
                        )}
                     </tr>
                  ))}

                  {paginatedData.length === 0 && (
                     <tr>
                        <td
                           colSpan={columns.length}
                           className="p-4 text-center text-gray-500 border-b"
                        >
                           No results found
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
         {/* Pagination Controls */}
         <div className="flex justify-center items-center mt-6 gap-2">
            <button
               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
               disabled={currentPage === 1}
               className="px-3 py-1 border rounded disabled:opacity-50"
            >
               ◀ Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
               <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                  currentPage === i + 1
                     ? "bg-blue-500 text-white"
                     : "hover:bg-gray-100"
                  }`}
               >
                  {i + 1}
               </button>
            ))}

            <button
               onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
               disabled={currentPage === totalPages}
               className="px-3 py-1 border rounded disabled:opacity-50"
            >
               Next ▶
            </button>
         </div>
      </div>
   );
}
