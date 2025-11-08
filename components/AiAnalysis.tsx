
import React, { useState } from 'react';
import type { PropertyData, AnalysisResults } from '../types';
import { getAiAnalysis } from '../services/geminiService';
import { marked } from 'marked';

interface AiAnalysisProps {
    propertyData: PropertyData;
    analysisResults: AnalysisResults;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-3 h-3 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-3 h-3 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        <p className="text-gray-300 ml-2">Gemini is analyzing the deal...</p>
    </div>
);

export const AiAnalysis: React.FC<AiAnalysisProps> = ({ propertyData, analysisResults }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGetAnalysis = async () => {
        setIsLoading(true);
        setError(null);
        setAiResponse(null);
        try {
            const response = await getAiAnalysis(propertyData, analysisResults);
            setAiResponse(response);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const parsedHtml = aiResponse ? marked.parse(aiResponse) : '';

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-4">
            <h3 className="text-lg font-semibold text-indigo-400 mb-4">Gemini AI Investment Analysis</h3>
            {!aiResponse && !isLoading && (
                 <div className="text-center">
                    <p className="text-gray-400 mb-4">Get an expert AI-powered analysis of this property's investment potential.</p>
                    <button
                        onClick={handleGetAnalysis}
                        disabled={isLoading}
                        className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                       Get AI Analysis
                    </button>
                 </div>
            )}
            {isLoading && <LoadingSpinner />}
            {error && <p className="text-red-400 text-center">{error}</p>}
            {aiResponse && (
                <div 
                    className="prose prose-sm prose-invert prose-headings:text-indigo-400 prose-strong:text-white prose-a:text-blue-400 max-w-none"
                    dangerouslySetInnerHTML={{ __html: parsedHtml }}
                />
            )}
        </div>
    );
};
