
import './styles/pages/App.css'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import SignupValidationPage from './pages/SignupValidationPage'
import ProfilePage from './pages/ProfilePage'
import BuilderPage from './pages/BuilderPage'
import VisitorsPage from './pages/VisitorsPage'
import Private from './components/Private'
import PreviewPage from './pages/PreviewPage'
import AnalyticsPage from './pages/AnalyticsPage'

function App() {

  return (
    <>

      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/signup-validation' element={<SignupValidationPage />} />
        <Route path='/profile/:id' element={<Private><ProfilePage /></Private>} />
        <Route path='/' element={<Private><BuilderPage /></Private>} />
        <Route path='/devlinks/:userName' element={<VisitorsPage />} />
        <Route path='/:id/preview' element={<PreviewPage />} />
        <Route path='/performance/:contentId' element={<AnalyticsPage />} />
      </Routes>
    </>
  )
}

export default App


