const apiService = require('../src/services/apiService');

describe('API Service', () => {
  test('should return mock budget data', async () => {
    const budgetData = await apiService.getBudgetData(2024);
    
    expect(budgetData).toHaveProperty('year', 2024);
    expect(budgetData).toHaveProperty('totalBudget');
    expect(budgetData).toHaveProperty('ministries');
    expect(budgetData).toHaveProperty('expenses');
    expect(Array.isArray(budgetData.ministries)).toBe(true);
    expect(budgetData.ministries.length).toBeGreaterThan(0);
  });

  test('should return mock economic data', async () => {
    const economicData = await apiService.getEconomicData(2024);
    
    expect(economicData).toHaveProperty('year', 2024);
    expect(economicData).toHaveProperty('gdp');
    expect(economicData).toHaveProperty('inflation');
    expect(economicData).toHaveProperty('unemployment');
    expect(economicData.gdp).toHaveProperty('value');
    expect(economicData.gdp).toHaveProperty('growth');
  });

  test('should return ministry data by code', async () => {
    const ministryData = await apiService.getMinistryData('MINEDUC', 2024);
    
    expect(ministryData).toHaveProperty('name');
    expect(ministryData).toHaveProperty('code', 'MINEDUC');
    expect(ministryData).toHaveProperty('budget');
    expect(ministryData).toHaveProperty('details');
    expect(ministryData).toHaveProperty('historicalData');
    expect(Array.isArray(ministryData.historicalData)).toBe(true);
  });

  test('should throw error for invalid ministry code', async () => {
    await expect(apiService.getMinistryData('INVALID', 2024))
      .rejects
      .toThrow('Ministry INVALID not found');
  });

  test('should return consistent budget totals', async () => {
    const budgetData = await apiService.getBudgetData(2024);
    const ministriesSum = budgetData.ministries.reduce((sum, ministry) => sum + ministry.budget, 0);
    
    // Allow for small rounding differences
    expect(Math.abs(budgetData.totalBudget - ministriesSum)).toBeLessThan(1000000000);
  });

  test('should return valid percentage calculations', async () => {
    const budgetData = await apiService.getBudgetData(2024);
    const totalPercentage = budgetData.ministries.reduce((sum, ministry) => sum + ministry.percentage, 0);
    
    // Should be close to 100% (allowing for rounding)
    expect(totalPercentage).toBeCloseTo(100, 1);
  });
});

describe('Mock Data Validation', () => {
  test('mock budget data should have required fields', () => {
    const mockData = apiService.getMockBudgetData(2024);
    
    expect(mockData).toHaveProperty('year');
    expect(mockData).toHaveProperty('totalBudget');
    expect(mockData).toHaveProperty('currency');
    expect(mockData).toHaveProperty('ministries');
    expect(mockData).toHaveProperty('expenses');
    
    mockData.ministries.forEach(ministry => {
      expect(ministry).toHaveProperty('name');
      expect(ministry).toHaveProperty('budget');
      expect(ministry).toHaveProperty('percentage');
      expect(ministry).toHaveProperty('code');
    });
  });

  test('mock economic data should have required fields', () => {
    const mockData = apiService.getMockEconomicData(2024);
    
    expect(mockData).toHaveProperty('year');
    expect(mockData).toHaveProperty('gdp');
    expect(mockData).toHaveProperty('inflation');
    expect(mockData).toHaveProperty('unemployment');
    expect(mockData).toHaveProperty('publicDebt');
    
    expect(mockData.gdp).toHaveProperty('value');
    expect(mockData.gdp).toHaveProperty('currency');
    expect(mockData.gdp).toHaveProperty('growth');
  });
});
