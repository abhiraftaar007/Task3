import express from "express";
import { FieldValidation } from "../models/fieldValidation.model.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const data = req.body;

        if (!data.fieldName || !data.type) {
            return res.status(400).json({ error: "fieldName and type are required" }); 
        }
        const newValidation = new FieldValidation(data);
        const saved = await newValidation.save();

        res.status(201).json({
            message: "Validation rule created",
            rule: saved
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create validation rule" });
    }
})

export default router;