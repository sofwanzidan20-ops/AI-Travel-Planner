import React, { useMemo, useState } from 'react';
import { ItineraryDay } from '../types';

interface BudgetSummaryProps {
  itinerary: ItineraryDay[];
}

const parseCost = (costString: string): number => {
    if (!costString || costString.toLowerCase().includes('gratis')) {
        return 0;
    }
    // Handle ranges by taking the first number, then remove non-digit characters
    const firstValue = costString.split('-')[0];
    const numericString = firstValue.replace(/[^\d]/g, '');
    return numericString ? parseInt(numericString, 10) : 0;
};

const BudgetSummary: React.FC<BudgetSummaryProps> = ({ itinerary }) => {
  const [showDetails, setShowDetails] = useState(false);

  const totalEstimatedCost = useMemo(() => {
    let total = 0;
    itinerary.forEach(day => {
      day.activities.forEach(activity => {
        total += parseCost(activity.cost);
      });
    });
    return total;
  }, [itinerary]);

  const formattedCost = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalEstimatedCost);

  const costlyActivitiesByDay = useMemo(() => {
    return itinerary
      .map(day => ({
        ...day,
        activities: day.activities.filter(activity => parseCost(activity.cost) > 0),
      }))
      .filter(day => day.activities.length > 0);
  }, [itinerary]);


  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-12 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Ringkasan Anggaran</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
          <span className="font-medium text-gray-600 text-lg">Total Estimasi Biaya</span>
          <span className="font-bold text-xl text-gray-800">{formattedCost}</span>
        </div>
      </div>

      {costlyActivitiesByDay.length > 0 && (
        <>
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors text-sm py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-expanded={showDetails}
            >
              {showDetails ? 'Sembunyikan Rincian' : 'Lihat Rincian Biaya'}
            </button>
          </div>

          {showDetails && (
            <div className="mt-4 border-t border-gray-200 pt-4 animate-fade-in">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Rincian Biaya</h3>
              <div className="space-y-4">
                {costlyActivitiesByDay.map(day => (
                  <div key={day.day}>
                    <h4 className="font-bold text-gray-600">Hari {day.day}</h4>
                    <ul className="mt-1 space-y-1 text-sm">
                      {day.activities.map((activity, index) => (
                        <li key={index} className="flex justify-between items-center text-gray-600 pl-2">
                          <span>{activity.name}</span>
                          <span className="font-mono text-gray-700">{activity.cost}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BudgetSummary;
