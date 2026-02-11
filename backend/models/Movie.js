const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    poster: { type: String, required: true },
    description: { type: String, required: true },
    language: { type: String, required: true },
    genre: { type: [String], required: true },
    tmdbId: { type: Number }, // For syncing with TMDB
    releaseDate: { type: Date },
    duration: { type: Number }, // in minutes
    rating: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
