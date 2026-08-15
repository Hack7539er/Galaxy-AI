import { useState } from "react";
import LoginLeftBrandingSide from "../components/LoginLeftBrandingSide";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const AuthenticationPage = ({ mode }) => {
    const isLogin = mode === "login";

    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const { login, register } = useAppContext();

    const formSubmitHandler = async (Event) => {
        Event.preventDefault();

        setError("");

        setLoading(true);

        try {
            
            if (mode === "login") await login(email, password);

            else await register(name, email, password);

            navigate("/");
        } catch (Error) {
            setError(Error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex text-zinc-900 font-sans">
            {/* Left Panel === Branding Content */}
            <LoginLeftBrandingSide />

            {/* Right Panel === Main Login From With Mode According */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-sm">
                    <div className="mb-10">
                        <h1 className="text-3xl font-medium tracking-tight text-zinc-900 mb-1.5">
                            {isLogin ? "Sign In" : "Create An Account"}
                        </h1>
                        <p className="text-sm text-zinc-400">
                            {isLogin
                                ? "Enter Your Credentials To Access Your Website Builder."
                                : "Get Started By Entering Your Registration Details."}
                        </p>
                    </div>
                    {error && (
                        <div className="mb-6 p-3 border border-red-200 bg-red-50 text-red-700 text-xs rounded">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-6" onSubmit = { formSubmitHandler }>
                        {!isLogin && (
                            <div>
                                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                                    Full Name
                                </label>
                                <input
                                    className="w-full pl-2 py-2 border-b border-zinc-200 focus:outline-none focus:border-zinc-950 text-sm text-zinc-900 bg-transparent placeholder-zinc-300 transition-colors"
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(Event) =>
                                        setName(Event.target.value)
                                    }
                                    required
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                                Email Address
                            </label>
                            <input
                                className="w-full pl-2 py-2 border-b border-zinc-200 focus:outline-none focus:border-zinc-950 text-sm text-zinc-900 bg-transparent placeholder-zinc-300 transition-colors"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(Event) =>
                                    setEmail(Event.target.value)
                                }
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full pl-2 py-2 border-b border-zinc-200 focus:outline-none focus:border-zinc-950 text-sm text-zinc-900 bg-transparentplaceholder-zinc-300 pr-8"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="......."
                                    value={password}
                                    onChange={(Event) =>
                                        setPassword(Event.target.value)
                                    }
                                    required
                                />
                                <button
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-600 flex items-center justify-center cursor-pointer transition-colors"
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOffIcon size={14} />
                                    ) : (
                                        <EyeIcon size={14} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            className="w-full py-2.5 bg-linear-to-br from-red-600 to-amber-600 text-white font-semibold hover:scale-102 disabled:opacity-40 felx items-center justify-center cursor-pointer mt-2 rounded-lg transition-all"
                            type="submit"
                            disable={loading}
                        >
                            {loading && (
                                <Loader2Icon className="animate-soin w-3.5 h-3.5 mr-2" />
                            )}
                            {isLogin ? "Sign In" : "Sign Up"}
                        </button>
                    </form>
                    <p className="text-sm text-zinc-400 mt-8 pt-6 border-t border-zinc-100 font-sans">
                        {isLogin ? (
                            <>
                                New To GalaxyAI{" "}
                                <Link
                                    className="text-zinc-900 font-medium hover:underline hover:text-blue-700"
                                    to="/register"
                                >
                                    Create An Account
                                </Link>
                            </>
                        ) : (
                            <>
                                Already Have An Account?{" "}
                                <Link
                                    className="text-zinc-900 font-medium hover:underline hover:text-blue-700"
                                    to="/login"
                                >
                                    Sign In Here
                                </Link>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthenticationPage;
