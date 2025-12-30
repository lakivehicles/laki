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
    location: String,
    make: String,
    model: String,
    year: Number,
    colour: String,
    interiorColour: String,
    condition: String,
    transmission: String,
    vin: String,
    exchange: String,
    fuel: String,
    seats: Number,
    cylinders: Number,
    engineSize: String,
    horsePower: String,
    price: Number,
    negotiation: String,
    desc: String,
    moreDesc: String,
    images: [String], // Array of base64 images
    img: String, // First image for backward compatibility
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sellerName: String, // Store seller name for quick access
    sellerPhone: String,
    sellerWhatsapp: String,
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
