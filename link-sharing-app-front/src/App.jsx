
import './styles/pages/App.css'
import { Routes, Route } from 'react-router-dom'
import { useContext } from 'react'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
/* import { Provider } from 'react-redux';
import store from "../src/redux/store.js";
 */
function App() {

  return (
    <>
      
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
        </Routes>
    

    </>
  )
}

export default App