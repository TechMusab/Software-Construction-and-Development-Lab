const express = require("express");
const mongoose = require("mongoose");
const Restaurant = require("./model");
require('dotenv').config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.post("/restaurants", async (req, res) => {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).send(restaurant);
});
app.get("/restaurants/:id", async (req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).send({ message: "Restaurant not found" });
    res.send(restaurant);
});s
app.get("/restaurants", async (req, res) => {
    const restaurants = await Restaurant.find();
    res.send(restaurants);
});

app.listen(3001, () => console.log("Restaurant Service running on port 3001"));
