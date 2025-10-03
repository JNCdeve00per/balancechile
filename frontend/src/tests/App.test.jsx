import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import App from '../src/App'

// Mock the API hooks
vi.mock('../src/hooks/useApi', () => ({
  useBudget: () => ({
    data: {
      data: {
        totalBudget: 48500000000000,
        ministries: [
          { name: 'Ministerio de Educación', budget: 8500000000000, percentage: 17.5, code: 'MINEDUC' }
        ]
      }
    },
    isLoading: false,
    error: null
  }),
  useEconomicData: () => ({
    data: {
      data: {
        gdp: { value: 280000000000, growth: 2.3 },
        inflation: 3.8
      }
    },
    isLoading: false,
    error: null
  }),
  useMinistries: () => ({
    data: {
      data: {
        ministries: [
          { name: 'Ministerio de Educación', budget: 8500000000000, percentage: 17.5, code: 'MINEDUC' }
        ]
      }
    },
    isLoading: false,
    error: null
  }),
  useExpenses: () => ({
    data: {
      data: {
        expenses: {
          personnel: { amount: 18500000000000, percentage: 38.1 },
          programs: { amount: 20200000000000, percentage: 41.6 },
          investment: { amount: 9800000000000, percentage: 20.2 }
        }
      }
    },
    isLoading: false,
    error: null
  })
}))

const renderWithProviders = (component) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    </BrowserRouter>
  )
}

describe('App', () => {
  it('renders without crashing', () => {
    renderWithProviders(<App />)
    expect(screen.getByText('Balance Chile')).toBeInTheDocument()
  })

  it('displays dashboard content', () => {
    renderWithProviders(<App />)
    expect(screen.getByText('Dashboard Presupuesto Público')).toBeInTheDocument()
  })
})
