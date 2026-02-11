import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import loginBg from "../assets/login_bg.jpg";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        let err = {};
        if (!email.includes("@")) err.email = "Invalid email";
        if (!password) err.password = "Password required";
        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await login(email, password);
            toast.success("Welcome!");
            navigate("/");
        } catch {
            toast.error("Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex h-screen w-full items-center justify-center bg-cover bg-center relative"
            style={{ backgroundImage: `url(${loginBg})` }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-black/75 p-8 rounded-xl shadow-2xl relative z-10 border border-white/10"
            >
                <div className="mb-10 text-center">
                    <h2 className="text-4xl font-black text-white mb-2">Welcome Back</h2>
                    <p className="text-gray-400">
                        Sign in to continue your cinematic journey
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* EMAIL */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                className={`w-full bg-[#1a1a1a] border ${errors.email ? 'border-red-500' : 'border-gray-800'} rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-netflix-red transition-colors`}
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* PASSWORD */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-400">Password</label>
                            {/* <a href="#" className="text-xs text-netflix-red hover:underline">Forgot password?</a> */}
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type={show ? "text" : "password"}
                                className={`w-full bg-[#1a1a1a] border ${errors.password ? 'border-red-500' : 'border-gray-800'} rounded-xl py-3 pl-12 pr-12 text-white focus:outline-none focus:border-netflix-red transition-colors`}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShow(!show)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            >
                                {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    <button className="w-full bg-netflix-red hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex justify-center items-center shadow-lg shadow-netflix-red/20">
                        {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                    </button>
                </form>

                <p className="text-center text-gray-400 mt-8">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-white font-bold hover:text-netflix-red transition-colors">
                        Sign Up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
