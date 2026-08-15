import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AppContext = createContext(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);

    if (context === undefined)
        throw new Error(
            'Error: "useAppContext" Must Be Used WithIn an "AppContextProvider"',
        );

    return context;
};

export const AppContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const [loadingUser, setLoadingUser] = useState(true);

    const navigate = useNavigate();

    const checkSession = async () => {

        try {

            const { data } = await api.get("/api/auth/me");
            
            
            setUser(data.user);

        } catch (Error) {

            console.error("Error: ", Error)
            setUser(null);
        } finally {

            setLoadingUser(false)
        }
    }

    useEffect(() => {
        checkSession();
    }, [checkSession]);
    
    const login = async (email, password) => {

        try {

            const { data } = await api.post("api/auth/login", {email, password});
            setUser(data.user);

            toast.success("Welcome Back");

            navigate("/");
        } catch (Error) {
            
            console.error("Error: Login Failed. Exception: ", Error);
            
            toast.error(Error?.response?.error || "Invalid Email Or Password");

            throw new Error(Error);
        }
    }

     const register = async (name, email, password) => {

        try {

            const { data } = await api.post("api/auth/register", {name, email, password});
            setUser(data.user);

            toast.success("Account Created Successfully");

            navigate("/");
        } catch (Error) {
            
            console.error("Error: Rregistration Failed. Exception: ", Error);
            
            toast.error(Error?.response?.error || "Registration Password");

            throw new Error(Error);
        }
    }

    return (
        <AppContext.Provider value={{ user, loadingUser, login, register }}>
            {children}
        </AppContext.Provider>
    );
};
