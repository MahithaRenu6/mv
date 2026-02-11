const Theatre = require('../models/Theatre');

exports.getTheatresByCity = async (req, res) => {
    try {
        const { city } = req.params;
        const theatres = await Theatre.find({ city });
        res.status(200).json(theatres);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.getAllTheatres = async (req, res) => {
    try {
        const theatres = await Theatre.find({});
        res.status(200).json(theatres);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
