const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const Order = require("./model");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post("/orders", async (req, res) => {
  const { customerId, restaurantId, items } = req.body;
  const customer = await axios
    .get(`http://localhost:3002/customers/${customerId}`)
    .then((response) => response.data)
    .catch(() => null);
  if (!customer) return res.status(404).send({ message: "Customer not found" });

  const restaurant = await axios
    .get(`http://localhost:3001/restaurants/${restaurantId}`)
    .then((response) => response.data)
    .catch(() => null);
  if (!restaurant)
    return res.status(404).send({ message: "Restaurant not found" });

  const paymentStatus = "Success";

  const order = new Order({
    customerId,
    restaurantId,
    items,
    status: "Confirmed",
    paymentStatus,
  });

  await order.save();
  console.log("Payment processed successfully");

  res.status(201).send(order);
});
app.get("/orders/:id", async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) return res.status(404).send({ message: "Order not found" });
  res.status(200).send(order);
});

app.get("/orders/history/:customerId", async (req, res) => {
  const { customerId } = req.params;
  const orders = await Order.find({ customerId });
  if (orders.length === 0)
    return res.status(404).send({ message: "No orders found" });
  res.status(200).send(orders);
});

app.listen(3003, () => console.log("Order Service running on port 3003"));
