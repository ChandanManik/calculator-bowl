/**
 * Complete URL Architecture Migration Script
 * Migrates all 37 calculators and clusters to /calculators/[category]/[subcategory]/[calculator-name]/
 */
const fs = require('fs');
const path = require('path');

const URL_MAP = {
  'loan-calculator': { category: 'finance', subcategory: 'loans', subcatTitle: 'Loans & Mortgages', slug: 'loan-calculator' },
  'mortgage-calculator': { category: 'finance', subcategory: 'loans', subcatTitle: 'Loans & Mortgages', slug: 'mortgage-calculator' },
  'auto-loan': { category: 'finance', subcategory: 'loans', subcatTitle: 'Loans & Mortgages', slug: 'auto-loan-calculator' },
  'credit-card-payoff': { category: 'finance', subcategory: 'loans', subcatTitle: 'Loans & Mortgages', slug: 'credit-card-payoff-calculator' },
  'compound-interest': { category: 'finance', subcategory: 'interest', subcatTitle: 'Interest Solvers', slug: 'compound-interest-calculator' },
  'simple-interest': { category: 'finance', subcategory: 'interest', subcatTitle: 'Interest Solvers', slug: 'simple-interest-calculator' },
  'future-value': { category: 'finance', subcategory: 'investment', subcatTitle: 'Investment & Wealth', slug: 'future-value-calculator' },
  'gold-calculator': { category: 'finance', subcategory: 'investment', subcatTitle: 'Investment & Wealth', slug: 'gold-calculator' },
  'bitcoin-calculator': { category: 'finance', subcategory: 'investment', subcatTitle: 'Investment & Wealth', slug: 'bitcoin-calculator' },
  'salary-calculator': { category: 'finance', subcategory: 'business', subcatTitle: 'Business & Tax', slug: 'salary-calculator' },
  'sales-tax': { category: 'finance', subcategory: 'business', subcatTitle: 'Business & Tax', slug: 'sales-tax-calculator' },
  'margin-markup': { category: 'finance', subcategory: 'business', subcatTitle: 'Business & Tax', slug: 'profit-margin-calculator' },
  'depreciation-calculator': { category: 'finance', subcategory: 'business', subcatTitle: 'Business & Tax', slug: 'depreciation-calculator' },
  'tip-calculator': { category: 'finance', subcategory: 'business', subcatTitle: 'Business & Tax', slug: 'tip-calculator' },

  'basic-calculator': { category: 'math', subcategory: 'basic', subcatTitle: 'Basic Arithmetic', slug: 'basic-calculator' },
  'percentage-calculator': { category: 'math', subcategory: 'percentage', subcatTitle: 'Percentage Tools', slug: 'percentage-calculator' },
  'fractions-operations': { category: 'math', subcategory: 'fractions', subcatTitle: 'Fraction Solvers', slug: 'fraction-arithmetic-calculator' },
  'fraction-to-decimal': { category: 'math', subcategory: 'fractions', subcatTitle: 'Fraction Solvers', slug: 'fraction-to-decimal-calculator' },
  'decimal-to-fraction': { category: 'math', subcategory: 'fractions', subcatTitle: 'Fraction Solvers', slug: 'decimal-to-fraction-calculator' },
  'mixed-number-calc': { category: 'math', subcategory: 'fractions', subcatTitle: 'Fraction Solvers', slug: 'mixed-numbers-calculator' },
  'fraction-simplifier': { category: 'math', subcategory: 'fractions', subcatTitle: 'Fraction Solvers', slug: 'fraction-simplifier-calculator' },
  'gcf-lcm-calculator': { category: 'math', subcategory: 'algebra', subcatTitle: 'Algebra & Numbers', slug: 'gcf-lcm-calculator' },
  'prime-factorization': { category: 'math', subcategory: 'algebra', subcatTitle: 'Algebra & Numbers', slug: 'prime-factorization-calculator' },
  'ratio-calculator': { category: 'math', subcategory: 'algebra', subcatTitle: 'Algebra & Numbers', slug: 'ratio-proportion-calculator' },
  'quadratic-formula': { category: 'math', subcategory: 'algebra', subcatTitle: 'Algebra & Numbers', slug: 'quadratic-formula-calculator' },
  'scientific-notation': { category: 'math', subcategory: 'algebra', subcatTitle: 'Algebra & Numbers', slug: 'scientific-notation-calculator' },
  'exponent-calculator': { category: 'math', subcategory: 'algebra', subcatTitle: 'Algebra & Numbers', slug: 'exponent-power-calculator' },
  'mean-median-mode': { category: 'math', subcategory: 'statistics', subcatTitle: 'Statistics & Probability', slug: 'mean-median-mode-calculator' },
  'standard-deviation': { category: 'math', subcategory: 'statistics', subcatTitle: 'Statistics & Probability', slug: 'standard-deviation-calculator' },

  'temperature-converter': { category: 'conversion', subcategory: 'measurement', subcatTitle: 'Units & Measurements', slug: 'temperature-converter' },
  'length-converter': { category: 'conversion', subcategory: 'measurement', subcatTitle: 'Units & Measurements', slug: 'length-converter' },
  'weight-converter': { category: 'conversion', subcategory: 'measurement', subcatTitle: 'Units & Measurements', slug: 'weight-converter' },

  'age-calculator': { category: 'date-time', subcategory: 'calendar', subcatTitle: 'Calendar & Dates', slug: 'age-calculator' },
  'time-calculator': { category: 'date-time', subcategory: 'calendar', subcatTitle: 'Calendar & Dates', slug: 'time-duration-calculator' },
  'weather-forecast': { category: 'date-time', subcategory: 'environment', subcatTitle: 'Atmospheric & Weather', slug: 'weather-forecast-calculator' },

  'internet-speed-test': { category: 'tech-network', subcategory: 'speed', subcatTitle: 'Broadband & Speed', slug: 'internet-speed-test' },
  'streaming-data-calculator': { category: 'tech-network', subcategory: 'data', subcatTitle: 'Data Usage', slug: 'streaming-data-calculator' }
};

const CATEGORY_MAP = {
  'financial': { id: 'finance', pathId: 'finance', title: 'Financial Calculators', shortTitle: 'Financial', icon: '💰', url: '/calculators/finance/' },
  'math': { id: 'math', pathId: 'math', title: 'Math & Fraction Calculators', shortTitle: 'Math', icon: '➗', url: '/calculators/math/' },
  'conversions': { id: 'conversion', pathId: 'conversion', title: 'Conversion Calculators', shortTitle: 'Conversions', icon: '🔄', url: '/calculators/conversion/' },
  'datetime': { id: 'date-time', pathId: 'date-time', title: 'Date & Time Calculators', shortTitle: 'Date & Time', icon: '⏱️', url: '/calculators/date-time/' },
  'network': { id: 'tech-network', pathId: 'tech-network', title: 'Tech & Network Calculators', shortTitle: 'Network', icon: '🌐', url: '/calculators/tech-network/' }
};

console.log('Migration script helper loaded.');
module.exports = { URL_MAP, CATEGORY_MAP };
