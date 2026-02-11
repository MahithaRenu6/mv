import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { Trash2, Smartphone, CreditCard, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const socket = io('https://movieticketbooking-h5u5.onrender.com');

const SeatSelection = () => {
    const { showId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [show, setShow] = useState(null);
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [lockedSeats, setLockedSeats] = useState({}); // { seatNumber: userId }
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [dummyOrder, setDummyOrder] = useState(null);

    useEffect(() => {
        fetchShowAndSeats();

        socket.emit('join_show', showId);

        socket.on('seat_locked', (data) => {
            if (data.showId === showId) {
                setLockedSeats(prev => ({ ...prev, [data.seatNumber]: data.userId }));
            }
        });

        socket.on('seat_unlocked', (data) => {
            if (data.showId === showId) {
                setLockedSeats(prev => {
                    const newState = { ...prev };
                    delete newState[data.seatNumber];
                    return newState;
                });
            }
        });

        return () => {
            socket.off('seat_locked');
            socket.off('seat_unlocked');
        };
    }, [showId]);

    const fetchShowAndSeats = async () => {
        try {
            const showRes = await api.get(`/shows/${showId}`);
            setShow(showRes.data);
            const seatsRes = await api.get(`/shows/${showId}/seats`);
            setSeats(seatsRes.data);
        } catch (error) {
            toast.error('Failed to load seats');
        } finally {
            setLoading(false);
        }
    };

    const handleSeatClick = (seat) => {
        if (seat.isBooked) return;
        if (lockedSeats[seat.seatNumber] && lockedSeats[seat.seatNumber] !== user._id) {
            toast.error('This seat is being selected by another user');
            return;
        }

        const isSelected = selectedSeats.find(s => s.seatNumber === seat.seatNumber);

        if (isSelected) {
            setSelectedSeats(prev => prev.filter(s => s.seatNumber !== seat.seatNumber));
            socket.emit('unlock_seat', { showId, seatNumber: seat.seatNumber, userId: user._id });
        } else {
            if (selectedSeats.length >= 10) {
                toast.error('Max 10 seats allowed');
                return;
            }
            setSelectedSeats(prev => [...prev, seat]);
            socket.emit('lock_seat', { showId, seatNumber: seat.seatNumber, userId: user._id });
        }
    };

    const calculateTotal = () => {
        return selectedSeats.reduce((total, seat) => total + seat.price, 0);
    };

    const handleCheckout = async () => {
        if (selectedSeats.length === 0) return toast.error('Select at least one seat');
        setProcessing(true);

        try {
            // 1. Create Simulated Order
            const { data: order } = await api.post('/bookings/create-order', {
                amount: calculateTotal()
            });
            setDummyOrder(order);
            setShowPaymentModal(true);
        } catch (error) {
            toast.error('Could not initiate checkout');
        } finally {
            setProcessing(false);
        }
    };

    const handleDummyPayment = async () => {
        setProcessing(true);
        try {
            const verifyData = {
                razorpay_order_id: dummyOrder.id,
                razorpay_payment_id: `pay_dummy_${Date.now()}`,
                bookingData: {
                    userId: user._id,
                    showId,
                    seats: selectedSeats.map(s => s.seatNumber),
                    totalPrice: calculateTotal()
                }
            };
            const { data } = await api.post('/bookings/verify-payment', verifyData);
            toast.success('Payment successful! Redirecting...');
            setShowPaymentModal(false);
            navigate(`/confirmation/${data.booking._id}`);
        } catch (err) {
            toast.error('Payment processing failed');
        } finally {
            setProcessing(false);
        }
    };

    if (loading || !show) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-12 flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3">
                <div className="mb-12 text-center">
                    <h1 className="text-3xl font-black mb-2">{show.movieId.title}</h1>
                    <p className="text-netflix-gray">{show.theatreId.name} • {show.date} • {show.time}</p>
                </div>

                {/* Screen */}
                <div className="relative mb-20">
                    <div className="h-2 bg-gradient-to-t from-netflix-red to-transparent rounded-[50%] opacity-50 shadow-[0_-10px_20px_5px_rgba(229,9,20,0.3)]" />
                    <p className="text-center text-xs text-netflix-gray mt-4 tracking-[1em] uppercase">Movie Screen this way</p>
                </div>

                {/* Seat Legend */}
                <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm text-netflix-gray">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-t-lg bg-gray-400" />
                        <span>Silver (₹150)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-t-lg bg-yellow-500" />
                        <span>Gold (₹200)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-t-lg bg-purple-500" />
                        <span>Platinum (₹250)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-t-lg bg-netflix-gray/20" />
                        <span>Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-t-lg bg-netflix-red shadow-lg shadow-netflix-red/30" />
                        <span>Selected</span>
                    </div>
                </div>


                {/* Seat Grid */}
                <div className="max-w-3xl mx-auto flex flex-col gap-3 items-center">
                    {/* Organize seats by row */}
                    {Object.entries(
                        seats.reduce((acc, seat) => {
                            const row = seat.seatNumber.match(/[A-Z]+/)[0];
                            if (!acc[row]) acc[row] = [];
                            acc[row].push(seat);
                            return acc;
                        }, {})
                    ).sort((a, b) => a[0].localeCompare(b[0])).map(([row, rowSeats]) => (
                        <div key={row} className="flex items-center gap-4">
                            <div className="w-8 text-right text-gray-500 font-bold">{row}</div>
                            <div className="flex gap-2">
                                {rowSeats.sort((a, b) => parseInt(a.seatNumber.match(/\d+/)[0]) - parseInt(b.seatNumber.match(/\d+/)[0])).map((seat) => {
                                    const isSelected = selectedSeats.find(s => s.seatNumber === seat.seatNumber);
                                    const isLocked = lockedSeats[seat.seatNumber] && lockedSeats[seat.seatNumber] !== user._id;
                                    const isBooked = seat.isBooked;

                                    let categoryColor = 'bg-gray-400'; // Silver
                                    if (seat.category === 'Gold') categoryColor = 'bg-yellow-500';
                                    if (seat.category === 'Platinum') categoryColor = 'bg-purple-500';

                                    return (
                                        <button
                                            key={seat._id}
                                            disabled={isBooked || isLocked}
                                            onClick={() => handleSeatClick(seat)}
                                            className={`
                                                w-8 h-8 rounded-t-lg text-[9px] font-bold transition-all duration-200 flex items-center justify-center
                                                ${isBooked ? 'bg-netflix-gray/20 text-netflix-gray/40 cursor-not-allowed' : ''}
                                                ${isLocked ? 'bg-yellow-600/50 cursor-not-allowed animate-pulse' : ''}
                                                ${isSelected
                                                    ? 'bg-netflix-red text-white scale-110 shadow-lg shadow-netflix-red/40 z-10'
                                                    : (!isBooked && !isLocked ? `${categoryColor} text-black hover:brightness-110` : '')}
                                            `}
                                            title={`${seat.category} - ₹${seat.price}`}
                                        >
                                            {seat.seatNumber.match(/\d+/)[0]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Booking Summary Card */}
            <div className="lg:w-1/3">
                <div className="glass-panel p-8 sticky top-24">
                    <h2 className="text-2xl font-bold mb-6">Booking Summary</h2>

                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-netflix-gray text-xs uppercase tracking-wider mb-1">Movie</p>
                                <p className="font-bold">{show.movieId.title}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-netflix-gray text-xs uppercase tracking-wider mb-1">Seats</p>
                                <p className="font-bold text-sm max-w-[150px] leading-tight text-right ml-auto">
                                    {selectedSeats.length > 0 ? selectedSeats.map(s => s.seatNumber).join(', ') : 'None'}
                                </p>
                            </div>
                        </div>

                        <div className="h-[1px] bg-white/10" />

                        <div className="space-y-3">
                            <div className="flex justify-between text-netflix-gray">
                                <span>Ticket Price</span>
                                <span>₹{calculateTotal()}</span>
                            </div>
                            <div className="flex justify-between text-netflix-gray">
                                <span>Convenience Fee</span>
                                <span>₹{selectedSeats.length > 0 ? '35' : '0'}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold pt-4 border-t border-white/10">
                                <span>Total Payable</span>
                                <span className="text-netflix-red">₹{calculateTotal() + (selectedSeats.length > 0 ? 35 : 0)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={selectedSeats.length === 0 || processing}
                            className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg mt-6"
                        >
                            {processing ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                <>
                                    <CreditCard className="w-5 h-5" />
                                    Proceed to Payment
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Simulated Razorpay Modal */}
            <AnimatePresence>
                {showPaymentModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPaymentModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-[400px] bg-white rounded-lg overflow-hidden shadow-2xl"
                        >
                            {/* Razorpay Header Style */}
                            <div className="bg-[#2B3440] p-6 text-white flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-netflix-red rounded-lg flex items-center justify-center font-black text-xl">M</div>
                                    <div>
                                        <h3 className="font-bold leading-none">MOV TICKET</h3>
                                        <p className="text-[10px] opacity-70 mt-1 uppercase tracking-wider">{show.movieId.title}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] opacity-70 uppercase tracking-wider">Amount</div>
                                    <div className="font-bold italic">₹{calculateTotal() + (selectedSeats.length > 0 ? 35 : 0)}</div>
                                </div>
                            </div>

                            {/* Payment Options (Dummy) */}
                            <div className="p-6 bg-[#F8FAFC]">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Cards, UPI & More</p>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-4 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                                        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded flex items-center justify-center">
                                            <CreditCard className="w-5 h-5" />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="text-sm font-bold text-slate-700">Card</p>
                                            <p className="text-[10px] text-slate-400">Visa, Mastercard, RuPay & More</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-3 bg-white border border-slate-200 rounded-lg opacity-50">
                                        <div className="w-10 h-10 bg-green-50 text-green-500 rounded flex items-center justify-center font-bold text-xs">UPI</div>
                                        <div className="flex-grow">
                                            <p className="text-sm font-bold text-slate-700">UPI</p>
                                            <p className="text-[10px] text-slate-400">Google Pay, PhonePe, Paytm</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <div className="bg-blue-50 text-[10px] text-blue-600 p-2 rounded text-center mb-4">
                                        This is a <strong>simulated</strong> payment flow for demo purposes.
                                    </div>
                                    <button
                                        onClick={handleDummyPayment}
                                        disabled={processing}
                                        className="w-full bg-[#1A6FF6] hover:bg-[#1559C7] text-white font-bold py-4 rounded transition-all flex items-center justify-center gap-2"
                                    >
                                        {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : "PAY NOW"}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-[#EEF2F6] p-2 text-center text-[9px] text-slate-400 font-bold tracking-widest uppercase">
                                Trusted by 5,000,000+ businesses
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SeatSelection;
