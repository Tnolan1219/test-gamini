
export interface PropertyData {
  purchasePrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  propertyTaxes: number;
  homeInsurance: number;
  hoa: number;
  grossMonthlyRent: number;
  vacancyRate: number;
  repairs: number;
  capex: number;
  management: number;
  closingCosts: number;
}

export interface AnalysisResults {
  // Income
  grossPotentialRent: number;
  vacancyLoss: number;
  effectiveGrossIncome: number;
  // Expenses
  principalAndInterest: number;
  monthlyTaxes: number;
  monthlyInsurance: number;
  monthlyHOA: number;
  monthlyVacancy: number;
  monthlyRepairs: number;
  monthlyCapex: number;
  monthlyManagement: number;
  totalOperatingExpenses: number;
  // Cash Flow
  netOperatingIncome: number;
  monthlyDebtService: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  // Returns
  totalCashNeeded: number;
  capRate: number;
  cashOnCashReturn: number;
  // Rules
  onePercentRule: boolean;
  fiftyPercentRule: boolean;
}
