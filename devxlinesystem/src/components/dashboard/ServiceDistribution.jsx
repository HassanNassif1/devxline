import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ServiceDistribution = () => {
  const data = {
    labels: ['Enterprise', 'Professional', 'Starter', 'Custom'],
    datasets: [
      {
        data: [45, 30, 15, 10],
        backgroundColor: [
          '#4f46e5',
          '#22c55e',
          '#f59e0b',
          '#8b5cf6',
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Service Distribution',
        font: {
          size: 16,
          weight: '600',
        },
        color: '#1e293b',
      },
    },
    cutout: '70%',
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-6 h-full">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default ServiceDistribution;