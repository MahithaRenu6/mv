const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const Seat = require('../models/Seat');

exports.getShows = async (req, res) => {
    try {
        const { movieId, date, city } = req.query;
        let query = {};

        if (movieId) query.movieId = movieId;
        if (date) query.date = date;

        if (city) {
            const theatres = await Theatre.find({ city: { $regex: new RegExp(`^${city.trim()}$`, 'i') } });
            const theatreIds = theatres.map(t => t._id);
            query.theatreId = { $in: theatreIds };
        }

        const shows = await Show.find(query)
            .populate('theatreId')
            .populate('movieId')
            .sort({ time: 1 }); // Sort by time

        res.json(shows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getShowById = async (req, res) => {
    try {
        const show = await Show.findById(req.params.id).populate('theatreId').populate('movieId');
        if (!show) return res.status(404).json({ message: 'Show not found' });
        res.json(show);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createShow = async (req, res) => {
    try {
        const show = await Show.create(req.body);
        // Initialize seats (e.g., A1-A10, B1-B10... J1-J10)
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        const seats = [];
        for (const row of rows) {
            for (let i = 1; i <= 10; i++) {
                seats.push({
                    showId: show._id,
                    seatNumber: `${row}${i}`,
                    isBooked: false
                });
            }
        }
        await Seat.insertMany(seats);
        res.status(201).json(show);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSeatsByShow = async (req, res) => {
    try {
        const seats = await Seat.find({ showId: req.params.showId });
        res.json(seats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteShow = async (req, res) => {
    try {
        const show = await Show.findById(req.params.id);
        if (!show) {
            return res.status(404).json({ message: 'Show not found' });
        }

        // Remove associated seats first
        await Seat.deleteMany({ showId: show._id });

        // Remove the show using findByIdAndDelete or similar if available, or just remove() on document if mongoose version supports it, but standard is model.deleteOne/findByIdAndDelete
        await Show.findByIdAndDelete(req.params.id);

        res.json({ message: 'Show removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

