const router = require("express").Router();
const { Vehicle } = require("./models");
const User = require("./models");
const auth = require("./auth");
const { hasAccess } = require("./helper");

// Add new vehicle (seller only)
router.post("/", auth(["seller"]), async (req, res) => {
    try {
        const seller = await User.findById(req.user.id);

        if (!hasAccess(seller)) {
            return res.status(403).json({ msg: "Subscription required" });
        }

        const vehicleData = {
            ...req.body,
            seller: seller._id,
            sellerName: seller.name,
            sellerPhone: seller.phone || "",
            sellerWhatsapp: seller.whatsapp || ""
        };

        const vehicle = await Vehicle.create(vehicleData);
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Get all vehicles (public access)
router.get("/", async (req, res) => {
    try {
        const vehicles = await Vehicle.find()
            .populate("seller", "name phone whatsapp")
            .sort({ createdAt: -1 });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Get vehicle by ID
router.get("/:id", async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id)
            .populate("seller", "name phone whatsapp");
        if (!vehicle) {
            return res.status(404).json({ msg: "Vehicle not found" });
        }
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Get seller's vehicles
router.get("/seller/:sellerId", async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ seller: req.params.sellerId })
            .sort({ createdAt: -1 });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Update vehicle (seller only, own vehicles)
router.put("/:id", auth(["seller"]), async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ msg: "Vehicle not found" });
        }

        if (vehicle.seller.toString() !== req.user.id) {
            return res.status(403).json({ msg: "Not authorized" });
        }

        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedVehicle);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Delete vehicle (seller only, own vehicles)
router.delete("/:id", auth(["seller"]), async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ msg: "Vehicle not found" });
        }

        if (vehicle.seller.toString() !== req.user.id) {
            return res.status(403).json({ msg: "Not authorized" });
        }

        await Vehicle.findByIdAndDelete(req.params.id);
        res.json({ msg: "Vehicle deleted" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

module.exports = router;
