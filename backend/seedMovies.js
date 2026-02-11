const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');

dotenv.config();

const MOVIES = [
    {
        title: 'Spider-Man: No Way Home',
        poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
        description: 'Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero.',
        language: 'English',
        genre: ['Action', 'Adventure', 'Sci-Fi'],
        releaseDate: new Date('2021-12-15'),
        duration: 148,
        rating: 8.2
    },
    {
        title: 'Dune',
        poster: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
        description: 'Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe.',
        language: 'English',
        genre: ['Sci-Fi', 'Adventure'],
        releaseDate: new Date('2021-09-15'),
        duration: 155,
        rating: 8.5
    },
    {
        title: 'The Matrix',
        poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
        description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        language: 'English',
        genre: ['Action', 'Sci-Fi'],
        releaseDate: new Date('1999-03-31'),
        duration: 136,
        rating: 8.7
    },
    {
        title: 'Joker',
        poster: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
        description: 'In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society.',
        language: 'English',
        genre: ['Crime', 'Drama', 'Thriller'],
        releaseDate: new Date('2019-10-04'),
        duration: 122,
        rating: 8.4
    },
    {
        title: 'The Conjuring',
        poster: 'https://image.tmdb.org/t/p/w500/wVYREutTvI2tmxr6ujrHT704wGF.jpg',
        description: 'Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.',
        language: 'English',
        genre: ['Horror', 'Thriller'],
        releaseDate: new Date('2013-07-19'),
        duration: 112,
        rating: 7.5
    },
    {
        title: 'The Hangover',
        poster: 'https://image.tmdb.org/t/p/w500/uluhlXhjRNkYLeLkHJbR0Dc7yyD.jpg',
        description: 'Three buddies wake up from a bachelor party in Las Vegas, with no memory of the previous night and the bachelor missing.',
        language: 'English',
        genre: ['Comedy'],
        releaseDate: new Date('2009-06-05'),
        duration: 100,
        rating: 7.7
    },
    {
        title: 'The Departed',
        poster: 'https://image.tmdb.org/t/p/w500/nT97ifVT2J1yMQmeq20Qblg61T.jpg',
        description: 'An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.',
        language: 'English',
        genre: ['Crime', 'Thriller', 'Drama'],
        releaseDate: new Date('2006-10-06'),
        duration: 151,
        rating: 8.5
    },
    {
        title: 'Inception',
        poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.',
        language: 'English',
        genre: ['Action', 'Sci-Fi', 'Thriller'],
        releaseDate: new Date('2010-07-16'),
        duration: 148,
        rating: 8.8
    },
    {
        title: 'Interstellar',
        poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        language: 'English',
        genre: ['Sci-Fi', 'Drama', 'Adventure'],
        releaseDate: new Date('2014-11-07'),
        duration: 169,
        rating: 8.6
    },
    {
        title: 'The Dark Knight',
        poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest tests.',
        language: 'English',
        genre: ['Action', 'Crime', 'Drama'],
        releaseDate: new Date('2008-07-18'),
        duration: 152,
        rating: 9.0
    },
    {
        title: 'Avengers: Endgame',
        poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
        description: 'After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos\' actions.',
        language: 'English',
        genre: ['Action', 'Adventure', 'Sci-Fi'],
        releaseDate: new Date('2019-04-26'),
        duration: 181,
        rating: 8.4
    },
    {
        title: 'Parasite',
        poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
        description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
        language: 'Korean',
        genre: ['Drama', 'Thriller'],
        releaseDate: new Date('2019-05-30'),
        duration: 132,
        rating: 8.6
    },
    {
        title: 'The Shawshank Redemption',
        poster: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        language: 'English',
        genre: ['Drama'],
        releaseDate: new Date('1994-09-23'),
        duration: 142,
        rating: 9.3
    },
    {
        title: 'Pulp Fiction',
        poster: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
        description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
        language: 'English',
        genre: ['Crime', 'Drama'],
        releaseDate: new Date('1994-10-14'),
        duration: 154,
        rating: 8.9
    },
    {
        title: 'Forrest Gump',
        poster: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
        description: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.',
        language: 'English',
        genre: ['Drama', 'Romance'],
        releaseDate: new Date('1994-07-06'),
        duration: 142,
        rating: 8.8
    },
    {
        title: 'The Godfather',
        poster: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
        description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        language: 'English',
        genre: ['Crime', 'Drama'],
        releaseDate: new Date('1972-03-24'),
        duration: 175,
        rating: 9.2
    },
    {
        title: 'Fight Club',
        poster: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
        description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club.',
        language: 'English',
        genre: ['Drama'],
        releaseDate: new Date('1999-10-15'),
        duration: 139,
        rating: 8.8
    },
    {
        title: 'Gladiator',
        poster: 'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
        description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family.',
        language: 'English',
        genre: ['Action', 'Drama', 'Adventure'],
        releaseDate: new Date('2000-05-05'),
        duration: 155,
        rating: 8.5
    },
    {
        title: 'The Lion King',
        poster: 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg',
        description: 'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.',
        language: 'English',
        genre: ['Animation', 'Adventure', 'Drama'],
        releaseDate: new Date('1994-06-24'),
        duration: 88,
        rating: 8.5
    },
    {
        title: 'Titanic',
        poster: 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg',
        description: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
        language: 'English',
        genre: ['Drama', 'Romance'],
        releaseDate: new Date('1997-12-19'),
        duration: 194,
        rating: 7.9
    },
    {
        title: 'Avatar',
        poster: 'https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg',
        description: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world.',
        language: 'English',
        genre: ['Action', 'Adventure', 'Sci-Fi'],
        releaseDate: new Date('2009-12-18'),
        duration: 162,
        rating: 7.8
    },
    {
        title: 'The Prestige',
        poster: 'https://image.tmdb.org/t/p/w500/tRNlZbgNCNOpLpbPEz5L8G8A0JN.jpg',
        description: 'After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion while sacrificing everything.',
        language: 'English',
        genre: ['Drama', 'Mystery', 'Thriller'],
        releaseDate: new Date('2006-10-20'),
        duration: 130,
        rating: 8.5
    },
    {
        title: 'Shutter Island',
        poster: 'https://image.tmdb.org/t/p/w500/4GDy0PHYX3VRXUtwK5ysFbg3kEx.jpg',
        description: 'In 1954, a U.S. Marshal investigates the disappearance of a murderer who escaped from a hospital for the criminally insane.',
        language: 'English',
        genre: ['Mystery', 'Thriller'],
        releaseDate: new Date('2010-02-19'),
        duration: 138,
        rating: 8.2
    },
    {
        title: 'The Social Network',
        poster: 'https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg',
        description: 'As Harvard student Mark Zuckerberg creates the social networking site that would become known as Facebook.',
        language: 'English',
        genre: ['Drama'],
        releaseDate: new Date('2010-10-01'),
        duration: 120,
        rating: 7.7
    },
    {
        title: 'Whiplash',
        poster: 'https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg',
        description: 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor.',
        language: 'English',
        genre: ['Drama'],
        releaseDate: new Date('2014-10-10'),
        duration: 106,
        rating: 8.5
    },
    {
        title: 'The Grand Budapest Hotel',
        poster: 'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg',
        description: 'A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy.',
        language: 'English',
        genre: ['Comedy', 'Drama'],
        releaseDate: new Date('2014-03-28'),
        duration: 99,
        rating: 8.1
    },
    {
        title: 'La La Land',
        poster: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg',
        description: 'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations.',
        language: 'English',
        genre: ['Drama', 'Romance'],
        releaseDate: new Date('2016-12-09'),
        duration: 128,
        rating: 8.0
    },
    {
        title: 'Mad Max: Fury Road',
        poster: 'https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg',
        description: 'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland.',
        language: 'English',
        genre: ['Action', 'Adventure', 'Sci-Fi'],
        releaseDate: new Date('2015-05-15'),
        duration: 120,
        rating: 8.1
    },
    {
        title: 'Blade Runner 2049',
        poster: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
        description: 'A young blade runner\'s discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.',
        language: 'English',
        genre: ['Sci-Fi', 'Thriller'],
        releaseDate: new Date('2017-10-06'),
        duration: 164,
        rating: 8.0
    },
    {
        title: 'Get Out',
        poster: 'https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg',
        description: 'A young African-American visits his white girlfriend\'s parents for the weekend, where his simmering uneasiness becomes real.',
        language: 'English',
        genre: ['Horror', 'Thriller'],
        releaseDate: new Date('2017-02-24'),
        duration: 104,
        rating: 7.7
    },
    {
        title: 'A Quiet Place',
        poster: 'https://image.tmdb.org/t/p/w500/nAU74GmpUk7t5iklEp3bufwDq4n.jpg',
        description: 'In a post-apocalyptic world, a family is forced to live in silence while hiding from monsters with ultra-sensitive hearing.',
        language: 'English',
        genre: ['Horror', 'Thriller'],
        releaseDate: new Date('2018-04-06'),
        duration: 90,
        rating: 7.5
    }
];

const seedMovies = async () => {
    try {
        const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/movietickets';
        console.log('Connecting to MongoDB at:', URI);
        await mongoose.connect(URI);
        console.log('Connected to MongoDB');

        // Clear existing movies
        await Movie.deleteMany({});
        console.log('Cleared existing movies');

        // Insert new movies
        const createdMovies = await Movie.insertMany(MOVIES);
        console.log(`✅ Successfully seeded ${createdMovies.length} movies!`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedMovies();
