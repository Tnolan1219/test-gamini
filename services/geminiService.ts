
import { GoogleGenAI } from "@google/genai";
import type { PropertyData, AnalysisResults } from '../types';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

const formatPercentage = (value: number) => {
  return `${value.toFixed(2)}%`;
};

export const getAiAnalysis = async (
  propertyData: PropertyData,
  analysisResults: AnalysisResults
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set. Please configure it to use AI features.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Act as an expert real estate investment advisor. I will provide you with data about a potential investment property and the calculated financial metrics.
    Your task is to provide a comprehensive analysis of this deal.

    **Property & Loan Data:**
    - Purchase Price: ${formatCurrency(propertyData.purchasePrice)}
    - Down Payment: ${formatPercentage(propertyData.downPayment)}
    - Interest Rate: ${formatPercentage(propertyData.interestRate)}
    - Loan Term: ${propertyData.loanTerm} years
    - Gross Monthly Rent: ${formatCurrency(propertyData.grossMonthlyRent)}
    - Closing Costs: ${formatPercentage(propertyData.closingCosts)}

    **Calculated Monthly Metrics:**
    - Monthly Cash Flow: ${formatCurrency(analysisResults.monthlyCashFlow)}
    - Total Monthly Expenses: ${formatCurrency(analysisResults.totalOperatingExpenses + analysisResults.monthlyDebtService)}
    - Net Operating Income (NOI): ${formatCurrency(analysisResults.netOperatingIncome)}

    **Calculated Annual Metrics:**
    - Annual Cash Flow: ${formatCurrency(analysisResults.annualCashFlow)}

    **Key Investment Returns & Rules of Thumb:**
    - Total Cash Needed to Close: ${formatCurrency(analysisResults.totalCashNeeded)}
    - Capitalization Rate (Cap Rate): ${formatPercentage(analysisResults.capRate)}
    - Cash-on-Cash (CoC) Return: ${formatPercentage(analysisResults.cashOnCashReturn)}
    - 1% Rule: ${analysisResults.onePercentRule ? 'Passes' : 'Fails'}
    - 50% Rule: ${analysisResults.fiftyPercentRule ? 'Passes' : 'Fails'}

    **Your Analysis:**
    Based on the data provided, please provide the following in a clear, well-structured markdown format:
    1.  **Executive Summary:** A brief, high-level overview of the investment's potential. Is it strong, average, or weak?
    2.  **Strengths:** What are the positive aspects of this deal? (e.g., strong cash flow, high CoC return, passes key rules).
    3.  **Weaknesses/Risks:** What are the potential downsides or risks? (e.g., negative cash flow, low Cap Rate, high vacancy assumption, dependence on appreciation).
    4.  **Actionable Recommendations:** What could be done to improve this deal? (e.g., "Negotiate a lower purchase price," "Verify if the projected rent is achievable by checking local comps," "Consider a different loan product to lower the monthly payment").
    5.  **Final Verdict:** A concluding thought on whether to proceed with, cautiously explore, or pass on this investment opportunity.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "An error occurred while getting the AI analysis. Please check the console for details.";
  }
};
