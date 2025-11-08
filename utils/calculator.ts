
import type { PropertyData, AnalysisResults } from '../types';

export const calculateMetrics = (data: PropertyData): AnalysisResults => {
  const {
    purchasePrice,
    downPayment,
    interestRate,
    loanTerm,
    propertyTaxes,
    homeInsurance,
    hoa,
    grossMonthlyRent,
    vacancyRate,
    repairs,
    capex,
    management,
    closingCosts,
  } = data;

  // Loan Details
  const downPaymentAmount = purchasePrice * (downPayment / 100);
  const closingCostsAmount = purchasePrice * (closingCosts / 100);
  const loanAmount = purchasePrice - downPaymentAmount;
  const monthlyInterestRate = (interestRate / 100) / 12;
  const numberOfPayments = loanTerm * 12;
  
  const principalAndInterest = loanAmount > 0 && numberOfPayments > 0 && monthlyInterestRate > 0
    ? loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
    : 0;

  // Income (Annual)
  const annualGrossPotentialRent = grossMonthlyRent * 12;
  const annualVacancyLoss = annualGrossPotentialRent * (vacancyRate / 100);
  const annualEffectiveGrossIncome = annualGrossPotentialRent - annualVacancyLoss;

  // Expenses (Annual)
  const annualPropertyTaxes = propertyTaxes;
  const annualHomeInsurance = homeInsurance;
  const annualHOA = hoa * 12;
  const annualRepairs = annualEffectiveGrossIncome * (repairs / 100);
  const annualCapex = annualEffectiveGrossIncome * (capex / 100);
  const annualManagement = annualEffectiveGrossIncome * (management / 100);
  
  const totalAnnualOperatingExpenses = annualPropertyTaxes + annualHomeInsurance + annualHOA + annualRepairs + annualCapex + annualManagement;
  
  // Cash Flow
  const annualNetOperatingIncome = annualEffectiveGrossIncome - totalAnnualOperatingExpenses;
  const annualDebtService = principalAndInterest * 12;
  const annualCashFlow = annualNetOperatingIncome - annualDebtService;
  const monthlyCashFlow = annualCashFlow / 12;
  
  // Returns
  const totalCashNeeded = downPaymentAmount + closingCostsAmount;
  const capRate = purchasePrice > 0 ? (annualNetOperatingIncome / purchasePrice) * 100 : 0;
  const cashOnCashReturn = totalCashNeeded > 0 ? (annualCashFlow / totalCashNeeded) * 100 : 0;

  // Rules of Thumb
  const onePercentRule = grossMonthlyRent >= purchasePrice * 0.01;
  const fiftyPercentRule = totalAnnualOperatingExpenses <= annualEffectiveGrossIncome * 0.5;

  return {
    grossPotentialRent: grossMonthlyRent,
    vacancyLoss: annualVacancyLoss / 12,
    effectiveGrossIncome: annualEffectiveGrossIncome / 12,
    principalAndInterest,
    monthlyTaxes: annualPropertyTaxes / 12,
    monthlyInsurance: annualHomeInsurance / 12,
    monthlyHOA: annualHOA / 12,
    monthlyVacancy: annualVacancyLoss / 12,
    monthlyRepairs: annualRepairs / 12,
    monthlyCapex: annualCapex / 12,
    monthlyManagement: annualManagement / 12,
    totalOperatingExpenses: totalAnnualOperatingExpenses / 12,
    netOperatingIncome: annualNetOperatingIncome / 12,
    monthlyDebtService: principalAndInterest,
    monthlyCashFlow,
    annualCashFlow,
    totalCashNeeded,
    capRate,
    cashOnCashReturn,
    onePercentRule,
    fiftyPercentRule
  };
};
