import { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Edit, Film, Calendar, MapPin, Search, RefreshCw, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('stats');
    const [movies, setMovies] = useState([]);
    const [theatres, setTheatres] = useState([]);
    const [cities, setCities] = useState([]);
    const [shows, setShows] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState({ totalBookings: 0, totalRevenue: 0, activeMovies: 0 });
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);

    // Form States
    const [selectedCity, setSelectedCity] = useState('');
    const [newMovie, setNewMovie] = useState({
        title: '',
        genre: '',
        language: '',
        description: '',
        poster: '',
        rating: ''
    });

    const [newShow, setNewShow] = useState({
        movieId: '',
        theatreId: '',
        date: '',
        time: '',
        basePrice: ''
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (activeTab !== 'stats') {
            fetchDataForTab();
        }
    }, [activeTab]);

    useEffect(() => {
        if (selectedCity && activeTab === 'shows') {
            fetchTheatres(selectedCity);
        }
    }, [selectedCity]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [moviesRes, bookingsRes, citiesRes] = await Promise.all([
                api.get('/movies'),
                api.get('/bookings/all-bookings'),
                api.get('/cities')
            ]);
            setMovies(moviesRes.data);
            setBookings(bookingsRes.data);
            setCities(citiesRes.data);
            setStats({
                totalBookings: bookingsRes.data.length,
                totalRevenue: bookingsRes.data.reduce((acc, b) => acc + b.totalPrice, 0),
                activeMovies: moviesRes.data.length
            });
        } catch (error) {
            console.error('Initial fetch failed', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDataForTab = async () => {
        setLoading(true);
        try {
            if (activeTab === 'movies') {
                const { data } = await api.get('/movies');
                setMovies(data);
            } else if (activeTab === 'theatres') {
                const { data } = await api.get('/theatres');
                setTheatres(data);
            } else if (activeTab === 'shows') {
                const { data } = await api.get('/shows');
                setShows(data);
            } else if (activeTab === 'bookings') {
                const { data } = await api.get('/bookings/all-bookings');
                setBookings(data);
            }
        } catch (error) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const fetchTheatres = async (city) => {
        try {
            const { data } = await api.get(`/theatres/${city}`);
            setTheatres(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSyncTMDB = async () => {
        setSyncing(true);
        try {
            await api.post('/movies/sync');
            toast.success('Synced with TMDB successfully!');
            fetchDataForTab();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Sync failed');
        } finally {
            setSyncing(false);
        }
    };

    const handleAddMovie = async (e) => {
        e.preventDefault();
        try {
            const genreArray = newMovie.genre.split(',').map(g => g.trim());
            await api.post('/movies', { ...newMovie, genre: genreArray });
            toast.success('Movie Added!');
            setNewMovie({ title: '', genre: '', language: '', description: '', poster: '', rating: '' });
            fetchDataForTab();
        } catch (error) {
            toast.error('Failed to add movie');
        }
    };

    const handleAddShow = async (e) => {
        e.preventDefault();
        try {
            await api.post('/shows', newShow);
            toast.success('Show Added!');
            setNewShow({ movieId: '', theatreId: '', date: '', time: '', basePrice: '' });
            fetchDataForTab();
        } catch (error) {
            toast.error('Failed to add show');
        }
    };

    const deleteItem = async (type, id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/${type}/${id}`);
            toast.success('Deleted successfully');
            fetchDataForTab();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    if (loading && activeTab === 'stats') return <div className="min-h-screen bg-netflix-dark flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-netflix-red" /></div>;

    return (
        <div className="min-h-screen bg-netflix-dark text-white pt-24 px-6 pb-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black mb-2">Admin Dashboard</h1>
                        <p className="text-netflix-gray">Manage your cinema operations and bookings</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleSyncTMDB}
                            disabled={syncing}
                            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-lg font-bold transition-all border border-white/10"
                        >
                            {syncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                            Sync TMDB
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-xl mb-8 w-fit">
                    {['stats', 'movies', 'theatres', 'shows', 'bookings'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 rounded-lg font-bold transition-all capitalize ${activeTab === tab
                                ? 'bg-netflix-red text-white shadow-lg'
                                : 'text-netflix-gray hover:text-white'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === 'stats' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="glass-panel p-6 border-l-4 border-blue-500">
                            <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">Total Revenue</h3>
                            <p className="text-4xl font-black">₹{stats.totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="glass-panel p-6 border-l-4 border-green-500">
                            <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">Total Bookings</h3>
                            <p className="text-4xl font-black">{stats.totalBookings}</p>
                        </div>
                        <div className="glass-panel p-6 border-l-4 border-purple-500">
                            <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">Active Movies</h3>
                            <p className="text-4xl font-black">{stats.activeMovies}</p>
                        </div>
                    </div>
                )}

                {activeTab === 'movies' && (
                    <div className="space-y-8">
                        <div className="glass-panel p-8">
                            <h2 className="text-2xl font-bold mb-6">Add New Movie</h2>
                            <form onSubmit={handleAddMovie} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input
                                    type="text"
                                    placeholder="Movie Title"
                                    className="bg-netflix-black border border-white/20 rounded p-3 text-white"
                                    value={newMovie.title}
                                    onChange={e => setNewMovie({ ...newMovie, title: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Genre (comma separated)"
                                    className="bg-netflix-black border border-white/20 rounded p-3 text-white"
                                    value={newMovie.genre}
                                    onChange={e => setNewMovie({ ...newMovie, genre: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Language"
                                    className="bg-netflix-black border border-white/20 rounded p-3 text-white"
                                    value={newMovie.language}
                                    onChange={e => setNewMovie({ ...newMovie, language: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Poster URL"
                                    className="bg-netflix-black border border-white/20 rounded p-3 text-white"
                                    value={newMovie.poster}
                                    onChange={e => setNewMovie({ ...newMovie, poster: e.target.value })}
                                    required
                                />
                                <textarea
                                    placeholder="Description"
                                    className="bg-netflix-black border border-white/20 rounded p-3 text-white md:col-span-2"
                                    value={newMovie.description}
                                    onChange={e => setNewMovie({ ...newMovie, description: e.target.value })}
                                    required
                                />
                                <input
                                    type="number"
                                    step="0.1"
                                    placeholder="Rating (0-10)"
                                    className="bg-netflix-black border border-white/20 rounded p-3 text-white"
                                    value={newMovie.rating}
                                    onChange={e => setNewMovie({ ...newMovie, rating: e.target.value })}
                                    required
                                />
                                <button type="submit" className="btn-primary md:col-span-2 py-3 font-bold">Add Movie</button>
                            </form>
                        </div>

                        <div className="glass-panel overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-netflix-gray text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Movie</th>
                                        <th className="px-6 py-4">Genre</th>
                                        <th className="px-6 py-4">Rating</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {movies.map((m) => (
                                        <tr key={m._id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 flex items-center gap-4">
                                                <img src={m.poster} className="w-10 h-14 rounded object-cover" />
                                                <span className="font-bold">{m.title}</span>
                                            </td>
                                            <td className="px-6 py-4 text-netflix-gray">{m.genre.join(', ')}</td>
                                            <td className="px-6 py-4">{m.rating}</td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => deleteItem('movies', m._id)} className="p-2 hover:text-netflix-red transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'shows' && (
                    <div className="space-y-8">
                        <div className="glass-panel p-8">
                            <h2 className="text-2xl font-bold mb-6">Add New Show</h2>
                            <form onSubmit={handleAddShow} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-gray-400 mb-2">Select Movie</label>
                                    <select
                                        className="w-full bg-netflix-black border border-white/20 rounded p-3 text-white"
                                        value={newShow.movieId}
                                        onChange={e => setNewShow({ ...newShow, movieId: e.target.value })}
                                        required
                                    >
                                        <option value="">Choose Movie...</option>
                                        {movies.map(m => (
                                            <option key={m._id} value={m._id}>{m.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Select City</label>
                                    <select
                                        className="w-full bg-netflix-black border border-white/20 rounded p-3 text-white"
                                        value={selectedCity}
                                        onChange={e => setSelectedCity(e.target.value)}
                                        required
                                    >
                                        <option value="">Choose City...</option>
                                        {cities.map(c => (
                                            <option key={c._id} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Select Theatre</label>
                                    <select
                                        className="w-full bg-netflix-black border border-white/20 rounded p-3 text-white"
                                        value={newShow.theatreId}
                                        onChange={e => setNewShow({ ...newShow, theatreId: e.target.value })}
                                        required
                                        disabled={!selectedCity}
                                    >
                                        <option value="">{selectedCity ? 'Choose Theatre...' : 'Select City first'}</option>
                                        {theatres.map(t => (
                                            <option key={t._id} value={t._id}>{t.name} ({t.location})</option>
                                        ))}
                                    </select>
                                </div>

                                <input
                                    type="date"
                                    className="bg-netflix-black border border-white/20 rounded p-3 text-white"
                                    value={newShow.date}
                                    onChange={e => setNewShow({ ...newShow, date: e.target.value })}
                                    required
                                />
                                <input
                                    type="time"
                                    className="bg-netflix-black border border-white/20 rounded p-3 text-white"
                                    value={newShow.time}
                                    onChange={e => setNewShow({ ...newShow, time: e.target.value })}
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Base Price (₹)"
                                    className="bg-netflix-black border border-white/20 rounded p-3 text-white"
                                    value={newShow.basePrice}
                                    onChange={e => setNewShow({ ...newShow, basePrice: e.target.value })}
                                    required
                                />

                                <button type="submit" className="btn-primary md:col-span-2 py-3 font-bold">Create Show</button>
                            </form>
                        </div>

                        <div className="glass-panel overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-netflix-gray text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Movie</th>
                                        <th className="px-6 py-4">Location</th>
                                        <th className="px-6 py-4">Time</th>
                                        <th className="px-6 py-4">Price</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {shows.map((s) => (
                                        <tr key={s._id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-bold">{s.movieId?.title}</td>
                                            <td className="px-6 py-4 text-netflix-gray">
                                                <div>{s.theatreId?.name}</div>
                                                <div className="text-xs">{s.theatreId?.city}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>{s.date}</div>
                                                <div className="text-netflix-red font-bold text-xs">{s.time}</div>
                                            </td>
                                            <td className="px-6 py-4">₹{s.basePrice}</td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => deleteItem('shows', s._id)} className="p-2 hover:text-netflix-red transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'bookings' && (
                    <div className="glass-panel overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-netflix-gray text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Movie</th>
                                    <th className="px-6 py-4">Seats</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {bookings.map((b) => (
                                    <tr key={b._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold">{b.userId?.name}</div>
                                            <div className="text-xs text-netflix-gray">{b.userId?.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold">{b.showId?.movieId?.title}</div>
                                            <div className="text-xs text-netflix-gray">{b.showId?.theatreId?.name}, {b.showId?.theatreId?.city}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-netflix-red font-bold">{b.seats.join(', ')}</div>
                                        </td>
                                        <td className="px-6 py-4 font-bold">₹{b.totalPrice}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${b.status === 'cancelled' ? 'bg-gray-500/20 text-gray-400' : 'bg-green-500/20 text-green-500'}`}>
                                                {b.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'theatres' && (
                    <div className="glass-panel overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-netflix-gray text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">City</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {theatres.map((t) => (
                                    <tr key={t._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-bold">{t.name}</td>
                                        <td className="px-6 py-4 text-netflix-gray">{t.location}</td>
                                        <td className="px-6 py-4">{t.city}</td>
                                        <td className="px-6 py-4"><span className="px-2 py-1 bg-white/10 rounded text-xs">{t.type}</span></td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => deleteItem('theatres', t._id)} className="p-2 hover:text-netflix-red transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
