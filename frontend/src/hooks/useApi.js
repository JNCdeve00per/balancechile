import { useQuery } from 'react-query'
import { budgetApi, economicApi, ministryApi } from '../services/api'

// Budget hooks
export const useBudget = (year = 2024) => {
  return useQuery(
    ['budget', year],
    () => budgetApi.getBudget(year).then(res => res.data),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    }
  )
}

export const useMinistries = (year = 2024, sort = 'budget', order = 'desc') => {
  return useQuery(
    ['ministries', year, sort, order],
    () => budgetApi.getMinistries(year, sort, order).then(res => res.data),
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    }
  )
}

export const useExpenses = (year = 2024) => {
  return useQuery(
    ['expenses', year],
    () => budgetApi.getExpenses(year).then(res => res.data),
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    }
  )
}

// Economic hooks
export const useEconomicData = (year = 2024) => {
  return useQuery(
    ['economic', year],
    () => economicApi.getEconomicData(year).then(res => res.data),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
    }
  )
}

export const useGDP = (year = 2024, range = 5) => {
  return useQuery(
    ['gdp', year, range],
    () => economicApi.getGDP(year, range).then(res => res.data),
    {
      staleTime: 10 * 60 * 1000,
      cacheTime: 60 * 60 * 1000,
    }
  )
}

// Ministry hooks
export const useMinistry = (code, year = 2024) => {
  return useQuery(
    ['ministry', code, year],
    () => ministryApi.getMinistry(code, year).then(res => res.data),
    {
      enabled: !!code,
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    }
  )
}

export const useAllMinistries = (year = 2024) => {
  return useQuery(
    ['all-ministries', year],
    () => ministryApi.getAllMinistries(year).then(res => res.data),
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    }
  )
}

