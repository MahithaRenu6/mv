const Movie = require('../models/Movie');
const axios = require('axios');

exports.getMovies = async (req, res) => {
    try {
        const movies = await Movie.find().sort({ releaseDate: -1 });
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createMovie = async (req, res) => {
    try {
        const movie = await Movie.create(req.body);
        res.status(201).json(movie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteMovie = async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id);
        res.json({ message: 'Movie deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Sync with TMDB
exports.syncWithTMDB = async (req, res) => {
    const API_KEY = process.env.TMDB_API_KEY;
    if (!API_KEY || API_KEY === 'your_tmdb_api_key') {
        return res.status(400).json({ message: 'TMDB API Key missing' });
    }

    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`);
        const movies = response.data.results;

        for (const m of movies) {
            const exists = await Movie.findOne({ tmdbId: m.id });
            if (!exists) {
                await Movie.create({
                    title: m.title,
                    poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
                    description: m.overview,
                    language: m.original_language,
                    genre: ['Action', 'Drama'], // Simplified
                    tmdbId: m.id,
                    releaseDate: m.release_date,
                    rating: m.vote_average
                });
            }
        }
        res.json({ message: 'Sync successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
