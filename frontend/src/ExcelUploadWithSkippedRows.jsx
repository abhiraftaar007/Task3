import React from 'react';

const ExcelUploadWithSkippedRows = ({ sheetDetails, skippedRows }) => {
    return (
        <div className="space-y-8">
            {/* Sheet Summary */}
            {Object.keys(sheetDetails).length > 0 && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 shadow-sm">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                        📊 Sheet Summary
                    </h3>
                    <ul className="list-disc list-inside text-sm text-blue-900">
                        {Object.entries(sheetDetails).map(([sheet, stats]) => (
                            <li key={sheet}>
                                <strong>{sheet}:</strong> Inserted {stats.inserted} / Total {stats.total}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Skipped Rows Table */}
            {skippedRows.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 shadow-sm">
                    <h3 className="text-lg font-semibold text-red-700 mb-4">
                        ⚠️ Skipped Rows ({skippedRows.length})
                    </h3>

                    <div className="overflow-x-auto max-h-[400px] border border-gray-200 rounded-lg shadow-inner">
                        <table className="min-w-full text-sm text-left border-collapse">
                            <thead className="bg-red-100 text-red-800 sticky top-0 z-10">
                                <tr>
                                    <th className="p-3 border">Reason</th>
                                    <th className="p-3 border">Row Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                {skippedRows.map((item, index) => (
                                    <tr key={index} className="odd:bg-white even:bg-red-50 hover:bg-red-100 transition">
                                        <td className="p-3 border text-red-600 font-medium w-1/3">{item.reason}</td>
                                        <td className="p-3 border whitespace-pre-wrap break-words text-gray-800">
                                            <pre className="text-xs font-mono">{JSON.stringify(item.row, null, 2)}</pre>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExcelUploadWithSkippedRows;
