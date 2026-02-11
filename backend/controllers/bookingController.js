const Booking = require('../models/Booking');
const Seat = require('../models/Seat');
const Show = require('../models/Show');

exports.createOrder = async (req, res) => {
    const { amount } = req.body;
    try {
        // Return dummy order ID for simulation
        res.json({
            id: `order_dummy_${Date.now()}`,
            amount: amount * 100,
            currency: "INR"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, bookingData } = req.body;
    const { userId, showId, seats, totalPrice } = bookingData;

    // SIMULATED PAYMENT: Skip signature verification and directly create booking
    try {
        const booking = await Booking.create({
            userId: req.user._id, // Ensure user from token
            showId,
            seats,
            totalPrice,
            paymentStatus: 'completed',
            paymentId: razorpay_payment_id || `pay_dummy_${Date.now()}`,
            orderId: razorpay_order_id,
            status: 'confirmed'
        });

        // Update seats as booked
        await Seat.updateMany(
            { showId, seatNumber: { $in: seats } },
            { $set: { isBooked: true, userId: req.user._id } }
        );

        res.json({ message: "Booking successful", booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Booking already cancelled' });
        }

        booking.status = 'cancelled';
        await booking.save();

        // Release seats
        await Seat.updateMany(
            { showId: booking.showId, seatNumber: { $in: booking.seats } },
            { $set: { isBooked: false, userId: null } }
        );

        res.json({ message: 'Booking cancelled successfully. Refund initiated.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        console.log('Fetching bookings for user:', req.user._id);

        const bookings = await Booking.find({ userId: req.user._id })
            .populate({
                path: 'showId',
                populate: [
                    { path: 'movieId' },
                    { path: 'theatreId' }
                ]
            })
            .sort({ createdAt: -1 });

        console.log('Found bookings:', bookings.length);

        // Filter out bookings with missing show data
        const validBookings = bookings.filter(b => b.showId && b.showId.movieId && b.showId.theatreId);

        if (validBookings.length !== bookings.length) {
            console.warn(`Filtered out ${bookings.length - validBookings.length} bookings with missing data`);
        }

        res.json(validBookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: error.message });
    }
};


exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('userId', 'name email')
            .populate({
                path: 'showId',
                populate: [{ path: 'movieId' }, { path: 'theatreId' }]
            })
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('userId', 'name email')
            .populate({
                path: 'showId',
                populate: [{ path: 'movieId' }, { path: 'theatreId' }]
            });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Verify ownership or admin
        if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this booking' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

