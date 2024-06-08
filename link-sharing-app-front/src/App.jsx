
import './styles/pages/App.css'
import { Routes, Route } from 'react-router-dom'
import { useContext } from 'react'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import SignupValidationPage from '../pages/SignupValidationPage'


function App() {

  return (
    <>

      <Routes>
        <Route path='/' element={<Private><HomePage /></Private>} />
        <Route path='/login' element={<Anonymous><LoginPage /></Anonymous>} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/signup-validation' element={<SignupValidationPage />} />
      </Routes>


    </>
  )
}

export default App