import React from 'react';

const LoadingSpinner = ({ loading, text = "Uploading..." }) => {
    if (!loading) return null;

    return (
        <div className="flex flex-col items-center justify-center mt-6 space-y-3">
            <div className="relative">
                <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-md"></div>
            </div>
            <p className="text-sm text-blue-600 font-medium animate-pulse">{text}</p>
        </div>
    );
};

export default LoadingSpinner;
