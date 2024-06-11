
import './styles/pages/App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import SignupValidationPage from '../pages/SignupValidationPage'
import UpdateUserPage from '../pages/UpdateUserPage'
import LinksPage from '../pages/LinksPage'
import Anonymous from './components/Anonymous'
import Private from './components/Private'
function App() {

  return (
    <>

      <Routes>
        <Route path='/' element={<Anonymous><HomePage /></Anonymous>} />
        <Route path='/login' element={<Anonymous><LoginPage /></Anonymous>} />
        <Route path='/signup' element={<Anonymous><SignupPage /></Anonymous>} />
        <Route path='/signup-validation' element={<SignupValidationPage />} />
        <Route path='/update/:id' element={<Private><UpdateUserPage /></Private>} />
        <Route path='/links' element={<Private><LinksPage /></Private>} />
      </Routes>


    </>
  )
}

export default App