import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import MovieCard from '../components/MovieCard';
import { Search } from 'lucide-react';

const Movies = () => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    useEffect(() => {
        const query = searchParams.get('search');
        if (query !== null) {
            setSearchTerm(query);
        }
    }, [searchParams]);
    const [selectedGenre, setSelectedGenre] = useState('All');

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const { data } = await api.get('/movies');
            setMovies(data);
            setFilteredMovies(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const results = movies.filter(movie =>
            movie.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedGenre === 'All' || movie.genre.includes(selectedGenre))
        );
        setFilteredMovies(results);
    }, [searchTerm, selectedGenre, movies]);

    const genres = ['All', 'Action', 'Drama', 'Sci-Fi', 'Horror', 'Comedy', 'Thriller'];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-netflix-dark">
            <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-netflix-dark pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* Search & Filters Header */}
                <div className="glass-panel p-6 mb-12 shadow-2xl relative">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                        {/* Search Bar - Left */}
                        <div className="relative w-full md:w-1/3">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-netflix-gray w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field pl-12 w-full"
                            />
                        </div>

                        {/* Genre Filters - Right */}
                        <div className="flex items-center gap-4 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar justify-start md:justify-end">
                            {genres.map(genre => (
                                <button
                                    key={genre}
                                    onClick={() => setSelectedGenre(genre)}
                                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${selectedGenre === genre
                                        ? 'bg-netflix-red text-white'
                                        : 'bg-white/5 text-netflix-gray hover:bg-white/10'
                                        }`}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Movies Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {filteredMovies.map((movie) => (
                        <MovieCard key={movie._id} movie={movie} />
                    ))}
                </div>

                {filteredMovies.length === 0 && (
                    <div className="text-center py-20">
                        <h3 className="text-2xl text-netflix-gray">No movies found...</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Movies;
