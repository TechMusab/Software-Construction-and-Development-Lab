const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    preferences: {
        type: [String],
    },
});

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
