import { useState, useEffect, forwardRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar as CalendarIcon, Clock, Star, Play, MapPin, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useCity } from '../context/CityContext';

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { selectedCity, setSelectedCity } = useCity();
    const [movie, setMovie] = useState(null);
    const [shows, setShows] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedShow, setSelectedShow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingShows, setLoadingShows] = useState(false);

    useEffect(() => {
        fetchMovieDetails();
    }, [id]);

    useEffect(() => {
        if (selectedCity && selectedDate && id) {
            fetchShows();
        }
    }, [selectedCity, selectedDate, id]);

    const fetchMovieDetails = async () => {
        try {
            const { data } = await api.get(`/movies/${id}`);
            setMovie(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate max date (today + 20 days)
    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 20);
        return maxDate;
    };

    const fetchShows = async () => {
        if (!selectedCity || !selectedDate) return;

        setLoadingShows(true);
        try {
            // Format selectedDate to YYYY-MM-DD string for API
            // Use local time components to avoid timezone shifts
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            const { data } = await api.get(`/shows?movieId=${id}&city=${selectedCity}&date=${dateStr}`);
            setShows(data);
            setSelectedShow(null); // Reset selection on date change
        } catch (error) {
            console.error('Error fetching shows:', error);
            setShows([]); // Set empty array on error
        } finally {
            setLoadingShows(false);
        }
    };

    // Custom Input for DatePicker
    const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
        <button
            className="flex items-center gap-3 bg-netflix-black border border-white/10 px-6 py-3 rounded-xl hover:border-netflix-red transition-all w-full md:w-auto min-w-[240px] justify-between group"
            onClick={onClick}
            ref={ref}
        >
            <div className="flex items-center gap-3">
                <CalendarIcon className="text-netflix-red w-5 h-5" />
                <span className="font-bold text-lg">{value}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-netflix-gray group-hover:text-white transition-colors" />
        </button>
    ));

    if (loading || !movie) return (
        <div className="min-h-screen flex items-center justify-center bg-netflix-dark">
            <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    // Group shows by theatre
    const showsByTheatre = shows.reduce((acc, show) => {
        if (!show.theatreId) return acc; // Safety check
        const theatreId = show.theatreId._id;
        if (!acc[theatreId]) {
            acc[theatreId] = {
                theatre: show.theatreId,
                slots: []
            };
        }
        acc[theatreId].slots.push(show);
        return acc;
    }, {});

    return (
        <div className="pb-20 bg-netflix-dark text-white min-h-screen">
            {/* Backdrop Section */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark via-netflix-dark/60 to-transparent z-10" />
                <img
                    src={movie.poster}
                    alt={movie.title}
                    className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30 scale-110"
                />

                <div className="relative z-20 max-w-7xl mx-auto h-full flex items-end px-6 pb-12">
                    <div className="flex flex-col md:flex-row gap-8 items-end">
                        <motion.img
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            src={movie.poster}
                            className="w-48 md:w-64 rounded-xl shadow-2xl border-4 border-white/10"
                        />
                        <div className="flex-grow">
                            <motion.h1
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-4xl md:text-6xl font-black mb-4"
                            >
                                {movie.title}
                            </motion.h1>
                            <div className="flex flex-wrap gap-4 text-sm mb-6">
                                <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
                                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                    <span>{movie.rating} Rating</span>
                                </div>
                                <div className="bg-white/10 px-3 py-1 rounded-full">{movie.language}</div>
                                <div className="bg-white/10 px-3 py-1 rounded-full">{movie.genre.join(', ')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* About Movie */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            About the movie
                        </h2>
                        <p className="text-netflix-gray text-lg leading-relaxed">
                            {movie.description}
                        </p>
                    </section>

                    <section className="glass-panel p-8 bg-white/5 rounded-2xl border border-white/10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-6">
                            <h2 className="text-2xl font-bold">Book Tickets</h2>

                            {!selectedCity && (
                                <p className="text-netflix-red font-semibold animate-pulse">
                                    Please select a city in the header to view shows
                                </p>
                            )}
                        </div>

                        {/* Date Picker Section */}
                        <div className="mb-8 border-b border-white/10 pb-8">
                            <label className="block text-netflix-gray text-sm font-semibold mb-3">Select Date</label>
                            <div className="relative">
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    minDate={new Date()} // Disable past dates
                                    maxDate={getMaxDate()} // Limit to next 20 days
                                    dateFormat="MMMM d, yyyy"
                                    customInput={<CustomDateInput />}
                                    popperPlacement="bottom-start"
                                />
                            </div>
                        </div>


                        {/* Theatre & Shows */}
                        {!selectedCity ? (
                            <div className="text-center py-10 bg-white/5 rounded-xl border border-dashed border-white/20">
                                <p className="text-netflix-gray">Please select a city to view available theatres.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {loadingShows ? (
                                    <div className="text-center py-10">
                                        <div className="w-8 h-8 border-4 border-netflix-red border-t-transparent rounded-full animate-spin mx-auto"></div>
                                        <p className="text-netflix-gray mt-4">Loading shows...</p>
                                    </div>
                                ) : (
                                    <AnimatePresence mode="wait">
                                        {Object.values(showsByTheatre).length > 0 ? (
                                            <motion.div
                                                key={selectedDate.toISOString()}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="space-y-6"
                                            >
                                                {Object.values(showsByTheatre).map(({ theatre, slots }) => (
                                                    <div key={theatre._id} className="p-6 bg-white/5 rounded-xl border border-white/5 hover:border-netflix-red/20 transition-all">
                                                        <div className="flex items-start justify-between mb-6">
                                                            <div>
                                                                <h3 className="text-white font-bold text-xl mb-1">{theatre.name}</h3>
                                                                <div className="text-netflix-gray text-sm flex items-center gap-1">
                                                                    <MapPin className="w-3 h-3" />
                                                                    {theatre.location}, {theatre.city} <span className="text-xs bg-white/10 px-2 py-0.5 rounded ml-2">{theatre.type}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-wrap gap-3">
                                                            {slots.sort((a, b) => a.time.localeCompare(b.time)).map((show) => (
                                                                <button
                                                                    key={show._id}
                                                                    onClick={() => setSelectedShow(show)}
                                                                    className={`px-6 py-2 rounded-lg font-bold transition-all border ${selectedShow?._id === show._id
                                                                        ? 'bg-netflix-red border-netflix-red text-white shadow-lg shadow-netflix-red/40 scale-105'
                                                                        : 'bg-transparent border-white/20 text-netflix-gray hover:border-netflix-red hover:text-netflix-red'
                                                                        }`}
                                                                >
                                                                    {show.time}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-center py-10 bg-white/5 rounded-xl border border-dashed border-white/20"
                                            >
                                                <p className="text-netflix-gray text-lg">No shows available</p>
                                                <p className="text-netflix-gray/60 text-sm mt-2">Try selecting a different date</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                )}
                            </div>
                        )}

                        {/* Proceed Button */}
                        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                            {selectedShow && (
                                <div className="text-center md:text-left">
                                    <p className="text-netflix-gray text-sm">Selected Show</p>
                                    <p className="text-white font-bold text-lg">
                                        {selectedShow.theatreId.name} • {selectedShow.time}
                                    </p>
                                    <p className="text-netflix-red font-bold">Starts from ₹{selectedShow.basePrice}</p>
                                </div>
                            )}
                            <button
                                disabled={!selectedShow}
                                onClick={() => navigate(`/book/${selectedShow._id}`)}
                                className={`w-full md:w-auto px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-2xl ${selectedShow
                                    ? 'bg-netflix-red text-white hover:scale-105 shadow-netflix-red/30'
                                    : 'bg-white/5 text-netflix-gray cursor-not-allowed border border-white/10'
                                    }`}
                            >
                                Proceed to Seat Selection
                            </button>
                        </div>
                    </section>
                </div>


                {/* Sidebar / Offers */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 bg-gradient-to-br from-netflix-red/20 to-transparent">
                        <h3 className="font-bold text-xl mb-4">Special Offers</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-sm">
                                <div className="w-10 h-10 rounded-full bg-netflix-red/20 flex items-center justify-center shrink-0">
                                    %
                                </div>
                                <div>
                                    <p className="font-bold">20% Off on Snacks</p>
                                    <p className="text-netflix-gray">Valid on pre-booking only.</p>
                                </div>
                            </li>
                            <li className="flex gap-3 text-sm">
                                <div className="w-10 h-10 rounded-full bg-netflix-red/20 flex items-center justify-center shrink-0">
                                    💳
                                </div>
                                <div>
                                    <p className="font-bold">HDFC Bank Offer</p>
                                    <p className="text-netflix-gray">Buy 1 Get 1 Free on weekends.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
