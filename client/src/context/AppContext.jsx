import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
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

    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [activeProjects, setActiveProjects] = useState(null);
    const [loadingActiveProjects, setLoadingActiveProjects] = useState(true);
    const [chatLoading, setChatLoading] = useState(false);
    const [generatingProject, setgeneratingProject] = useState(false);
    const [activeFile, setActiveFile] = useState("/App.js");
    const [showCode, setShowCode] = useState(false);

    const navigate = useNavigate();

    const checkSession = useCallback(async () => {
        try {
            const { data } = await api.get("/api/auth/me");
            setUser(data.user);
        } catch (Error) {
            console.error("Error: ", Error);
            setUser(null);
        } finally {
            setLoadingUser(false);
        }
    }, []);

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    const login = async (email, password) => {
        try {
            const { data } = await api.post("api/auth/login", {
                email,
                password,
            });
            setUser(data.user);

            toast.success("Welcome Back");

            navigate("/");
        } catch (Error) {
            console.error("Error: Login Failed. Exception: ", Error);

            toast.error(Error?.response?.error || "Invalid Email Or Password");

            throw new Error(Error);
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await api.post("api/auth/register", {
                name,
                email,
                password,
            });
            setUser(data.user);

            toast.success("Account Created Successfully");

            navigate("/");
        } catch (Error) {
            console.error("Error: Rregistration Failed. Exception: ", Error);

            toast.error(Error?.response?.error || "Registration Password");

            throw new Error(Error);
        }
    };

    const logOut = async () => {
        try {
            await api.post("/api/auth/logout");
            setUser(null);
            setProjects([]);
            setActiveProjects(null);

            toast.success("Logged Out Successfully");

            navigate("/login");
        } catch (Error) {
            console.error("Error: LogOut Failed. Exception: ", Error);

            toast.error("Logout Failed");
        }
    };

    const loadProjects = async () => {
        if (!user) return;

        try {
            const { data } = await api.get("/api/projects");

            setProjects(data);
        } catch (Error) {
            console.error("Error: Failed To List Projects. Exception: ", Error);

            toast.error("Failed To Load Projects List");
        } finally {
            setLoadingProjects(false);
        }
    };

    const loadProject = useCallback(
        async (id, silent = false) => {
            if (!user) return;

            if (!silent) setLoadingActiveProjects(true);

            try {
                const { data } = await api.get(`/api/projects/${id}`);
                setActiveProjects(data);

                const files = Object.keys(data.files);

                if (files.length > 0) {
                    setActiveFile((previosData) => {
                        if (files.includes(previosData)) return previosData;
                        if (files.includes("/App.js")) return "/App.js";

                        return files[0];
                    });
                }
            } catch (Error) {
                console.error("Failed To Load Project. Exception: ", Error);

                if (!silent) {
                    toast.error("Failed To Load Project Details.");
                    navigate("/");
                }
            } finally {
                if (!silent) setLoadingActiveProjects(false);
            }
        },
        [navigate, user],
    );

    useEffect(() => {
        if (!activeProjects?._id || !user) return;

        const isOnGoing =
            activeProjects.status === "generating" ||
            activeProjects.status === "pending" ||
            activeProjects.status === "revising";

        if (isOnGoing) {
            setChatLoading(true);

            const interval = setInterval(() => {
                loadProject(activeProjects._id, true);
            }, 2000);
            return () => clearInterval(interval);
        } else setChatLoading(false);
    }, [activeProjects?._id, activeProjects?.status, loadProject, user]);

    const generateHandler = useCallback(
        async (prompt) => {
            if (!user) return;
            setgeneratingProject(true);

            try {
                const { data } = await api.post("/api/projects", { prompt });

                toast.success("AI Agent Is Plannning Structure.");

                navigate(`/builder/${data._id}`);
            } catch (Error) {
                console.error(
                    "Error: Failed To Generating Project. Exception: ",
                    Error,
                );

                toast.error(
                    Error?.response?.data?.error ||
                        "Failed To Generating Project",
                );
            } finally {
                setgeneratingProject(false);
            }
        },
        [user, navigate],
    );

    const deleteHandler = useCallback(
        async (id) => {
            if (!user) return;

            try {
                await api.delelte(`/api/delete${id}`);

                setProjects((previousProject) =>
                    previousProject.filter((project) => project._id !== id),
                );

                toast.success("Project Deleted Successfully");
            } catch (Error) {
                console.error(
                    "Error: Failed To Deleting Project. Exception: ",
                    Error,
                );

                toast.error(
                    Error?.response?.data?.error ||
                        "Failed To Deleting Project",
                );
            }
        },
        [user],
    );

    return (
        <AppContext.Provider
            value={{
                user,
                loadingUser,
                login,
                register,
                projects,
                loadingProjects,
                activeProjects,
                loadingActiveProjects,
                generateHandler,
                setShowCode,
                setActiveFile,
                loadProjects,
                loadProject,
                activeFile,
                chatLoading,
                deleteHandler,
                logOut,
                generatingProject,
                showCode
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
