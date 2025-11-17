
import React from 'react';

const InputForm = ({
  destination,
  setDestination,
  duration,
  setDuration,
  interests,
  setInterests,
  onSubmit,
  isLoading,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
          Tujuan Wisata
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="destination"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="block w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Contoh: Bali, Indonesia"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
          Durasi (Hari)
        </label>
        <div className="mt-1">
          <input
            type="number"
            name="duration"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="block w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Contoh: 5"
            min="1"
            max="14"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="interests" className="block text-sm font-medium text-gray-700">
          Minat Khusus
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="interests"
            id="interests"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            className="block w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Contoh: Kuliner dan Sejarah"
            required
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:text-blue-700 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : null}
          {isLoading ? 'Membuat Rencana...' : 'Buat Rencana Perjalanan'}
        </button>
      </div>
    </form>
  );
};

export default InputForm;
