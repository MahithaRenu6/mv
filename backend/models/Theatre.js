const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },
    type: { type: String, enum: ['Small', 'Medium', 'Large'], default: 'Medium' }
}, { timestamps: true });

module.exports = mongoose.model('Theatre', theatreSchema);
