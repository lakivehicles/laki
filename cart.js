const router = require("express").Router();
const User = require("./models");
const { Vehicle } = require("./models");
const auth = require("./auth");

// Get user's cart
router.get("/", auth(["buyer"]), async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("cart");
        res.json(user.cart || []);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Add vehicle to cart (favorites)
router.post("/add/:vehicleId", auth(["buyer"]), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const vehicleId = req.params.vehicleId;

        // Check if vehicle exists
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ msg: "Vehicle not found" });
        }

        // Check if already in cart
        if (user.cart.includes(vehicleId)) {
            return res.status(400).json({ msg: "Vehicle already in favorites" });
        }

        user.cart.push(vehicleId);
        await user.save();

        const updatedUser = await User.findById(req.user.id).populate("cart");
        res.json(updatedUser.cart);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Remove vehicle from cart
router.delete("/remove/:vehicleId", auth(["buyer"]), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const vehicleId = req.params.vehicleId;

        user.cart = user.cart.filter(id => id.toString() !== vehicleId);
        await user.save();

        const updatedUser = await User.findById(req.user.id).populate("cart");
        res.json(updatedUser.cart);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Clear cart
router.delete("/clear", auth(["buyer"]), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.cart = [];
        await user.save();
        res.json({ msg: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

module.exports = router;

