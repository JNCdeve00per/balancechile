import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Ministries from './pages/Ministries'
import MinistryDetail from './pages/MinistryDetail'
import Economic from './pages/Economic'
import About from './pages/About'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ministries" element={<Ministries />} />
        <Route path="/ministry/:code" element={<MinistryDetail />} />
        <Route path="/economic" element={<Economic />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Layout>
  )
}

export default App

