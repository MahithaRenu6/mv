const express = require('express');
const router = express.Router();
const { getShows, getShowById, createShow, getSeatsByShow, deleteShow } = require('../controllers/showController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getShows);
router.get('/:id', getShowById);
router.post('/', protect, admin, createShow);
router.delete('/:id', protect, admin, deleteShow);
router.get('/:showId/seats', getSeatsByShow);

module.exports = router;
