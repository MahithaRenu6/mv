import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);


    const fetchBookings = async () => {
        try {
            console.log('Fetching bookings...');
            const { data } = await api.get('/bookings/my-bookings');
            console.log('Received bookings:', data);
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            console.error('Error response:', error.response?.data);
        } finally {
            setLoading(false);
        }
    };


    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking? Refund will be initiated.')) return;

        try {
            await api.put(`/bookings/${bookingId}/cancel`);
            // Refresh list
            fetchBookings();
            alert('Booking cancelled successfully. Refund initiated.');
        } catch (error) {
            console.error(error);
            alert('Failed to cancel booking');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-12">
            <div className="flex items-center gap-6 mb-12">
                <div className="w-24 h-24 rounded-full bg-netflix-red flex items-center justify-center text-4xl font-bold shadow-xl shadow-netflix-red/20">
                    {user.name.charAt(0)}
                </div>
                <div>
                    <h1 className="text-4xl font-black">{user.name}</h1>
                    <p className="text-netflix-gray">{user.email}</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <ShoppingBag className="text-netflix-red" />
                Booking History
            </h2>

            <div className="space-y-6">
                {bookings.length > 0 ? bookings.map((booking) => (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={booking._id}
                        className={`glass-panel p-6 border-l-4 ${booking.status === 'cancelled' ? 'border-gray-500 opacity-60' : 'border-netflix-red'} relative overflow-hidden group`}
                    >
                        <div className="flex flex-col md:flex-row gap-6">
                            <img
                                src={booking.showId?.movieId?.poster || 'https://via.placeholder.com/150'}
                                className="w-24 h-36 rounded-lg object-cover shadow-lg"
                                alt="Movie Poster"
                            />
                            <div className="flex-grow space-y-2">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold text-white group-hover:text-netflix-red transition-colors">
                                        {booking.showId?.movieId?.title || 'Unknown Movie'}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${booking.status === 'cancelled' ? 'bg-gray-500/20 text-gray-400' : 'bg-green-500/10 text-green-500'}`}>
                                        <CheckCircle className="w-3 h-3" />
                                        {booking.status === 'cancelled' ? 'Cancelled' : 'Confirmed'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm text-netflix-gray">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        {booking.showId?.theatreId?.name || 'Unknown Theatre'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {booking.showId?.date}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {booking.showId?.time}
                                    </div>
                                    <div className="font-bold text-white">
                                        Seats: {booking.seats.join(', ')}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex justify-between items-center mt-2">
                                    <span className="text-xs text-netflix-gray">ID: {booking._id.substring(0, 8)}...</span>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xl font-black text-white">₹{booking.totalPrice}</span>
                                        {booking.status !== 'cancelled' && (
                                            <button
                                                onClick={() => handleCancel(booking._id)}
                                                className="text-xs text-red-500 border border-red-500/50 px-3 py-1.5 rounded hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                Cancel Ticket
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ticket Cut-out Effect */}
                        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-netflix-dark rounded-full -translate-y-1/2" />
                        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-netflix-dark rounded-full -translate-y-1/2" />
                    </motion.div>
                )) : (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
                        <ShoppingBag className="w-16 h-16 text-netflix-gray/20 mx-auto mb-4" />
                        <p className="text-netflix-gray text-xl">No bookings yet.</p>
                        <button onClick={() => navigate('/')} className="mt-4 text-netflix-red font-bold hover:underline">Book Now</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
