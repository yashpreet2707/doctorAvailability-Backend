import { User } from "../models/User.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { Router } from "express";

const router = Router();
router.get("/", (req, res) => {
  res.status(200).json({ message: "Doctor routes are working fine." });
});

router.put("/update-status", authenticateToken, async (req, res) => {
  try {
    const { isOnline } = req.body;
    await User.findByIdAndUpdate(req.user.id, { isOnline });
    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/online-doctors", authenticateToken, async (req, res) => {
  try {
    // Ensure only patients can access this endpoint
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Access denied" });
    }

    const doctors = await User.find({ role: "doctor", isOnline: true });
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/status", authenticateToken, async (req, res) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ message: "Access denied" });
  }

  const doctor = await User.findById(req.user.id);
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });

  res.status(200).json({ isOnline: doctor.isOnline });
});

export default router;
