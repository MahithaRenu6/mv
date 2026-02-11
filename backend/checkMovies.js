const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');

dotenv.config();

const checkMovies = async () => {
    try {
        const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/movietickets';
        await mongoose.connect(URI);

        const movies = await Movie.find({});
        console.log(`\n📊 Total movies in database: ${movies.length}\n`);

        movies.forEach((movie, index) => {
            console.log(`${index + 1}. ${movie.title} (${movie.language}) - Rating: ${movie.rating}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkMovies();
