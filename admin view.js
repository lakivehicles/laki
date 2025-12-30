router.get("/admin/payments", auth(["admin"]), async (req, res) => {
    const payments = await stripe.paymentIntents.list({ limit: 100 });
    res.json(payments.data);
});
