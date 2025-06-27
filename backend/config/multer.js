import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, UPLOAD_DIR),

    filename: (_, file, cb) => {
        const { name } = path.parse(file.originalname);
        const safeName = name.trim().replace(/\s+/g, '_');
        const finalName = `${Date.now()}-${safeName}.xlsx`;
        cb(null, finalName);
    },
});

export default multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (_, file, cb) =>
        cb(null, ['.xls', '.xlsx', '.csv'].includes(path.extname(file.originalname))),
});
