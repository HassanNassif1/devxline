import React, { useState } from 'react';
import {
  Download as DownloadIcon,
  Print as PrintIcon,
  FilePresent as FilePresentIcon,
} from '@mui/icons-material';
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as ShowChartIcon,
} from '@mui/icons-material';

const ReportsPage = () => {
  const [reportType, setReportType] = useState('financial');
  const [dateRange, setDateRange] = useState('thisMonth');

  const reportTypes = [
    { id: 'financial', label: 'Financial Reports', icon: BarChartIcon },
    { id: 'clients', label: 'Client Analytics', icon: PieChartIcon },
    { id: 'projects', label: 'Project Reports', icon: ShowChartIcon },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500">Generate and export business reports</p>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <DownloadIcon className="w-5 h-5" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <PrintIcon className="w-5 h-5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {reportTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="thisQuarter">This Quarter</option>
              <option value="thisYear">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="px-6 py-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity">
              Generate Report
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportTypes.map((type) => (
          <div
            key={type.id}
            className={`bg-white rounded-xl shadow-card p-6 card-hover cursor-pointer ${
              reportType === type.id ? 'ring-2 ring-primary-500' : ''
            }`}
            onClick={() => setReportType(type.id)}
          >
            <div className={`p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-4 ${
              reportType === type.id ? 'bg-primary-50 text-primary-600' : 'bg-gray-50 text-gray-400'
            }`}>
              <type.icon className="w-6 h-6" />
            </div>
            <h3 className="font-medium text-gray-900">{type.label}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {reportType === type.id ? 'Selected' : 'Click to select'}
            </p>
            {reportType === type.id && (
              <div className="mt-3 flex items-center space-x-2 text-sm text-primary-600">
                <FilePresentIcon className="w-4 h-4" />
                <span>Ready to generate</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-card p-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChartIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Report Preview
          </h3>
          <p className="text-gray-500">
            Select a report type and date range, then click "Generate Report"
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;