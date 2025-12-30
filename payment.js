const router = require("express").Router();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const auth = require("../middleware/auth");
const User = require("../models/User");

router.post("/create-checkout", auth(["seller"]), async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Seller Registration Fee"
                    },
                    unit_amount: 1000 // $10
                },
                quantity: 1
            }
        ],
        success_url: "http://localhost:3000/success.html",
        cancel_url: "http://localhost:3000/cancel.html"
    });

    res.json({ url: session.url });
});

module.exports = router;

const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/subscribe", auth(["seller"]), async (req, res) => {
    const user = await User.findById(req.user.id);

    let customerId = user.stripeCustomerId;
    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            name: user.name
        });
        customerId = customer.id;
        user.stripeCustomerId = customerId;
        await user.save();
    }

    const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        line_items: [{
            price: process.env.STRIPE_PRICE_ID, // Monthly price ID
            quantity: 1
        }],
        success_url: "http://localhost:3000/success.html",
        cancel_url: "http://localhost:3000/cancel.html"
    });

    res.json({ url: session.url });
});
