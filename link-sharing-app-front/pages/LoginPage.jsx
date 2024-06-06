import '../src/styles/pages/LoginPage.css'
import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../src/context/auth.context";

const API_URL = "http://localhost:5005";


function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(undefined);

    const navigate = useNavigate();

    /*  UPDATE - get authenticateUser from the context */
    const { storeToken, authenticateUser } = useContext(AuthContext);


    const handleEmail = (e) => setEmail(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);


    const handleLoginSubmit = (e) => {
        e.preventDefault();
        const requestBody = { email, password };

        axios.post(`${API_URL}/auth/login`, requestBody)
            .then((response) => {
                console.log('JWT token', response.data.authToken);

                // Save the token in the localStorage.      
                storeToken(response.data.authToken);

                // Verify the token by sending a request 
                // to the server's JWT validation endpoint. 
                authenticateUser();                     // <== ADD
                navigate('/');
            })
            .catch((error) => {
                const errorDescription = error.response.data.message;
                setErrorMessage(errorDescription);
            })
    };


    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLoginSubmit}>
                <label> Email Adress </label>
                <div className="input-container">
                    <i className="ri-mail-line"></i>
                    <input type="text" onChange={handleEmail} />
                </div>
                <label> Password </label>
                <div className="input-container">
                    <i className="ri-lock-password-line"></i>
                    <input type="text" onChange={handlePassword} />
                </div>
                <button>Login</button>
                <div className="no-account-container">
                    <p>Don't have Account yet ?</p>
                    <Link to="/login">signup</Link>
                </div>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}

        </div>
    )
}

export default LoginPage