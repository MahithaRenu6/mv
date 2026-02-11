const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theatreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    time: { type: String, required: true }, // Format: HH:MM
    basePrice: { type: Number, required: true }
}, { timestamps: true });


module.exports = mongoose.model('Show', showSchema);
