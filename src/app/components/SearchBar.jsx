'use client';
import { FaSearch} from 'react-icons/fa';

export default function SearchBar({ filters = [], searchTerm, setSearchTerm, statusFilter, setStatusFilter }) {

   return (
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
         <div className="relative flex-grow w-full md:max-w-3xl">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
               type="text"
               placeholder="Search by name..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            />
         </div>
         <div className="w-full sm:w-auto">
            <select 
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
               className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-white w-full"
            >
               {filters.map((filter) => (
                  <option key={filter} value={filter}>
                  {filter}
                  </option>
               ))}
            </select>
         </div>
      </div>
   );
}