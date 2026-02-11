const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    showId: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
    seatNumber: { type: String, required: true },
    category: { type: String, enum: ['Silver', 'Gold', 'Platinum'], required: true },
    price: { type: Number, required: true },
    isBooked: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // User who booked it
}, { timestamps: true });

// Ensure unique seat per show
seatSchema.index({ showId: 1, seatNumber: 1 }, { unique: true });

module.exports = mongoose.model('Seat', seatSchema);
