import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api.js";

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
    
    return (
        <AppContext.Provider value={{ user, loadingUser }}>
            {children}
        </AppContext.Provider>
    );
};
