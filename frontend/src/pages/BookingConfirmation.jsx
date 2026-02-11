import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { CheckCircle, Download, ArrowRight, Share2, MapPin, Calendar, Clock, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';

const BookingConfirmation = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const { data } = await api.get(`/bookings/${id}`);
                setBooking(data);
            } catch (error) {
                console.error('Error fetching booking:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!booking) return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
            <Link to="/" className="btn-primary">Back to Home</Link>
        </div>
    );

    return (
        <div className="min-h-[90vh] flex flex-col items-center justify-center px-6 pt-24 pb-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl"
            >
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/20">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-black mb-2">Booking Confirmed!</h1>
                    <p className="text-netflix-gray text-lg">
                        Your ticket has been sent to your email.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-stretch">
                    {/* Ticket Card */}
                    <div className="flex-grow bg-white text-black rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[300px]">
                        {/* Poster Side */}
                        <div className="md:w-1/3 relative">
                            <img
                                src={booking.showId.movieId.poster}
                                alt={booking.showId.movieId.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20" />
                        </div>

                        {/* Details Side */}
                        <div className="md:w-2/3 p-8 flex flex-col justify-between relative bg-white">
                            {/* Perforated Edge Effect (Visual only) */}
                            <div className="absolute left-0 top-1/2 -translate-x-1/2 w-8 h-8 bg-netflix-dark rounded-full hidden md:block" />
                            <div className="absolute right-0 top-1/2 translate-x-1/2 w-8 h-8 bg-netflix-dark rounded-full hidden md:block" />

                            <div>
                                <h2 className="text-3xl font-black mb-1">{booking.showId.movieId.title}</h2>
                                <p className="text-gray-500 text-sm mb-6">{booking.showId.movieId.language} • {booking.showId.movieId.genre.join(', ')}</p>

                                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                    <div>
                                        <p className="text-xs uppercase text-gray-400 font-bold mb-1">Date</p>
                                        <div className="flex items-center gap-2 font-bold text-lg">
                                            <Calendar className="w-4 h-4 text-netflix-red" />
                                            {new Date(booking.showId.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase text-gray-400 font-bold mb-1">Time</p>
                                        <div className="flex items-center gap-2 font-bold text-lg">
                                            <Clock className="w-4 h-4 text-netflix-red" />
                                            {booking.showId.time}
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs uppercase text-gray-400 font-bold mb-1">Theatre</p>
                                        <div className="flex items-center gap-2 font-bold text-lg">
                                            <MapPin className="w-4 h-4 text-netflix-red" />
                                            {booking.showId.theatreId.name}, {booking.showId.theatreId.city}
                                        </div>
                                        <p className="text-xs text-gray-400 ml-6">{booking.showId.theatreId.location}</p>
                                    </div>
                                    <div className="col-span-2 mt-2">
                                        <p className="text-xs uppercase text-gray-400 font-bold mb-1">Seats ({booking.seats.length})</p>
                                        <div className="text-2xl font-black text-netflix-red tracking-wide">
                                            {booking.seats.join(', ')}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-dashed border-gray-300 flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Booking ID</p>
                                    <p className="font-mono font-bold text-lg">{booking._id.substring(0, 8).toUpperCase()}</p>
                                </div>
                                <div className="text-right">
                                    {/* QR Code Placeholder */}
                                    <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center text-white text-[10px]">QR Code</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Side */}
                    <div className="md:w-64 flex flex-col gap-4">
                        <div className="glass-panel p-6 flex-grow flex flex-col justify-center text-center">
                            <p className="text-netflix-gray text-sm mb-2">Total Amount Paid</p>
                            <p className="text-3xl font-black mb-6">₹{booking.totalPrice}</p>

                            <button className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 px-4 py-3 rounded-xl transition-all font-bold text-sm mb-3">
                                <Download className="w-4 h-4" />
                                Download PDF
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl transition-all font-bold text-sm">
                                <Share2 className="w-4 h-4" />
                                Share Ticket
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
                    <Link to="/profile" className="text-netflix-gray hover:text-white transition-colors font-bold flex items-center gap-2">
                        View All Bookings <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to="/" className="btn-primary px-8">
                        Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default BookingConfirmation;
