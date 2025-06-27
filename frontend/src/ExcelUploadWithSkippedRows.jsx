import React from 'react'

const ExcelUploadWithSkippedRows = ({sheetDetails, skippedRows}) => {
  return (
    <>
          {Object.keys(sheetDetails).length > 0 && (
              <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">Sheet Summary</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                      {Object.entries(sheetDetails).map(([sheet, stats]) => (
                          <li key={sheet}>
                              <strong>{sheet}:</strong> Inserted {stats.inserted} / Total {stats.total}
                          </li>
                      ))}
                  </ul>
              </div>
          )}

          {skippedRows.length > 0 && (
              <div>
                  <h3 className="text-lg font-semibold text-red-600 mb-2">Skipped Rows</h3>
                  <div className="overflow-auto max-h-96 border rounded">
                      <table className="w-full text-sm text-left border-collapse">
                          <thead className="bg-gray-100 text-gray-700 sticky top-0">
                              <tr>
                                  <th className="p-2 border">Reason</th>
                                  <th className="p-2 border">Row Data</th>
                              </tr>
                          </thead>
                          <tbody>
                              {skippedRows.map((item, index) => (
                                  <tr key={index} className="hover:bg-gray-50">
                                      <td className="p-2 border text-red-500">{item.reason}</td>
                                      <td className="p-2 border whitespace-pre-wrap">
                                          <pre className="text-xs text-gray-800">{JSON.stringify(item.row, null, 2)}</pre>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}
    </>
  )
}

export default ExcelUploadWithSkippedRows