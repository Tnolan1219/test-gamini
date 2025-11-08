
import React from 'react';
import type { AnalysisResults } from '../types';

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
const formatPercentage = (value: number) => `${value.toFixed(2)}%`;

const MetricCard: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h3 className="text-md font-semibold text-indigo-400 mb-3 border-b border-gray-700 pb-2">{title}</h3>
        <div className="space-y-2">{children}</div>
    </div>
);

const MetricItem: React.FC<{ label: string; value: string; isPositive?: boolean; isNegative?: boolean; tooltip: string }> = ({ label, value, isPositive, isNegative, tooltip }) => {
    const valueColor = isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-gray-100';
    return (
        <div className="flex justify-between items-center text-sm group relative">
            <span className="text-gray-400">{label}</span>
            <span className={`font-semibold ${valueColor}`}>{value}</span>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-700 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {tooltip}
            </span>
        </div>
    );
};

const RuleCheck: React.FC<{label: string; passes: boolean; tooltip: string}> = ({label, passes, tooltip}) => (
    <div className="flex justify-between items-center text-sm group relative">
        <span className="text-gray-400">{label}</span>
        <span className={`font-bold px-2 py-1 text-xs rounded-full ${passes ? 'bg-green-500 text-green-900' : 'bg-red-500 text-red-900'}`}>{passes ? 'PASS' : 'FAIL'}</span>
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-700 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {tooltip}
        </span>
    </div>
);

export const AnalysisDashboard: React.FC<{ results: AnalysisResults }> = ({ results }) => {
    const isCashFlowPositive = results.monthlyCashFlow >= 0;

    return (
        <div className="space-y-4">
            <MetricCard title="Cash Flow Analysis">
                <MetricItem label="Monthly Cash Flow" value={formatCurrency(results.monthlyCashFlow)} isPositive={isCashFlowPositive} isNegative={!isCashFlowPositive} tooltip="Net income after all expenses, including mortgage." />
                <MetricItem label="Annual Cash Flow" value={formatCurrency(results.annualCashFlow)} isPositive={isCashFlowPositive} isNegative={!isCashFlowPositive} tooltip="Total net income for the year." />
            </MetricCard>

            <MetricCard title="Key Returns & Metrics">
                <MetricItem label="Cash on Cash Return" value={formatPercentage(results.cashOnCashReturn)} isPositive={results.cashOnCashReturn >= 8} tooltip="Annual return on the cash you invested. Higher is better (8-12% is often considered good)." />
                <MetricItem label="Capitalization Rate" value={formatPercentage(results.capRate)} isPositive={results.capRate >= 5} tooltip="Rate of return based on the property's income. Higher is better (5-10% is typical)." />
                <MetricItem label="Total Cash Needed" value={formatCurrency(results.totalCashNeeded)} tooltip="Down payment plus closing costs." />
            </MetricCard>

             <MetricCard title="Rules of Thumb">
                <RuleCheck label="1% Rule" passes={results.onePercentRule} tooltip="Does the monthly rent equal at least 1% of the purchase price?" />
                <RuleCheck label="50% Rule" passes={results.fiftyPercentRule} tooltip="Are operating expenses (excluding mortgage) roughly 50% of the income?"/>
            </MetricCard>

            <MetricCard title="Monthly Breakdown">
                <MetricItem label="Gross Rent" value={formatCurrency(results.grossPotentialRent)} tooltip="Total potential rent."/>
                <MetricItem label="Net Operating Income" value={formatCurrency(results.netOperatingIncome)} tooltip="Income after operating expenses, before mortgage."/>
                <hr className="border-gray-700 my-1"/>
                <MetricItem label="Principal & Interest" value={formatCurrency(results.principalAndInterest)} tooltip="Monthly mortgage payment."/>
                <MetricItem label="Taxes & Insurance" value={formatCurrency(results.monthlyTaxes + results.monthlyInsurance)} tooltip="PITI minus P&I."/>
                <MetricItem label="Vacancy" value={formatCurrency(results.monthlyVacancy)} tooltip="Expected loss due to vacancy."/>
                <MetricItem label="Other Expenses" value={formatCurrency(results.monthlyHOA + results.monthlyRepairs + results.monthlyCapex + results.monthlyManagement)} tooltip="HOA, repairs, capex, and management fees."/>
                 <hr className="border-gray-700 my-1"/>
                <MetricItem label="Total Expenses" value={formatCurrency(results.totalOperatingExpenses + results.monthlyDebtService)} tooltip="All operating expenses plus debt service."/>
            </MetricCard>
        </div>
    );
};
