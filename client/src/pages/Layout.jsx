import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import Loading from "../components/Loading.jsx";

export const AuthenticationLayout = () => {

    const { user, loadingUser } = useAppContext();

    if (loadingUser) return <Loading />

    if (!user) return <Navigate to = "/login" replace />
    
    return <Outlet />
}

export const GuestLayout = () => {

    const { user, loadingUser } = useAppContext();

    if (loadingUser) return <Loading />

    if (user) return <Navigate to = "/" replace />
    
    return <Outlet />
}