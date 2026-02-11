const axios = require('axios');

axios.get('http://localhost:5000/api/movies')
    .then(res => {
        const movies = res.data;
        const genresToCheck = ['Horror', 'Comedy', 'Thriller'];
        genresToCheck.forEach(genre => {
            const count = movies.filter(m => m.genre.includes(genre)).length;
            console.log(`Movie count for ${genre}: ${count}`);
        });

        const allGenreTags = [...new Set(movies.flatMap(m => m.genre))];
        console.log('Available genre tags in DB:', allGenreTags);
    })
    .catch(err => {
        console.error('Error:', err.message);
    });
