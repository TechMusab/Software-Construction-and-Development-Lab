const express = require("express");
const mongoose = require("mongoose");
const Customer = require("./model");
require('dotenv').config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.post("/customers", async (req, res) => {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).send(customer);
});
app.get("/customers/:id", async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send({ message: "Customer not found" });
    res.send(customer);
});
app.put("/customers/:id", async (req, res) => {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).send({ message: "Customer not found" });
    res.send(customer);
});

app.listen(3002, () => console.log("Customer Service running on port 3002"));
