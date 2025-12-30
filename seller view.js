router.get("/payments", auth(["seller"]), async (req, res) => {
    const user = await User.findById(req.user.id);

    const payments = await stripe.paymentIntents.list({
        customer: user.stripeCustomerId
    });

    res.json(payments.data);
});
