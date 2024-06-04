import '../src/styles/pages/LoginPage.css'
function loginPage() {
    return (
        <div className="login-container">
            <h2>Login</h2>

            <label> Email Adress </label>
            <div className="input-container">
                <i className="ri-mail-line"></i>
                <input type="text" />
            </div>
            <label> Password </label>
            <div className="input-container">
                <i className="ri-lock-password-line"></i>
                <input type="text" />
            </div>
            <button>Login</button>


        </div>
    )
}

export default loginPage