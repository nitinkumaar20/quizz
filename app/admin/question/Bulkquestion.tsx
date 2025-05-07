import React from 'react'
import { useState } from 'react';
import * as XLSX from 'xlsx';

const REQUIRED_COLUMNS = [
  'questionText',
  'answerA',
  'answerB',
  'answerC',
  'answerD',
  'answerCorrect'
] as const;

// Type for the valid data object based on column names
type ExcelRow = {
  questionTitle: string;
  questionText: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  answerCorrect: string;
};

export default function Bulkquestion() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [data, setData] = useState<ExcelRow[] | null>(null);

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  // Function to handle file upload and processing
  const handleUpload = () => {
    if (!file) {
      setMessage('Please upload an Excel file.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const binaryStr = e.target?.result;
      if (!binaryStr) {
        setMessage('Error reading the file.');
        return;
      }

      const workbook = XLSX.read(binaryStr, { type: 'binary' });

      // Get the first sheet from the workbook
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);
      console.log(rows)
      // Filter and validate rows based on required columns
      const validData = rows.filter((row: any) => {
        // Check if all required columns exist in the row
        const missingColumns = REQUIRED_COLUMNS.filter(col => !(col in row));

        if (missingColumns.length > 0) {
          console.error(`Missing columns: ${missingColumns.join(', ')}`);
          return false; // Skip this row
        }
        return true; // Include this row if all required columns exist
      });

      if (validData.length === 0) {
        setMessage('No valid rows found.');
      } else {
        setMessage('File processed successfully!');
      }

      // Cast valid rows to the ExcelRow type
      const typedData = validData as ExcelRow[];
      setData(typedData);
    };

    reader.onerror = (error) => {
      setMessage('Error reading the file.');
      console.error(error);
    };

    reader.readAsBinaryString(file); // Read file as binary string
  };

  return (
    <div>
      <h1>Upload Excel File</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      <div>
        {message && <p>{message}</p>}
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </div>
    </div>
  );
}