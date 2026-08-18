import React from 'react';
import {
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  FolderOpen as FolderIcon,
  SupportAgent as SupportIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

const StatCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Clients',
      value: stats.clients.total,
      change: '+12.5%',
      trend: 'up',
      icon: PeopleIcon,
      color: 'primary',
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.financial.monthlyIncome.toLocaleString()}`,
      change: '+8.2%',
      trend: 'up',
      icon: MoneyIcon,
      color: 'success',
    },
    {
      title: 'Active Projects',
      value: stats.projects.active,
      change: '+3.1%',
      trend: 'up',
      icon: FolderIcon,
      color: 'warning',
    },
    {
      title: 'Open Tickets',
      value: stats.operations.openTickets,
      change: '-2.4%',
      trend: 'down',
      icon: SupportIcon,
      color: 'danger',
    },
  ];

  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-yellow-50 text-yellow-600',
    danger: 'bg-red-50 text-red-600',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-card p-6 card-hover w-full"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${colorClasses[card.color]}`}>
              <card.icon className="w-6 h-6" />
            </div>
            <span className={`text-sm font-medium ${
              card.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {card.change}
              {card.trend === 'up' ? (
                <TrendingUpIcon className="w-4 h-4 inline ml-0.5" />
              ) : (
                <TrendingDownIcon className="w-4 h-4 inline ml-0.5" />
              )}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
          <p className="text-sm text-gray-500 mt-1">{card.title}</p>
        </div>
      ))}
    </div>
  );
};

export default StatCards;