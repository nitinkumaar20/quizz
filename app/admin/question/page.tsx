
"use client";
import React, { useState } from 'react';
import QuestionManager from './Question';
import UploadQuestionsFromWord from './Bulkquestion';
import New from './New';

const QuestionPage = () => {
const [viewMode, setViewMode] = useState<'manual' | 'excel' | 'rounds'>('manual');


  return (
    <div className='p-5 h-screen overflow-y-auto bg-gray-50 w-full'> 
  <div className=" flex justify-end gap-3">
      <button
    onClick={() => setViewMode('rounds')}
    className={`px-4 py-2 rounded ${viewMode === 'rounds' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
  >
   By Rounds
  </button>
  <button
    onClick={() => setViewMode('manual')}
    className={`px-4 py-2 rounded ${viewMode === 'manual' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
  >
    Upload Manually
  </button>
  <button
    onClick={() => setViewMode('excel')}
    className={`px-4 py-2 rounded ${viewMode === 'excel' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
  >
    Upload Excel File
  </button>

</div>
<div>


  {viewMode === 'rounds' && <New />}
  {viewMode === 'manual' && <QuestionManager />}
  {viewMode === 'excel' && <UploadQuestionsFromWord />}
  </div>
  </div>

  );
};

export default QuestionPage;
