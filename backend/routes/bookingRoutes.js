const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getUserBookings, getAllBookings, getBookingById, cancelBooking } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/create-order', protect, createOrder);
router.post('/verify-payment', protect, verifyPayment);
router.get('/my-bookings', protect, getUserBookings);
router.get('/all-bookings', protect, admin, getAllBookings);
router.put('/:id/cancel', protect, cancelBooking);
router.get('/:id', protect, getBookingById);

module.exports = router;
