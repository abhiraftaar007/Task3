import { FieldValidation } from '../models/fieldValidation.model.js';

export const validateRow = async (row, sheetModel) => {
    const errors = [];
    const fieldValidations = await FieldValidation.find({});

    const normalizedRow = {};
    for (let key in row) {
        normalizedRow[key.trim().toLowerCase()] = row[key];
    }

    for (const fieldRule of fieldValidations) {
        const fieldKey = fieldRule.fieldName.trim().toLowerCase();
        const rawValue = normalizedRow[fieldKey];

        if (fieldRule.required && (rawValue === undefined || rawValue === null || rawValue === "")) {
            errors.push(`${fieldRule.fieldName} is required`);
            continue;
        }

        if (rawValue === undefined || rawValue === "" || rawValue === null) continue;

        if (fieldRule.unique) {
            const existing = await sheetModel.findOne({ [fieldRule.fieldName]: rawValue });
            if (existing) {
                errors.push(`${fieldRule.fieldName} "${rawValue}" already exists`);
                continue;
            }
        }

        switch (fieldRule.type) {
            case 'enum': {
                const normalizedValue = String(rawValue).trim();
                if (!fieldRule.allowedValues.includes(normalizedValue)) {
                    errors.push(
                        `${fieldRule.fieldName} "${rawValue}" is not one of [${fieldRule.allowedValues.join(', ')}]`
                    );
                }
                break;
            }

            case 'range': {
                const num = Number(rawValue);
                if (
                    Number.isNaN(num) ||
                    !Number.isInteger(num) ||
                    num < fieldRule.min ||
                    num > fieldRule.max
                ) {
                    errors.push(
                        `${fieldRule.fieldName} "${rawValue}" must be an integer between ${fieldRule.min} and ${fieldRule.max}`
                    );
                }
                break;
            }

            case 'string': {
                const str = String(rawValue).trim();
                if (fieldRule.minLength && str.length < fieldRule.minLength) {
                    errors.push(`${fieldRule.fieldName} must be at least ${fieldRule.minLength} characters`);
                }
                if (fieldRule.maxLength && str.length > fieldRule.maxLength) {
                    errors.push(`${fieldRule.fieldName} must be at most ${fieldRule.maxLength} characters`);
                }
                break;
            }
        }
    }

    return { errors };
};
