import express from 'express';
import xlsx from 'xlsx';
import upload from '../config/multer.js';
import { FieldValidation } from '../models/fieldValidation.model.js';

const router = express.Router();

router.post('/', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }

    const workbook = xlsx.readFile(req.file.path);
    const allUnknownFields = new Set();

    const fieldValidations = await FieldValidation.find({});
    const knownFieldsSet = new Set(
        fieldValidations.map(rule => rule.fieldName.trim().toLowerCase())
    );

    for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        const rows = xlsx.utils.sheet_to_json(sheet);
        console.log(rows);

        for (const row of rows) {
            for (let key in row) {
                const normalizedKey = key.trim().toLowerCase();
                if (
                    normalizedKey !== '_sheetname' &&
                    !knownFieldsSet.has(normalizedKey)
                ) {
                    allUnknownFields.add(normalizedKey);
                }
            }
            break;
        }
    }

    res.json({
        message: "Field names scanned.",
        unknownFields: Array.from(allUnknownFields)
    });
});

export default router;
