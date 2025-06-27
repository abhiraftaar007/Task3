import express from 'express';
import mongoose from 'mongoose';
import uploadRouter from './routes/upload.js';
import dotenv from "dotenv";
import { fetchCountries } from './utils/CountryList.js';
import cors from 'cors';

const app = express();

// Enable CORS for all origins (or customize if needed)
// app.use(cors());

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

dotenv.config();

await fetchCountries();

app.use('/api/upload', uploadRouter);

try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
} catch (error) {
    console.log("Error in DB connection: ", error.message);
}

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log("server is running on port", PORT);
});
