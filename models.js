const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    whatsapp: String,
    role: { type: String, enum: ["buyer", "seller", "admin"] },
    isPaid: { type: Boolean, default: false },
    trialEndsAt: Date,
    stripeCustomerId: String,
    subscriptionId: String,
    subscriptionStatus: String,
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }]
});

const VehicleSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String,
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now }
});

const SaleSchema = new mongoose.Schema({
    vehicleId: mongoose.Schema.Types.ObjectId,
    sellerId: mongoose.Schema.Types.ObjectId,
    amount: Number,
    commission: Number,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);
const Vehicle = mongoose.model("Vehicle", VehicleSchema);
const Sale = mongoose.model("Sale", SaleSchema);

module.exports = User;
module.exports.Vehicle = Vehicle;
module.exports.Sale = Sale;
