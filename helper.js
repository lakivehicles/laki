function hasAccess(user) {
    if (user.role !== "seller") return true;
    if (user.subscriptionStatus === "active") return true;
    if (user.trialEndsAt && user.trialEndsAt > new Date()) return true;
    return false;
}

module.exports = { hasAccess };