import mongoose from 'mongoose';
import { getValidCountries } from '../utils/CountryList.js';

const rowSchema = new mongoose.Schema(
    {
        __sheetName: String,

        Gender: {
            type: String,
            enum: {
                values: ['male', 'female'],
                message: '{VALUE} is not a valid gender (must be "male" or "female")',
            },
            lowercase: true,
            trim: true,
        },

        Country: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    const countries = getValidCountries();
                    return countries.includes(value?.trim());
                },
                message: props => `${props.value} is not a valid country.`,
            },
        },

        Age: {
            type: mongoose.Schema.Types.Mixed,
            validate: {
                validator: val => Number.isInteger(Number(val)) && val >= 1 && val <= 120,
                message: props => `${props.value} must be a whole number between 1 and 120`,
            }
        }
    },
    { strict: false, timestamps: true },
);


export const getModelBySheet = (fileName, sheetName) => {
    // const base = path.parse(fileName).name;
    const collName = `${sheetName}`
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');

    return (
        mongoose.models[collName] ||
        mongoose.model(collName, rowSchema, collName)
    );
};
