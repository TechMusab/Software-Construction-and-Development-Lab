const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    items: [
        {
            itemName: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
        },
    ],
    status: {
        type: String,
        enum: ["Pending", "Confirmed", "Cancelled", "Delivered"],
        default: "Pending",
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Success", "Failed"],
        default: "Pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
