import React, { useEffect, useState } from 'react';
import axios from "axios";
import ExcelUploadWithSkippedRows from './ExcelUploadWithSkippedRows';
import LoadingSpinner from './LoadingSpinner';
import { useFile } from './Context/FileProvider';
import FieldValidationModal from './FieldValidationModal';

const ExcelUpload = () => {
    const { file, setFile } = useFile();
    const [message, setMessage] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const [skippedRows, setSkippedRows] = useState([]);
    const [sheetDetails, setSheetDetails] = useState({});
    const [loading, setLoading] = useState(false);
    const [unknownFields, setUnknownFields] = useState([]);
    const [showValidationModal, setShowValidationModal] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage("");
        setSkippedRows([]);
        setSheetDetails({});
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Select the file first");
            return;
        }
        setShowValidationModal(true);
    };

    const handleValidationComplete = async () => {
        if (!file) {
            setMessage("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        setLoading(true);

        try {
            const res = await axios.post("http://localhost:5000/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const { message, details, skippedRows, unknownFields } = res.data;
            setMessage(message || "File uploaded successfully!");
            setSheetDetails(details);
            setSkippedRows(skippedRows);
            setUnknownFields(unknownFields || []);
        } catch (err) {
            setMessage("Error uploading file.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (message) {
            setShowMessage(true); // Make it visible

            const fadeTimer = setTimeout(() => {
                setShowMessage(false); // Trigger fade-out
            }, 2500); // start fade-out at 2.5s

            const clearTimer = setTimeout(() => {
                setMessage('');
            }, 3000); // remove message after fade-out

            return () => {
                clearTimeout(fadeTimer);
                clearTimeout(clearTimer);
            };
        }
    }, [message]);


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-white py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-2xl border border-blue-100">
                <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
                    📄 Upload Excel File
                </h2>

                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-700 mb-6
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:bg-blue-100 file:text-blue-700
                        hover:file:bg-blue-200 transition duration-200"
                />

                <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? "Uploading..." : "Upload"}
                </button>

                {/* Modal */}
                <FieldValidationModal
                    isOpen={showValidationModal}
                    onClose={() => setShowValidationModal(false)}
                    onValidationComplete={handleValidationComplete}
                />

                {/* Spinner */}
                <div className="mt-4 flex justify-center">
                    <LoadingSpinner loading={loading} />
                </div>

                {/* Message */}
                {message && (
                    <p
                        className={`text-center mt-4 text-sm font-medium text-gray-800 bg-blue-50 py-2 px-4 rounded shadow-sm transition-opacity duration-500 ${showMessage ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        {message}
                    </p>
                )}

                {/* Skipped Rows */}
                <div className="mt-6">
                    <ExcelUploadWithSkippedRows
                        sheetDetails={sheetDetails}
                        skippedRows={skippedRows}
                    />
                </div>
            </div>
        </div>
    );
};

export default ExcelUpload;
