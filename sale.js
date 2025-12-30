const commissionRate = 0.05;
const commission = amount * commissionRate;

await Sale.create({
    vehicleId,
    sellerId,
    amount,
    commission
});

seller.totalSales += amount;
seller.totalCommissionPaid += commission;
await seller.save();
