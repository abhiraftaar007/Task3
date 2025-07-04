import express from 'express';
import xlsx from 'xlsx';
import upload from '../config/multer.js';
import { validateRow } from '../utils/validateRow.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/', upload.single('file'), async (req, res) => {
    const workbook = xlsx.readFile(req.file.path);

    const sheetDetails = {};
    const flattenedSkippedRows = [];

    for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        const rows = xlsx.utils.sheet_to_json(sheet);

        const skippedRows = [];
        const savedRows = [];

        const dynamicSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
        const collectionName = sheetName.trim().toLowerCase().replace(/\s+/g, '_');
        const sheetModel = mongoose.models[collectionName] || mongoose.model(collectionName, dynamicSchema);

        for (const row of rows) {
            const rowWithSheetInfo = { ...row, _sheetName: sheetName };

            const { errors } = await validateRow(rowWithSheetInfo, sheetModel);

            if (errors.length === 0) {
                const saved = await sheetModel.create(rowWithSheetInfo);
                savedRows.push(saved);
            } else {
                skippedRows.push({
                    reason: errors.join(", "),
                    row: rowWithSheetInfo
                });
            }
        }

        sheetDetails[sheetName] = {
            inserted: savedRows.length,
            total: rows.length
        };

        flattenedSkippedRows.push(...skippedRows);
    }

    res.json({
        message: "Upload complete.",
        details: sheetDetails,
        skippedRows: flattenedSkippedRows,
    });
});

export default router;
