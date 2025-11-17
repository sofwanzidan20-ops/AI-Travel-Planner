import React from 'react';
import { ItineraryDay } from '../types';

interface ItineraryCardProps {
  dayPlan: ItineraryDay;
}

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MoneyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9.5a4.5 4.5 0 10-9 0 4.5 4.5 0 009 0zm0 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z" />
    </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 text-gray-400 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);


const ItineraryCard: React.FC<ItineraryCardProps> = ({ dayPlan }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 transition-transform transform hover:scale-105 duration-300">
      <div className="bg-blue-500 p-4">
        <h2 className="text-xl font-bold text-white">
          Hari {dayPlan.day}: <span className="font-normal">{dayPlan.title}</span>
        </h2>
      </div>
      <div className="p-6">
        <ul className="space-y-6">
          {dayPlan.activities.map((activity, index) => (
            <li key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                {activity.name}
                <SearchIcon />
              </h3>
              <p className="text-gray-600 mt-1 text-sm">{activity.description}</p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center text-gray-700">
                  <ClockIcon />
                  <span>{activity.hours}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MoneyIcon />
                  <span>Perkiraan Biaya: {activity.cost}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-end">
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(activity.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm font-medium text-blue-800 bg-blue-100 hover:bg-blue-200 rounded-full px-4 py-1.5 transition-colors"
                >
                  Cek Harga
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ItineraryCard;