const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/user-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  maxBookings: { type: Number, default: 3 },
  activeBookings: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);
app.post('/users', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).send(user);
});

app.get('/users/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).send({ message: 'User not found' });
  res.send(user);
});

app.put('/users/:userId', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
    new: true,
  });
  if (!user) return res.status(404).send({ message: 'User not found' });
  res.send(user);
});

app.listen(3001, () => console.log('User Service running on port 3001'));
