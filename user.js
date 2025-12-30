const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["buyer", "seller", "admin"] }
});

module.exports = mongoose.model("User", UserSchema);

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["buyer", "seller", "admin"] },

    // Billing
    stripeCustomerId: String,
    subscriptionId: String,
    subscriptionStatus: String,

    // Trial
    trialEndsAt: Date,

    // Stats
    totalSales: { type: Number, default: 0 },
    totalCommissionPaid: { type: Number, default: 0 }
});

module.exports = mongoose.model("User", UserSchema);
