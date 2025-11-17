
import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ItineraryCard from './components/ItineraryCard';
import { generateItinerary } from './services/geminiService';
import { ItineraryDay } from './types';
import BudgetSummary from './components/BudgetSummary';

const App: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [interests, setInterests] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryDay[] | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setItinerary(null);

    try {
      const durationNum = parseInt(duration, 10);
      if (isNaN(durationNum) || durationNum <= 0) {
        throw new Error('Please enter a valid number of days.');
      }
      const itineraryData = await generateItinerary(destination, durationNum, interests);
      setItinerary(itineraryData);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    const itineraryElement = document.getElementById('itinerary-content');
    if (!itineraryElement) {
        setError('Could not find itinerary content to export.');
        return;
    }

    setIsExporting(true);
    setError(null);

    try {
        const { jsPDF } = (window as any).jspdf;
        const canvas = await (window as any).html2canvas(itineraryElement, {
            scale: 2, // Higher resolution for better quality
            logging: false,
            useCORS: true,
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;

        const imgHeight = pdfWidth / ratio;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save('rencana-perjalanan.pdf');
    } catch (err: any) {
        console.error("Error exporting PDF:", err);
        setError(err.message || 'Failed to export to PDF. Please try again.');
    } finally {
        setIsExporting(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-100 font-sans text-gray-900">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
            <header className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
                AI Travel Planner
                </h1>
                <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                Masukkan detail perjalanan Anda dan biarkan AI membuat rencana perjalanan pribadi yang sempurna untuk Anda.
                </p>
            </header>
            
            <div className="bg-white p-8 rounded-2xl shadow-md mb-12">
                <InputForm
                    destination={destination}
                    setDestination={setDestination}
                    duration={duration}
                    setDuration={setDuration}
                    interests={interests}
                    setInterests={setInterests}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />
            </div>

            <div className="results-section space-y-8">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {itinerary && itinerary.length > 0 && (
                  <div className="animate-fade-in">
                    <div className="flex justify-center items-center mb-8">
                      <h2 className="text-3xl font-bold text-center text-gray-800">Rencana Perjalanan Kustom Anda</h2>
                      <button
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        className="ml-4 flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 disabled:text-green-700 disabled:cursor-not-allowed transition-colors"
                      >
                        {isExporting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Mengekspor...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Ekspor ke PDF
                          </>
                        )}
                      </button>
                    </div>
                    <div id="itinerary-content">
                      {itinerary.map((dayPlan) => (
                        <ItineraryCard 
                          key={dayPlan.day} 
                          dayPlan={dayPlan} 
                        />
                      ))}
                      <BudgetSummary itinerary={itinerary} />
                    </div>
                  </div>
                )}

                {!isLoading && !error && !itinerary && (
                     <div className="text-center py-10 px-6 bg-white rounded-2xl shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        <h3 className="mt-2 text-xl font-semibold text-gray-900">Siap untuk Petualangan?</h3>
                        <p className="mt-1 text-md text-gray-500">Rencana perjalanan pribadi Anda akan muncul di sini.</p>
                    </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
