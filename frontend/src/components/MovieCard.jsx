import { Link } from 'react-router-dom';
import { Star, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const MovieCard = ({ movie }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-netflix-black rounded-xl overflow-hidden shadow-lg transition-all duration-500 movie-card-hover"
        >
            <Link to={`/movie/${movie._id}`}>
                <div className="aspect-[2/3] relative overflow-hidden">
                    <img
                        src={movie.poster}
                        alt={movie.title}
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop';
                        }}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-netflix-dark via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-12 h-12 bg-netflix-red rounded-full flex items-center justify-center shadow-xl shadow-netflix-red/40 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <Play className="fill-white w-6 h-6 ml-1" />
                        </div>
                    </div>
                </div>

                <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-netflix-red font-bold uppercase tracking-wider">{movie.language}</span>
                        <div className="flex items-center gap-1 text-xs text-yellow-500">
                            <Star className="w-3 h-3 fill-yellow-500" />
                            <span>{movie.rating || 'N/A'}</span>
                        </div>
                    </div>
                    <h3 className="font-bold text-lg line-clamp-1 group-hover:text-netflix-red transition-colors">{movie.title}</h3>
                    <p className="text-netflix-gray text-sm line-clamp-1">{movie.genre.join(', ')}</p>
                </div>
            </Link>
        </motion.div>
    );
};

export default MovieCard;
