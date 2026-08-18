import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BusinessTypeStats = () => {
  const data = {
    labels: ['Restaurants', 'Medical', 'E-commerce', 'Retail', 'Education', 'Others'],
    datasets: [
      {
        label: 'Active Clients',
        data: [48, 35, 28, 22, 15, 12],
        backgroundColor: 'rgba(79, 70, 229, 0.8)',
        borderRadius: 6,
      },
      {
        label: 'Pending Clients',
        data: [12, 8, 6, 4, 3, 2],
        backgroundColor: 'rgba(251, 191, 36, 0.8)',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      title: {
        display: true,
        text: 'Business Type Distribution',
        font: {
          size: 16,
          weight: '600',
        },
        color: '#1e293b',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BusinessTypeStats;