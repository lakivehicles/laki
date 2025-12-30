router.get("/invoices", auth(["seller"]), async (req, res) => {
    const user = await User.findById(req.user.id);

    const invoices = await stripe.invoices.list({
        customer: user.stripeCustomerId
    });

    res.json(invoices.data);
});
