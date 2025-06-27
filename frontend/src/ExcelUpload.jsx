import React, { useState } from 'react';
import axios from "axios";
import ExcelUploadWithSkippedRows from './ExcelUploadWithSkippedRows';
import LoadingSpinner from './LoadingSpinner';

const ExcelUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [skippedRows, setSkippedRows] = useState([]);
    const [sheetDetails, setSheetDetails] = useState({});
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage("");
        setSkippedRows([]);
        setSheetDetails({});
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);

        try {
            const res = await axios.post("http://localhost:5000/api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const { message, details, skippedRows } = res.data;

            setMessage(message || "File uploaded successfully!");
            setSheetDetails(details);
            setSkippedRows(skippedRows);
        } catch (err) {
            console.error(err);
            setMessage("Error uploading file.");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded-2xl shadow-lg bg-white">
            <h2 className="text-xl font-bold mb-4 text-center">Upload Excel File</h2>

            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0 file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
            />

            <button
                onClick={handleUpload}
                className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
                {loading ? "Uploading..." : "Upload"}
            </button>

            <LoadingSpinner loading={loading}/>

            {message && (
                <p className="font-bold mt-4 text-center text-sm text-gray-700">{message}</p>
            )}

            <ExcelUploadWithSkippedRows sheetDetails={sheetDetails} skippedRows={skippedRows} />

        </div>
    );
};

export default ExcelUpload;
