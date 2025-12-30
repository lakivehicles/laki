const router = require("express").Router();
const { Vehicle } = require("./models");
const User = require("./models");
const auth = require("./auth");
const { hasAccess } = require("./helper");

router.post("/", auth(["seller"]), async (req, res) => {
    const seller = await User.findById(req.user.id);

    if (!hasAccess(seller)) {
        return res.status(403).json({ msg: "Subscription required" });
    }

    const vehicle = await Vehicle.create({
        ...req.body,
        seller: seller._id
    });

    res.json(vehicle);
});

router.get("/", async (req, res) => {
    const vehicles = await Vehicle.find().populate("seller", "name");
    res.json(vehicles);
});

module.exports = router;
