import { useContext } from "react";
import { AuthContext } from "../context/auth.context";

function Private({ children }) {
    const { isLoggedIn, isLoading } = useContext(AuthContext);

    if (isLoading) return <p>Loading ...</p>;

    return isLoggedIn ? <>{children}</> : null;
}

export default Private;
