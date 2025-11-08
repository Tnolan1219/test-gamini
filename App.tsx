
import React, { useState, useEffect } from 'react';
import { PropertyInputForm } from './components/PropertyInputForm';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { AiAnalysis } from './components/AiAnalysis';
import type { PropertyData, AnalysisResults } from './types';
import { calculateMetrics } from './utils/calculator';

const initialData: PropertyData = {
    purchasePrice: 300000,
    downPayment: 20,
    interestRate: 6.5,
    loanTerm: 30,
    propertyTaxes: 4000,
    homeInsurance: 1200,
    hoa: 50,
    grossMonthlyRent: 2500,
    vacancyRate: 5,
    repairs: 5,
    capex: 5,
    management: 0,
    closingCosts: 3
};

const App: React.FC = () => {
    const [propertyData, setPropertyData] = useState<PropertyData>(initialData);
    const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);

    const handleAnalyze = () => {
        const results = calculateMetrics(propertyData);
        setAnalysisResults(results);
    };
    
    useEffect(() => {
        handleAnalyze();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <header className="bg-gray-800 shadow-md p-4">
                <div className="container mx-auto flex items-center space-x-3">
                     <svg className="w-8 h-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <h1 className="text-2xl font-bold">Real Estate Investment Analyzer</h1>
                </div>
            </header>

            <main className="container mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto pr-2">
                        <PropertyInputForm data={propertyData} setData={setPropertyData} onAnalyze={handleAnalyze} />
                    </div>
                    
                    <div className="lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto pr-2">
                        {analysisResults ? (
                            <>
                                <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>
                                <AnalysisDashboard results={analysisResults} />
                                <AiAnalysis propertyData={propertyData} analysisResults={analysisResults} />
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full bg-gray-800 rounded-lg p-8">
                                <p className="text-gray-400">Enter property details and click "Analyze Property" to see the results.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
