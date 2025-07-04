import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router';
import { useFile } from './Context/FileProvider';

const initialFormData = {
    fieldName: '',
    type: '',
    allowedValues: [],
    allowedValuesInput: '',
    min: 0,
    max: 0,
    minLength: 0,
    maxLength: 0,
    required: false,
    unique: false,
}

const FieldValidationForm = ({onComplete}) => {
    const [formData, setFormData] = useState(initialFormData);
    const [fieldOptions, setFieldOptions] = useState([]);
    const [unknownFields, setUnknownFields] = useState([]);

    const { file } = useFile();
    const uploadedFile = file;

    useEffect(() => {
        const fetchUnknownFields = async () => {
            if (!uploadedFile) {
                toast.error("No file found to scan fields.");
                return;
            }
            try {
                const formData = new FormData();
                formData.append("file", uploadedFile);

                const res = await axios.post('http://localhost:5000/api/field-name', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                const unknown = res.data.unknownFields || [];
                setUnknownFields(unknown);
                setFieldOptions(unknown);
            } catch (err) {
                toast.error("Failed to load unknown fields");
            }
        };

        fetchUnknownFields();
    }, []);

    const handleAddField = async () => {
        const payload = buildPayload(formData);

        if (!payload.fieldName || !payload.type) {
            toast.error("Field name and type are required");
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/field-validations', payload, {
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.status == 201) {
                const filteredData = fieldOptions.filter((item) => item != payload.fieldName)
                setFieldOptions(filteredData)
            }
            setFormData(initialFormData);
            toast.success("Field added. You can add another.");
        } catch (err) {
            toast.error(err.response?.data?.error || "Submission failed");
        }

    };


    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddAllowedValue = () => {
        const trimmed = formData.allowedValuesInput.trim();
        if (trimmed && !formData.allowedValues.includes(trimmed)) {
            setFormData(prev => ({
                ...prev,
                allowedValues: [...prev.allowedValues, trimmed],
                allowedValuesInput: ''
            }));
        }
    };

    const handleRemoveAllowedValue = val => {
        setFormData(prev => ({
            ...prev,
            allowedValues: prev.allowedValues.filter(v => v !== val)
        }));
    };

    const buildPayload = (data) => {
        const payload = {};

        if (data.fieldName) payload.fieldName = data.fieldName;
        if (data.type) payload.type = data.type;

        if (data.required) payload.required = true;
        if (data.unique) payload.unique = true;

        if (data.allowedValues?.length > 0) {
            payload.allowedValues = data.allowedValues;
        }

        if (data.min !== 0) payload.min = Number(data.min);
        if (data.max !== 0) payload.max = Number(data.max);

        if (data.minLength !== 0) payload.minLength = Number(data.minLength);
        if (data.maxLength !== 0) payload.maxLength = Number(data.maxLength);

        return payload;
    };

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        if (onComplete) onComplete();
    };


    return (
        <>
            <form
                onSubmit={handleFinalSubmit}
                className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-100 space-y-6"
            >
                <h2 className="text-2xl font-bold text-blue-700 text-center">🔧 Create Field Validation</h2>

                {/* Field Name */}
                <div>
                    <label className="block font-medium text-gray-700 mb-1">Field Name</label>
                    <select
                        name="fieldName"
                        value={formData.fieldName}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    >
                        <option value="">-- Select Field --</option>
                        {fieldOptions.map((field, idx) => (
                            <option key={idx} value={field}>{field}</option>
                        ))}
                    </select>
                </div>

                {/* Type */}
                <div>
                    <label className="block font-medium text-gray-700 mb-1">Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    >
                        <option value="">-- Select Type --</option>
                        <option value="enum">Enum</option>
                        <option value="range">Range</option>
                        <option value="string">String</option>
                    </select>
                </div>

                {/* Enum Values */}
                {formData.type === 'enum' && (
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Allowed Values</label>
                        <div className="flex flex-wrap gap-2">
                            <input
                                type="text"
                                name="allowedValuesInput"
                                value={formData.allowedValuesInput}
                                onChange={handleChange}
                                className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                placeholder="Add value"
                            />
                            <button
                                type="button"
                                onClick={handleAddAllowedValue}
                                disabled={!formData.fieldName || !formData.type}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                Add
                            </button>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {formData.allowedValues.map((val, idx) => (
                                <span
                                    key={idx}
                                    className="bg-gray-200 text-sm px-3 py-1 rounded-full flex items-center"
                                >
                                    {val}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveAllowedValue(val)}
                                        className="ml-2 text-red-500 hover:text-red-700 font-bold"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Range */}
                {formData.type === 'range' && (
                    <div className="flex flex-wrap gap-4">
                        <div className="w-full sm:w-1/2">
                            <label className="block font-medium text-gray-700 mb-1">Min</label>
                            <input
                                type="number"
                                name="min"
                                value={formData.min}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                required
                            />
                        </div>
                        <div className="w-full sm:w-1/2">
                            <label className="block font-medium text-gray-700 mb-1">Max</label>
                            <input
                                type="number"
                                name="max"
                                value={formData.max}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                required
                            />
                        </div>
                    </div>
                )}

                {/* String Length */}
                {formData.type === 'string' && (
                    <div className="flex flex-wrap gap-4">
                        <div className="w-full sm:w-1/2">
                            <label className="block font-medium text-gray-700 mb-1">Min Length</label>
                            <input
                                type="number"
                                name="minLength"
                                value={formData.minLength}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                        <div className="w-full sm:w-1/2">
                            <label className="block font-medium text-gray-700 mb-1">Max Length</label>
                            <input
                                type="number"
                                name="maxLength"
                                value={formData.maxLength}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                    </div>
                )}

                {/* Checkboxes */}
                <div className="flex flex-wrap gap-6 items-center">
                    <label className="inline-flex items-center gap-2 text-gray-800">
                        <input
                            type="checkbox"
                            name="required"
                            checked={formData.required}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600"
                        />
                        Required
                    </label>
                    <label className="inline-flex items-center gap-2 text-gray-800">
                        <input
                            type="checkbox"
                            name="unique"
                            checked={formData.unique}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600"
                        />
                        Unique
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-between">
                    <button
                        type="button"
                        onClick={handleAddField}
                        className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        ➕ Add Field
                    </button>

                    <button
                        type="submit"
                        onClick={handleFinalSubmit}
                        className="flex-1 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
                    >
                        ✅ Submit All & Go Back
                    </button>
                </div>
            </form>

        </>

    );
};

export default FieldValidationForm;
