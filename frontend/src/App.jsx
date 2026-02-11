import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CityProvider } from './context/CityContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Movies from './pages/Movies';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetails from './pages/MovieDetails';
import SeatSelection from './pages/SeatSelection';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import BookingConfirmation from './pages/BookingConfirmation';

function App() {
    return (
        <AuthProvider>
            <CityProvider>
                <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <div className="flex flex-col min-h-screen">
                        <Navbar />
                        <main className="flex-grow">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/movies" element={<Movies />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/movie/:id" element={<MovieDetails />} />

                                <Route element={<ProtectedRoute />}>
                                    <Route path="/book/:showId" element={<SeatSelection />} />
                                    <Route path="/profile" element={<Profile />} />
                                    <Route path="/confirmation/:id" element={<BookingConfirmation />} />
                                </Route>

                                <Route element={<ProtectedRoute adminOnly={true} />}>
                                    <Route path="/admin" element={<AdminDashboard />} />
                                </Route>
                            </Routes>
                        </main>
                        <Toaster
                            position="bottom-right"
                            toastOptions={{
                                style: {
                                    background: '#333',
                                    color: '#fff',
                                    borderRadius: '12px',
                                },
                            }}
                        />
                    </div>
                </Router>
            </CityProvider>
        </AuthProvider>
    );
}

export default App;
