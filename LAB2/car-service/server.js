const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/car-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const carSchema = new mongoose.Schema({
  model: String,
  location: String,
  isAvailable: { type: Boolean, default: true },
});

const Car = mongoose.model('Car', carSchema);

app.post('/cars', async (req, res) => {
  const car = new Car(req.body);
  await car.save();
  res.status(201).send(car);
});

app.get('/cars/:carId', async (req, res) => {
  const car = await Car.findById(req.params.carId);
  if (!car) return res.status(404).send({ message: 'Car not found' });
  res.send(car);
});

app.put('/cars/:carId', async (req, res) => {
  const car = await Car.findByIdAndUpdate(req.params.carId, req.body, {
    new: true,
  });
  if (!car) return res.status(404).send({ message: 'Car not found' });
  res.send(car);
});

app.listen(3002, () => console.log('Car Service running on port 3002'));
