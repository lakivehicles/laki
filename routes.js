const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models");

// Register with email/password (traditional)
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, phone, whatsapp, role } = req.body;
        
        if (!name || !phone || !whatsapp || !role) {
            return res.status(400).json({ msg: "Name, phone, whatsapp, and role are required" });
        }

        if (!password) {
            return res.status(400).json({ msg: "Password is required" });
        }

        // Check if user exists by phone
        let user = await User.findOne({ phone });
        
        if (user) {
            // User exists - verify password if they have one
            if (user.password) {
                const match = await bcrypt.compare(password, user.password);
                if (!match) {
                    return res.status(400).json({ msg: "User already exists with different password" });
                }
            } else {
                // User exists but no password - set it
                user.password = await bcrypt.hash(password, 10);
                await user.save();
            }
            
            const token = jwt.sign(
                { id: user._id, role: user.role, name: user.name },
                process.env.JWT_SECRET
            );
            return res.json({ token, user });
        }

        // Create new user
        const userData = { 
            name, 
            phone, 
            whatsapp, 
            role,
            email: email || `${phone}@vehh.local`,
            password: await bcrypt.hash(password, 10) // Always require password
        };
        
        if (role === "seller") {
            userData.trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        }

        user = await User.create(userData);
        
        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name },
            process.env.JWT_SECRET
        );
        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Login with username/email and password (for existing users only)
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username) {
            return res.status(400).json({ msg: "Username or email is required" });
        }

        if (!password) {
            return res.status(400).json({ msg: "Password is required" });
        }

        // Try to find user by email or name
        let user = await User.findOne({
            $or: [
                { email: username },
                { name: username }
            ]
        });
        
        if (!user) {
            return res.status(400).json({ msg: "User not found. Please register first." });
        }

        // User exists - verify password
        if (!user.password) {
            return res.status(400).json({ msg: "No password set. Please contact administrator." });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ msg: "Incorrect password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name },
            process.env.JWT_SECRET
        );
        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Get current user
router.get("/me", async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ msg: "No token" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select("-password");
            if (!user) {
                return res.status(404).json({ msg: "User not found" });
            }
            res.json(user);
        } catch {
            res.status(401).json({ msg: "Invalid token" });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

module.exports = router;
