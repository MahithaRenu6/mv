const mongoose = require('mongoose');
const dotenv = require('dotenv');
const City = require('./models/City');
const Theatre = require('./models/Theatre');
const Movie = require('./models/Movie');
const Show = require('./models/Show');
const Seat = require('./models/Seat');

dotenv.config();

const CITIES = [
    'Hyderabad', 'Bangalore', 'Chennai', 'Mumbai', 'Delhi', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Kochi', 'Vizag', 'Vijayawada', 'Guntur'
];

const THEATRE_NAMES = ['PVR Cinemas', 'INOX', 'Cinepolis'];

const SEAT_LAYOUTS = {
    Small: { rows: 6, cols: 8, rowLabels: ['A', 'B', 'C', 'D', 'E', 'F'] }, // 48 seats
    Medium: { rows: 8, cols: 10, rowLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] }, // 80 seats
    Large: { rows: 10, cols: 12, rowLabels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'] } // 120 seats
};

const CATEGORIES = {
    Silver: 150,
    Gold: 200,
    Platinum: 250
};

// Helper: Determine category based on row index
const getCategory = (rowIndex, totalRows) => {
    if (rowIndex < 2) return 'Silver';
    if (rowIndex < totalRows - 2) return 'Gold';
    return 'Platinum';
};

const seedDatabase = async () => {
    try {
        const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/movietickets';
        console.log('Connecting to MongoDB at:', URI);
        await mongoose.connect(URI);
        console.log('Connected to MongoDB');

        // Clear existing data (except Movies and Users)
        await City.deleteMany({});
        await Theatre.deleteMany({});
        await Show.deleteMany({});
        await Seat.deleteMany({});
        console.log('Cleared existing Cities, Theatres, Shows, Seats');

        // 1. Seed Cities
        const createdCities = await City.insertMany(CITIES.map(name => ({ name })));
        console.log(`Seeded ${createdCities.length} cities`);

        // 2. Seed Theatres
        const theatresToCreate = [];
        for (const city of createdCities) {
            for (const tName of THEATRE_NAMES) {
                // Randomly assign a type
                const types = ['Small', 'Medium', 'Large'];
                const randType = types[Math.floor(Math.random() * types.length)];

                theatresToCreate.push({
                    name: tName,
                    city: city.name,
                    location: `${city.name} Center`,
                    type: randType
                });
            }
        }
        const createdTheatres = await Theatre.insertMany(theatresToCreate);
        console.log(`Seeded ${createdTheatres.length} theatres`);

        // 3. Seed Shows (Need Movies first)
        const movies = await Movie.find({});
        if (movies.length === 0) {
            console.log('No movies found. Please sync movies first or manually add some.');
            process.exit(0);
        }

        const showsToCreate = [];
        const today = new Date();

        // Create shows for the next 20 days (matching the date picker range)
        // Create shows ensuring FULL COVERAGE: Every movie, every city, every day
        for (let i = 0; i < 20; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            // Format to YYYY-MM-DD using local time
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;

            for (const city of createdCities) {
                // Get theatres in this specific city
                const cityTheatres = createdTheatres.filter(t => t.city === city.name);
                if (cityTheatres.length === 0) continue;

                for (const movie of movies) {
                    // Schedule 1-2 shows for THIS movie in THIS city on THIS day
                    // This guarantees availability
                    const numShows = 1 + Math.floor(Math.random() * 2); // 1 or 2 shows
                    const times = ['10:00', '13:00', '16:00', '19:00', '22:00'];

                    for (let k = 0; k < numShows; k++) {
                        const randomTheatre = cityTheatres[Math.floor(Math.random() * cityTheatres.length)];
                        // Pick a random time not strictly checking for collisions for this simple demo
                        const randomTime = times[Math.floor(Math.random() * times.length)];

                        showsToCreate.push({
                            movieId: movie._id,
                            theatreId: randomTheatre._id,
                            date: dateString,
                            time: randomTime,
                            basePrice: [150, 200, 250][Math.floor(Math.random() * 3)]
                        });
                    }
                }
            }
        }

        const createdShows = await Show.insertMany(showsToCreate);
        console.log(`Seeded ${createdShows.length} shows`);

        // 4. Generate Seats for Each Show
        console.log('Generating seats... This might take a moment.');
        const allSeats = [];

        // We can't insertMany all at once if it's huge, so do it in chunks or per show
        // optimize by fetching theatre details once
        const theatreMap = new Map();
        createdTheatres.forEach(t => theatreMap.set(t._id.toString(), t.type));

        for (const show of createdShows) {
            const type = theatreMap.get(show.theatreId.toString());
            const layout = SEAT_LAYOUTS[type];

            layout.rowLabels.forEach((rowLabel, rIndex) => {
                const category = getCategory(rIndex, layout.rows);
                const price = CATEGORIES[category];

                for (let c = 1; c <= layout.cols; c++) {
                    allSeats.push({
                        showId: show._id,
                        seatNumber: `${rowLabel}${c}`,
                        category,
                        price,
                        isBooked: false
                    });
                }
            });
        }

        // Insert in chunks to avoid memory issues
        const chunkSize = 1000;
        for (let i = 0; i < allSeats.length; i += chunkSize) {
            await Seat.insertMany(allSeats.slice(i, i + chunkSize));
            console.log(`Inserted seats batch ${i} to ${i + chunkSize}`);
        }

        console.log('Seeding Complete!');
        process.exit();

    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();
