import mongoose from "mongoose";

const fieldValidationSchema = new mongoose.Schema({
    fieldName: {
        type: String,
        required: true
    },

    type: {
        type: String,
        enum: ['enum', 'range', 'string'],
        required: true
    },

    allowedValues: [String], // enum

    min: Number, // range
    max: Number,

    minLength: Number, // string
    maxLength: Number,

    required: {
        type: Boolean,
        default: false
    },

    unique: {
        type: Boolean,
        default: false
    }
});

export const FieldValidation = mongoose.model('FieldValidation', fieldValidationSchema);