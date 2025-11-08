
import React from 'react';
import type { PropertyData } from '../types';

interface InputGroupProps {
  label: string;
  id: keyof PropertyData;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'number';
  step?: string;
  symbol: '%' | '$' | 'Yrs';
  symbolPosition?: 'left' | 'right';
  tooltip: string;
}

const InfoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const InputGroup: React.FC<InputGroupProps> = ({ label, id, value, onChange, type = 'number', step = '0.01', symbol, symbolPosition = 'right', tooltip }) => (
  <div className="relative">
    <label htmlFor={id} className="flex items-center text-sm font-medium text-gray-300 mb-1">
      {label}
      <div className="group relative ml-2">
        <InfoIcon />
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-700 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          {tooltip}
        </span>
      </div>
    </label>
    <div className="relative mt-1 rounded-md shadow-sm">
      {symbolPosition === 'left' && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-400 sm:text-sm">{symbol}</span>
        </div>
      )}
      <input
        type={type}
        name={id}
        id={id}
        value={value}
        onChange={onChange}
        step={step}
        className="block w-full rounded-md border-gray-600 bg-gray-900 pl-7 pr-12 py-2 text-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="0.00"
      />
      {symbolPosition === 'right' && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-400 sm:text-sm">{symbol}</span>
        </div>
      )}
    </div>
  </div>
);

interface PropertyInputFormProps {
    data: PropertyData;
    setData: React.Dispatch<React.SetStateAction<PropertyData>>;
    onAnalyze: () => void;
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-lg font-semibold text-indigo-400 border-b border-gray-700 pb-2 mb-4">{children}</h3>
);

export const PropertyInputForm: React.FC<PropertyInputFormProps> = ({ data, setData, onAnalyze }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value === '' ? 0 : parseFloat(value)
        }));
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl h-full overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Property Details</h2>
            <div className="space-y-6">
                <SectionTitle>Purchase & Loan</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup label="Purchase Price" id="purchasePrice" value={data.purchasePrice} onChange={handleChange} symbol="$" symbolPosition="left" tooltip="Total cost to purchase the property." />
                    <InputGroup label="Closing Costs" id="closingCosts" value={data.closingCosts} onChange={handleChange} symbol="%" tooltip="Fees paid to close the deal, typically 2-5% of purchase price." />
                    <InputGroup label="Down Payment" id="downPayment" value={data.downPayment} onChange={handleChange} symbol="%" tooltip="Percentage of the purchase price paid upfront." />
                    <InputGroup label="Interest Rate" id="interestRate" value={data.interestRate} onChange={handleChange} symbol="%" tooltip="The annual interest rate for the loan."/>
                    <InputGroup label="Loan Term" id="loanTerm" value={data.loanTerm} onChange={handleChange} symbol="Yrs" step="1" tooltip="The length of the loan in years."/>
                </div>
                
                <SectionTitle>Income</SectionTitle>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup label="Gross Monthly Rent" id="grossMonthlyRent" value={data.grossMonthlyRent} onChange={handleChange} symbol="$" symbolPosition="left" tooltip="Total potential rent collected per month." />
                    <InputGroup label="Vacancy Rate" id="vacancyRate" value={data.vacancyRate} onChange={handleChange} symbol="%" tooltip="Percentage of time the property is expected to be vacant. Typically 5-10%."/>
                </div>

                <SectionTitle>Recurring Expenses</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <InputGroup label="Property Taxes (Annual)" id="propertyTaxes" value={data.propertyTaxes} onChange={handleChange} symbol="$" symbolPosition="left" tooltip="Annual property tax amount."/>
                     <InputGroup label="Home Insurance (Annual)" id="homeInsurance" value={data.homeInsurance} onChange={handleChange} symbol="$" symbolPosition="left" tooltip="Annual homeowner's insurance premium."/>
                     <InputGroup label="HOA Fees (Monthly)" id="hoa" value={data.hoa} onChange={handleChange} symbol="$" symbolPosition="left" tooltip="Monthly Homeowners Association fees, if any." />
                     <InputGroup label="Repairs & Maintenance" id="repairs" value={data.repairs} onChange={handleChange} symbol="%" tooltip="Percentage of income set aside for repairs. Typically 5-10%." />
                     <InputGroup label="Capital Expenditures (CapEx)" id="capex" value={data.capex} onChange={handleChange} symbol="%" tooltip="Percentage of income for large replacements (roof, HVAC). Typically 5-10%."/>
                     <InputGroup label="Management Fees" id="management" value={data.management} onChange={handleChange} symbol="%" tooltip="Percentage of income paid to a property manager. Typically 8-12% if not self-managed."/>
                </div>

                <button
                    onClick={onAnalyze}
                    className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 mt-4"
                >
                    Analyze Property
                </button>
            </div>
        </div>
    );
};
