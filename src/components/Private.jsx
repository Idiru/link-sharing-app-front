import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";


function Private({ children }) {
    const { isLoggedIn, isLoading } = useContext(AuthContext);
    const navigate = useNavigate();


    if (isLoading) return <p>Loading ...</p>;

    if (!isLoggedIn) {
        // Redirect to login page if not logged in
        navigate("/login", { replace: true, state: { from: 'privateRoute', reason: 'notAuthenticated' } });
    }

    return <>{children}</>;
}

export default Private;
