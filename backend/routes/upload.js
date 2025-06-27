import express from 'express';
import xlsx from 'xlsx';
import upload from '../config/multer.js';
import { getModelBySheet } from '../models/getModelBySheet.js';

const router = express.Router();

router.post('/', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const workbook = xlsx.readFile(req.file.path);
    const fileName = req.file.originalname;

    const sheetResults = {};
    const skippedRows = [];

    for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const jsonRows = xlsx.utils.sheet_to_json(worksheet);

        const Model = getModelBySheet(fileName, sheetName);

        let insertedCount = 0;

        for (const row of jsonRows) {
            if (!row.Id) {
                skippedRows.push({ row, reason: 'Missing Id' });
                continue;
            }

            const exists = await Model.findOne({ Id: row.Id }).lean();
            if (exists) {
                skippedRows.push({ row, reason: `Duplicate Id: ${row.Id}` });
                continue;
            }

            try {
                await Model.create({ __sheetName: sheetName, ...row });
                insertedCount++;
            } catch (err) {
                if (err.name === 'ValidationError') {
                    const messages = Object.entries(err.errors).map(([field, error]) => ({
                        field,
                        message: error.message,
                    }));

                    skippedRows.push({
                        row,
                        reason: messages.map(e => `${e.field}: ${e.message}`).join('; '),
                    });
                } else {
                    throw err;
                }
            }
        }

        console.log(`\n📋 Skipped Rows (${skippedRows.length}):`);

        sheetResults[sheetName] = {
            inserted: insertedCount,
            total: jsonRows.length,
        };
    }

    res.json({
        message: 'File processed successfully',
        details: sheetResults,
        skippedRows,
    });
});

export default router;
