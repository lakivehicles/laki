require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const User = require("./models");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

mongoose.connect(process.env.MONGO_URI);

app.use(express.json());
app.use(require("cors")());

app.use("/api/auth", require("./routes"));
app.use("/api/vehicles", require("./vehicle"));
app.use("/api/admin", require("./admin"));
app.use("/api/cart", require("./cart"));

io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("sendMessage", (data) => {
        io.emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(5000, () => console.log("Server running on port 5000"));

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const bodyParser = require("body-parser");

app.post("/webhook", bodyParser.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).json({ msg: `Webhook Error: ${err.message}` });
    }

    if (event.type === "checkout.session.completed") {
        // In real app, link session to seller ID
        console.log("Payment successful");
    }

    if (event.type === "customer.subscription.created" ||
        event.type === "customer.subscription.updated") {

        const subscription = event.data.object;
        const user = await User.findOne({ stripeCustomerId: subscription.customer });

        if (user) {
            user.subscriptionId = subscription.id;
            user.subscriptionStatus = subscription.status;
            await user.save();
        }
    }

    res.json({ received: true });
});
