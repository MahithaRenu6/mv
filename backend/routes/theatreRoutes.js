const express = require('express');
const router = express.Router();
const { getTheatresByCity, getAllTheatres } = require('../controllers/theatreController');

router.get('/', getAllTheatres);
router.get('/:city', getTheatresByCity);

module.exports = router;
