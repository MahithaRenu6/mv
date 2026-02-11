import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import loginBg from "../assets/login_bg.jpg";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        let err = {};

        if (!name.trim()) err.name = "Name required";
        if (!email.includes("@")) err.email = "Invalid email";
        if (password.length < 6) err.password = "Min 6 characters";

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await register(name, email, password);
            toast.success("Account created!");
            navigate("/");
        } catch {
            toast.error("Registration failed");
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
                    <h2 className="text-4xl font-black text-white mb-2">Create Account</h2>
                    <p className="text-gray-400">
                        Join us and book your favorite movies
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* NAME */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                className={`w-full bg-[#1a1a1a] border ${errors.name ? 'border-red-500' : 'border-gray-800'} rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-netflix-red transition-colors`}
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

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
                        <label className="text-sm font-medium text-gray-400">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="password"
                                className={`w-full bg-[#1a1a1a] border ${errors.password ? 'border-red-500' : 'border-gray-800'} rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-netflix-red transition-colors`}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>

                    <button className="w-full bg-netflix-red hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex justify-center items-center shadow-lg shadow-netflix-red/20">
                        {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
                    </button>
                </form>

                <p className="text-center text-gray-400 mt-8">
                    Already have account?{" "}
                    <Link to="/login" className="text-white font-bold hover:text-netflix-red transition-colors">
                        Sign In
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
