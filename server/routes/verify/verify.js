import express from "express";

const router = express.Router();

router.get('/me', (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized access. User not found." });
        }
        return res.json({ user: req.user });
    } catch (error) {
        return res.status(500).json({ error: "An unexpected error occurred." });
    }
});



export default router;