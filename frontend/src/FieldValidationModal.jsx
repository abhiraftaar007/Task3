import React from 'react';
import FieldValidationForm from './FieldValidationForm';

const FieldValidationModal = ({ isOpen, onClose, onValidationComplete }) => {
    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 relative animate-fade-in scale-95 sm:scale-100 transition-all duration-300 overflow-y-auto max-h-[90vh]"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-blue-700">Add Field Validations</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-600 transition text-2xl font-bold leading-none"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <FieldValidationForm
                    onComplete={() => {
                        onClose();
                        onValidationComplete();
                    }}
                />
            </div>
        </div>
    );
};

export default FieldValidationModal;
