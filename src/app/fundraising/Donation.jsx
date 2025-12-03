'use client';
import { useState } from 'react';
import Currency from '@/app/components/Currency';
import { Search, Upload } from 'lucide-react';

export default function DonationsTable ({ data }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All Types');

    const filteredData = data.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              item.amount.toString().includes(searchTerm);
        
        const matchesType = filterType === 'All Types' || item.type === filterType;

        return matchesSearch && matchesType;
    });

    const getStatusStyle = (type) => {
        if (type === 'Monthly') return "bg-green-100 text-green-700";
        if (type === 'One-time') return "bg-gray-200 text-gray-800";
        return "bg-gray-100 text-gray-600";
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-100 mt-8">
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Recent Donations</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Import CSV
                </button>
            </div>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
                {/* Search Input */}
                <div className="relative flex-1">
                    {/* Search icon - This is where the ReferenceError was */}
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, campaign, amount"
                        className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:ring-indigo-500 focus:border-indigo-500 transition-colors placeholder-gray-500 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Type Dropdown */}
                <select 
                    className="bg-gray-50 text-gray-900 border border-gray-300 rounded-lg py-2 px-4 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer appearance-none text-sm"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option>All Types</option>
                    <option>Monthly</option>
                    <option>One-time</option>
                </select>
            </div>

            {/* Actual Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="bg-gray-50">
                            {["Name", "Email", "Type", "Amount", "Date", "Campaign"].map((header) => (
                                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredData.map((donation) => (
                            <tr key={donation.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{donation.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{donation.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(donation.type)}`}>
                                        {donation.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900"><Currency amount={donation.amount} /></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{donation.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{donation.campaign}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {filteredData.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">No donations found matching your criteria.</div>
            )}
        </div>
    );
};