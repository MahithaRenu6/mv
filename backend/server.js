const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://cosmic-sunshine-023a9b.netlify.app/",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Socket.io for Real-time Seat Locking
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_show', (showId) => {
        socket.join(showId);
        console.log(`User joined show: ${showId}`);
    });

    socket.on('lock_seat', (data) => {
        // data: { showId, seatNumber, userId }
        socket.to(data.showId).emit('seat_locked', data);
    });

    socket.on('unlock_seat', (data) => {
        socket.to(data.showId).emit('seat_unlocked', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Routes
app.get('/', (req, res) => {
    res.send('Movie Ticket Booking API is running...');
});

// Import Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/theatres', require('./routes/theatreRoutes'));
app.use('/api/shows', require('./routes/showRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/cities', require('./routes/cityRoutes'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
