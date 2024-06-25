
import './styles/pages/App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import SignupValidationPage from './pages/SignupValidationPage'
import UpdateUserPage from './pages/UpdateUserPage'
import BuilderPage from './pages/BuilderPage'
import VisitorsPage from './pages/VisitorsPage'

function App() {

  return (
    <>

      <Routes>
        {/* <Route path='/' element={<HomePage />}/> */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/signup-validation' element={<SignupValidationPage />} />
        <Route path='/update/:id' element={<Private><UpdateUserPage /></Private>} />
        <Route path='/' element={<Private><BuilderPage /></Private>} />
        <Route path='/links' element={<VisitorsPage />} />
        <Route path='/:id/preview' element={<PreviewPage />} />
      </Routes>
    </>
  )
}

export default App


