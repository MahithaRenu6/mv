import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Search, Play } from 'lucide-react';
import CitySelector from './CitySelector';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-netflix-dark to-transparent px-6 py-4 transition-all duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <Link to="/" className="flex items-center gap-2 group">
                        <span className="bg-netflix-red text-white px-2.5 py-1 rounded text-2xl font-black tracking-tighter">MOV</span>
                        <span className="text-white text-2xl font-bold tracking-tight group-hover:text-netflix-red transition-colors">TICKET</span>
                    </Link>
                    <CitySelector />

                    <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-gray-300">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <Link to="/movies" className="hover:text-white transition-colors">Movies</Link>
                        {user?.role === 'admin' && (
                            <Link to="/admin" className="text-netflix-red hover:brightness-125 transition-all">Admin Panel</Link>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-netflix-gray w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search movies..."
                            className="bg-netflix-black/60 border border-white/10 rounded-full pl-12 pr-4 py-1.5 text-sm focus:border-netflix-red outline-none transition-all w-64"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    navigate(`/movies?search=${e.target.value}`);
                                }
                            }}
                        />
                    </div>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link to="/profile" className="flex items-center gap-2 hover:text-netflix-red transition-colors">
                                <User className="w-5 h-5" />
                                <span className="hidden sm:inline">{user.name}</span>
                            </Link>
                            <button
                                onClick={() => { logout(); navigate('/login'); }}
                                className="p-2 hover:text-netflix-red transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn-primary py-1.5 px-6 text-sm">
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
