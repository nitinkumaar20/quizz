'use client';

import { useState, ChangeEvent } from 'react';

type MetaData = {
  board: string;
  exam: string;
  round: string;
  examType: string;
  questionType: string;
  isPYQ: boolean;
};

const boards = ['SSC', 'Railway'];
const examsMap: Record<string, string[]> = {
  SSC: ['CGL', 'CHSL', 'MTS'],
  Railway: ['Group D', 'ALP', 'NTPC'],
};
const rounds = ['Prelims', 'Mains'];
const examTypes = ['Quiz', 'Mock'];
const questionTypes = ['Chapterwise', 'Miscellaneous'];

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'manual' | 'word'>('manual');

  const [meta, setMeta] = useState<MetaData>({
    board: '',
    exam: '',
    round: '',
    examType: '',
    questionType: '',
    isPYQ: false,
  });

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [answer, setAnswer] = useState('');

  const handleMetaChange = (key: keyof MetaData, value: string | boolean) => {
    setMeta((prev) => ({ ...prev, [key]: value }));
    if (key === 'board') {
      setMeta((prev) => ({ ...prev, exam: '' })); // reset exam if board changes
    }
  };

  const handleWordUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Dummy handler, you can send file to backend later
      alert(`Uploaded file: ${file.name}`);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('manual')}
          className={`px-4 py-2 rounded ${
            activeTab === 'manual' ? 'bg-gray-900 text-white' : 'bg-gray-200'
          }`}
        >
          Manual Entry
        </button>
        <button
          onClick={() => setActiveTab('word')}
          className={`px-4 py-2 rounded ${
            activeTab === 'word' ? 'bg-gray-900   text-white' : 'bg-gray-200'
          }`}
        >
          Upload Word File
        </button>
      </div>

      {/* Shared Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select
          value={meta.board}
          onChange={(e) => handleMetaChange('board', e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select Board</option>
          {boards.map((board) => (
            <option key={board} value={board}>
              {board}
            </option>
          ))}
        </select>

        <select
          value={meta.exam}
          onChange={(e) => handleMetaChange('exam', e.target.value)}
          className="p-2 border rounded"
          disabled={!meta.board}
        >
          <option value="">Select Exam</option>
          {(examsMap[meta.board] || []).map((exam) => (
            <option key={exam} value={exam}>
              {exam}
            </option>
          ))}
        </select>

        <select
          value={meta.round}
          onChange={(e) => handleMetaChange('round', e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select Round</option>
          {rounds.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          value={meta.examType}
          onChange={(e) => handleMetaChange('examType', e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select Exam Type</option>
          {examTypes.map((et) => (
            <option key={et} value={et}>
              {et}
            </option>
          ))}
        </select>

        <select
          value={meta.questionType}
          onChange={(e) => handleMetaChange('questionType', e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select Question Type</option>
          {questionTypes.map((qt) => (
            <option key={qt} value={qt}>
              {qt}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={meta.isPYQ}
            onChange={(e) => handleMetaChange('isPYQ', e.target.checked)}
          />
          <label>PYQ</label>
        </div>
      </div>

      {/* Tabs Content */}
      {activeTab === 'manual' ? (
        <div className="space-y-4">
          <textarea
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Enter question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          {options.map((opt, idx) => (
            <input
              key={idx}
              type="text"
              className="w-full p-2 border rounded"
              placeholder={`Option ${String.fromCharCode(65 + idx)}`}
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
            />
          ))}
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Correct Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button className="bg-gray-900  w-full mx-auto text-white px-4 py-2 rounded">
            Submit Question
          </button>
        </div>
      ) : (
        <div>
          <input type="file" accept=".doc,.docx" onChange={handleWordUpload} />
          <p className="text-sm text-gray-600 mt-2">
            Upload a Word file with formatted questions.
          </p>
        </div>
      )}
    </div>
  );
}
