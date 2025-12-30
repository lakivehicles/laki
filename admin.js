const router = require("express").Router();
const auth = require("./auth");
const User = require("./models");
const { Vehicle } = require("./models");

router.get("/users", auth(["admin"]), async (req, res) => {
    res.json(await User.find());
});

router.delete("/vehicle/:id", auth(["admin"]), async (req, res) => {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ msg: "Vehicle removed" });
});

module.exports = router;
