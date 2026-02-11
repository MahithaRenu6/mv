import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-netflix-dark">

            {/* HERO SECTION */}
            <div className="relative h-screen w-full overflow-hidden">

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10" />

                {/* Video Background */}
                <motion.video
                    autoPlay
                    muted
                    loop
                    playsInline
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 8 }}
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                >
                    <source src="/abc.mp4" type="video/mp4" />
                </motion.video>

                {/* Hero Content */}
                <div className="relative z-20 max-w-7xl mx-auto h-full flex flex-col justify-center pb-20 px-6">

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-black text-white leading-tight mb-4"
                    >
                        EXPERIENCE <br />
                        <span className="text-netflix-red">CINEMA</span> LIKE <br />
                        NEVER BEFORE
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-300 text-lg max-w-xl mb-8"
                    >
                        Book tickets for the latest blockbusters, Indian gems, and international releases. Secure your seats in seconds.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex gap-4"
                    >
                        <button
                            onClick={() => navigate("/movies")}
                            className="bg-netflix-red hover:bg-red-700 transition px-6 py-3 rounded-md text-white font-semibold flex items-center gap-2 text-lg"
                        >
                            Explore Movies
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </motion.div>

                </div>
            </div>

        </div>
    );
};

export default Home;
