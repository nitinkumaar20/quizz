
"use client";
import React, { useState } from 'react';
import QuestionManager from './Question';
import UploadQuestionsFromWord from './Bulkquestion';

const QuestionPage = () => {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="p-5 h-screen overflow-y-auto bg-gray-50 w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Question Management</h1>
        <div className="space-x-2">
          <button
            onClick={() => setShowUpload(false)}
            className={`px-4 py-2 rounded ${!showUpload ? 'bg-blue-600 text-white' : 'bg-white border'}`}
          >
            Question Manager
          </button>
          <button
            onClick={() => setShowUpload(true)}
            className={`px-4 py-2 rounded ${showUpload ? 'bg-blue-600 text-white' : 'bg-white border'}`}
          >
            Upload Word File
          </button>
        </div>
      </div>

      {showUpload ? <UploadQuestionsFromWord /> : <QuestionManager />}
    </div>
  );
};

export default QuestionPage;
