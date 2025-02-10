const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/booking-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const bookingSchema = new mongoose.Schema({
  userId: String,
  carId: String,
  startDate: Date,
  endDate: Date,
  status: { type: String, default: 'active' },
});

const Booking = mongoose.model('Booking', bookingSchema);

app.post('/bookings', async (req, res) => {
  const { userId, carId, startDate, endDate } = req.body;
  const user = await axios.get(`http://localhost:3001/users/${userId}`);
  if (user.data.activeBookings >= user.data.maxBookings) {
    return res.status(400).send({ message: 'Booking limit reached' });
  }
  const car = await axios.get(`http://localhost:3002/cars/${carId}`);
  if (!car.data.isAvailable) {
    return res.status(400).send({ message: 'Car is unavailable' });
  }
  const booking = new Booking({ userId, carId, startDate, endDate });
  await booking.save();
  await axios.put(`http://localhost:3001/users/${userId}`, {
    activeBookings: user.data.activeBookings + 1,
  });
  await axios.put(`http://localhost:3002/cars/${carId}`, { isAvailable: false });

  res.status(201).send(booking);
});
app.get('/bookings/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId });
    if (bookings.length === 0) {
      return res.status(404).send({ message: 'No bookings found for this user' });
    }
    res.send(bookings);
  } catch (error) {
    res.status(500).send({ message: 'An error occurred', error: error.message });
  }
});


app.delete('/bookings/:bookingId', async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId);
  if (!booking) return res.status(404).send({ message: 'Booking not found' });
  await Booking.findByIdAndUpdate(req.params.bookingId, { status: 'canceled' });
  const user = await axios.get(`http://localhost:3001/users/${booking.userId}`);
  if (!user) return res.status(404).send({ message: 'User not found' });

  await axios.put(`http://localhost:3001/users/${booking.userId}`, {
    activeBookings: user.data.activeBookings - 1,
  });
  await axios.put(`http://localhost:3002/cars/${booking.carId}`, {
    isAvailable: true,
  });

  res.send({ message: 'Booking canceled' });
});
app.listen(3003, () => console.log('Booking Service running on port 3003'));
