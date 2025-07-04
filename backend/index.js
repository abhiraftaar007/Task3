import express from 'express';
import uploadRouter from './routes/upload.route.js';
import fieldValidationRoutes from "./routes/fieldValidation.route.js";
import getFieldName from "./routes/getFieldName.route.js";
import dotenv from "dotenv";
import cors from 'cors';
import { connectDB } from './utils/db.js';

const app = express();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

dotenv.config();

app.use('/api/upload', uploadRouter);
app.use('/api/field-validations', fieldValidationRoutes);
app.use('/api/field-name', getFieldName);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    connectDB();
    console.log("server is running on port", PORT);
});
