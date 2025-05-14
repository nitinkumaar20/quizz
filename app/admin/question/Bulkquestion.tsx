"use client";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { useGlobalDataStore } from "../../stores/globalDataStores";
import type {
  ExamBoardType,
  SubjectType,
  TopicType,
  RoundType,
} from "../../stores/globalDataStores";
import axios from "axios";
import { TablePagination } from "@/app/components/Table";

const REQUIRED_COLUMNS = [
  "questionTitle",
  "questionText",
  "answerA",
  "answerB",
  "answerC",
  "answerD",
  "answerCorrect",
] as const;

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
  const {
    examBoards,
    subjects,
    rounds,
    topics,
    fetchQuestions,
    fetchRounds,
    fetchTopics,
    fetchExamBoards,
    fetchSubjects,
    questions,
    showAlert,
    addQuestions,
    updateQuestion,
  } = useGlobalDataStore();

  const [file, setFile] = useState<File | null>(null);
  // const [message, setMessage] = useState<string>("");
  const [data, setData] = useState<ExcelRow[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
  const [selectedRoundId, setSelectedRoundId] = useState<string>("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);



  const filteredSubjects = subjects.filter(
    (s) => String(s.examId) === selectedBoardId
  );
  const filteredTopics = topics.filter(
    (t) => String(t.subjectId) === selectedSubjectId
  );
  const filteredRounds = rounds.filter(
    (r) => String(r.examId) === selectedBoardId
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  useEffect(() => {
    questions.length === 0 && fetchQuestions();
    rounds.length === 0 && fetchRounds();
    topics.length === 0 && fetchTopics();
    examBoards.length === 0 && fetchExamBoards();
    subjects.length === 0 && fetchSubjects();
  }, []);

  const normalizeHeaders = (rows: any[]) => {
    return rows.map((row: any) => {
      const normalized: any = {};
      Object.keys(row).forEach((key) => {
        const cleanKey = key.trim(); // Trim spaces from headers
        normalized[cleanKey] = row[key];
      });
      return normalized;
    });
  };

  const removeExtraSpaces = (rows: ExcelRow[]) => {
    return rows.map((row) => {
      const cleanedRow: any = {};
      for (const key in row) {
        const value = row[key as keyof ExcelRow];
        cleanedRow[key] = typeof value === "string" ? value.trim() : value;
      }
      return cleanedRow;
    });
  };

  const handleUpload = () => {
    if (!file) {
      showAlert({
        icon: "info",
        title: "Info",
        text: "Please upload an Excel file",
        confirmButtonText: "OK",
      });

      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const binaryStr = e.target?.result;
      if (!binaryStr) {
        showAlert({
          icon: "error",
          title: "error",
          text: "Error reading the file.",
          confirmButtonText: "OK",
        });

        return;
      }

      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawRows = XLSX.utils.sheet_to_json(sheet);
      const normalizedRows = normalizeHeaders(rawRows);
      const cleanedData = removeExtraSpaces(normalizedRows as ExcelRow[]);

      const validData = cleanedData.filter((row: any) => {
        const missingColumns = REQUIRED_COLUMNS.filter((col) => !(col in row));
        if (missingColumns.length > 0) {
          console.error(`Missing columns: ${missingColumns.join(", ")}`);
          return false;
        }
        return true;
      });

      if (validData.length === 0) {
        showAlert({
          icon: "error",
          title: "error",
          text: "No valid rows found.",
          confirmButtonText: "OK",
        });
      } else {
        setData(validData);
        setIsModalOpen(true); // Show modal
      }
    };

    reader.onerror = (error) => {
      showAlert({
        icon: "error",
        title: "Error",
        text: "Error reading the file.",
        confirmButtonText: "OK",
      });
      console.error(error);
    };

    reader.readAsBinaryString(file);
  };

  const handleSubmitToBackend = async () => {
    if (!data) {
      showAlert({
        icon: "error",
        title: "Error",
        text: "Please upload and process an Excel file first.",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!selectedTopicId || !selectedRoundId) {
      showAlert({
        icon: "error",
        title: "Error",
        text: "Please select both a topic and a round.",
        confirmButtonText: "OK",
      });
      return;
    }

    const payload = data.map((q) => ({
      questionTitle: q.questionTitle || "",
      questionText: q.questionText,
      answerA: q.answerA,
      answerB: q.answerB,
      answerC: q.answerC,
      answerD: q.answerD,
      answerCorrect: q.answerCorrect,
      topicId: Number(selectedTopicId),
      roundId: Number(selectedRoundId),
      active: true,
      questionYear: new Date().getFullYear().toString(),
    }));

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_QUESTIONS_bulk_API_KEY}`,
        payload
      );
      if (response.data.data && response.data.data.length > 0) {
        // updateExamBoard(data.data[0]);
        addQuestions(response.data.data);
        console.log(response.data.data, "response.data.data");
      }
      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `${response.data.message}: Questions successfully uploaded`,
          confirmButtonText: "OK",
        });
        setData(null);
        setFile(null);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `❌ Upload failed: ${
            response.data.message || "Unexpected response status"
          }`,
          confirmButtonText: "OK",
        });
      }
    } catch (err: any) {
      console.error(err);
      const messageApi =
        err.response?.data?.message[0].error[0].message ||
        "Unknown error during submission";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: messageApi,
        confirmButtonText: "OK",
      });
    }
  };

  const handleEdit = async (id: string | undefined) => {
    if (!id) return;
    try {
      const question = questions.find((q) => q.id === id);

      setEditingQuestion(question);
      setEditModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch question:", error);
      showAlert({
        icon: "error",
        title: "Error",
        text: "Failed to fetch question for editing.",
        confirmButtonText: "OK",
      });
    }
  };

  const handleUpdateQuestion = async () => {
    try {
      const { id } = editingQuestion;
      const updatedData = {
        questionText: editingQuestion.questionText,
        questionTitle: editingQuestion.questionTitle,
        answerA: editingQuestion.answerA,
        answerB: editingQuestion.answerB,
        answerC: editingQuestion.answerC,
        answerD: editingQuestion.answerD,
        answerCorrect: editingQuestion.answerCorrect,
        questionYear: editingQuestion.questionYear,
        topicId: editingQuestion.topicId,
        roundId: editingQuestion.roundId,
        active: editingQuestion.active,
      };
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_QUESTIONS_API_KEY}/${id}`,
        updatedData
      );

      if (res.status === 200) {
        showAlert({
          icon: "success",
          title: "Updated",
          text: "Question updated successfully!",
          confirmButtonText: "OK",
        });
        updateQuestion(res.data.data[0]);
        setEditModalOpen(false);
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      console.error(err);
      showAlert({
        icon: "error",
        title: "Error",
        text: "Failed to update question.",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="mx-10">
      <h1 className="text-2xl font-bold mb-5">Bulk Question Upload</h1>

      {/* Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Exam Board */}
        <div>
          <label className="block text-sm font-medium">Exam Board</label>
          <select
            className="w-full border p-2 rounded"
            value={selectedBoardId}
            onChange={(e) => {
              setSelectedBoardId(e.target.value);
              setSelectedSubjectId("");
              setSelectedRoundId("");
              setSelectedTopicId("");
            }}
          >
            <option value="">Select Exam Board</option>
            {examBoards.map((board: ExamBoardType) => (
              <option key={board.id} value={String(board.id)}>
                {board.examBoardShortName?.toUpperCase()} -{" "}
                {board.examName?.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium">Subject</label>
          <select
            className="w-full border p-2 rounded"
            value={selectedSubjectId}
            onChange={(e) => {
              setSelectedSubjectId(e.target.value);
              setSelectedTopicId("");
            }}
            disabled={!selectedBoardId}
          >
            <option value="">Select Subject</option>
            {filteredSubjects.map((subject: SubjectType) => (
              <option key={subject.id} value={String(subject.id)}>
                {subject.subjectName.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Topic */}
        <div>
          <label className="block text-sm font-medium">Topic</label>
          <select
            className="w-full border p-2 rounded"
            value={selectedTopicId}
            onChange={(e) => setSelectedTopicId(e.target.value)}
            disabled={!selectedSubjectId}
          >
            <option value="">Select Topic</option>
            {filteredTopics.map((topic: TopicType) => (
              <option key={topic.id} value={String(topic.id)}>
                {topic.topicName.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Round */}
        <div>
          <label className="block text-sm font-medium">Round</label>
          <select
            className="w-full border p-2 rounded"
            value={selectedRoundId}
            onChange={(e) => setSelectedRoundId(e.target.value)}
            disabled={!selectedBoardId}
          >
            <option value="">Select Round</option>
            {filteredRounds.map((round: RoundType) => (
              <option key={round.id} value={String(round.id)}>
                {round.roundName.toUpperCase()} ({round.roundType})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* File Upload */}
      <div className="pt-4">
        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={handleFileChange}
          className="px-2 py-1"
        />
        <button
          className="ml-2 px-4 py-2 bg-[--primary] text-white rounded hover:bg-[--secondary]"
          onClick={handleUpload}
        >
          Upload
        </button>
      </div>


{editModalOpen && editingQuestion && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-3xl shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Edit Question</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Exam Board */}
        <div>
          <label className="block text-sm font-medium mb-1">Exam Board</label>
          <select
            className="w-full border px-2 py-1 rounded"
            value={editingQuestion.examBoardId || ""}
            onChange={(e) => {
              const examBoardId = Number(e.target.value);
              const examId = Number(e.target.value);
              setEditingQuestion({
                ...editingQuestion,
                examBoardId,
                examId, // reset child
              });
            }}
          >
            <option value="">Exam Board and Exam Name</option>
            {
            examBoards.map((board,i) => (
              
              <option key={i} value={board.id}>
                {board.examBoardShortName + " - " + board.examName}
              </option>
            ))}
          </select>

        </div>

        {/* Exam */}
        {/* <div>
          <label className="block text-sm font-medium mb-1">Exam</label>
          <select
            className="w-full border px-2 py-1 rounded"
            value={editingQuestion.examId || ""}
            onChange={(e) => {
              const examId = Number(e.target.value);
              setEditingQuestion({
                ...editingQuestion,
                examId,
                subjectId: "", // reset child
              });
            }}
          >
            <option value="">Select Exam</option>
            {
              examBoards
                .filter((board) => board.id === editingQuestion.examBoardId)
                .map((board) => (
                  <option key={board.id} value={board.id}>
                    {board.examName}
                  </option>
                ))
            }
          </select>
        </div> */}

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <select
            className="w-full border px-2 py-1 rounded"
            value={editingQuestion.subjectId || ""}
            onChange={(e) =>
              setEditingQuestion({
                ...editingQuestion,
                subjectId: Number(e.target.value),
                topicId: "", // reset child
              })
            }
          >
            <option value="">Select Subject</option>
            {
              subjects
                .filter((s) => s.examId === editingQuestion.examId)
                .map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subjectName}
                  </option>
                ))
            }
          </select>
        </div>

        {/* Topic */}
        <div>
          <label className="block text-sm font-medium mb-1">Topic</label>
          <select
            className="w-full border px-2 py-1 rounded"
            value={editingQuestion.topicId || ""}
            onChange={(e) =>
              setEditingQuestion({ ...editingQuestion, topicId: Number(e.target.value) })
            }
          >
            <option value="">Select Topic</option>
            {
              topics
                .filter((t) => t.subjectId === editingQuestion.subjectId)
                .map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.topicName}
                  </option>
                )) 
            }
          </select>
        </div>

        {/* Round */}
        <div>
          <label className="block text-sm font-medium mb-1">Round</label>
          <select
            className="w-full border px-2 py-1 rounded"
            value={editingQuestion.roundId || ""}
            onChange={(e) =>
              setEditingQuestion({ ...editingQuestion, roundId: Number(e.target.value) })
            }
          >
            <option value="">Select Round</option>
            {
              rounds
                .filter((r) => r.examId === editingQuestion.examBoardId)
                .map((round) => (
                  <option key={round.id} value={round.id}>
                    {round.roundName}
                  </option>
                ))
            }
          </select>
        </div>
        {/* Active Status */}
<div className="flex items-center space-x-2 mt-2">
  <input
    type="checkbox"
    id="active"
    checked={editingQuestion.active || false}
    onChange={(e) =>
      setEditingQuestion({ ...editingQuestion, active: e.target.checked })
    }
  />
  <label htmlFor="active" className="text-sm font-medium">Active</label>
</div>

      </div>

      {/* Text fields */}
      <div className="grid grid-cols-2 gap-4 mt-5">
        {[
          "questionTitle",
          "questionText",
          "answerA",
          "answerB",
          "answerC",
          "answerD",
        ].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium capitalize mb-1">
              {field.replace("answer", "Answer ")}
            </label>
            <input
              type="text"
              className="w-full border px-2 py-1 rounded"
              value={editingQuestion[field] || ""}
              onChange={(e) =>
                setEditingQuestion({ ...editingQuestion, [field]: e.target.value })
              }
            />
          </div>
        ))}

        {/* Correct Answer */}
        <div>
          <label className="block text-sm font-medium mb-1">Correct Answer</label>
          <select
            className="w-full border px-2 py-1 rounded"
            value={editingQuestion.answerCorrect}
            onChange={(e) =>
              setEditingQuestion({ ...editingQuestion, answerCorrect: e.target.value })
            }
          >
            <option value="">Select Correct Option</option>
            {["A", "B", "C", "D"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium mb-1">Year</label>
          <input
            type="text"
            className="w-full border px-2 py-1 rounded"
            value={editingQuestion.questionYear || ""}
            onChange={(e) =>
              setEditingQuestion({ ...editingQuestion, questionYear: e.target.value })
            }
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex justify-end gap-2">
        <button
          className="px-4 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400"
          onClick={() => setEditModalOpen(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          onClick={handleUpdateQuestion}
        >
          Update
        </button>
      </div>
    </div>
  </div>
)}


      {/* Modal Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
            <h2 className="text-lg font-semibold mb-4">Extracted Questions</h2>
            <div className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-80">
              {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}

              <div className="overflow-auto max-h-80 border rounded">
                <table className="min-w-full text-sm border-collapse">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-2 py-1 border">#</th>
                      <th className="px-2 py-1 border">Title</th>
                      <th className="px-2 py-1 border">Question</th>
                      <th className="px-2 py-1 border">A</th>
                      <th className="px-2 py-1 border">B</th>
                      <th className="px-2 py-1 border">C</th>
                      <th className="px-2 py-1 border">D</th>
                      <th className="px-2 py-1 border">Correct</th>
                      {/* <div className="flex gap-2">

                      <th className="px-2 py-1 border">Board</th>
                      <th className="px-2 py-1 border">Exam</th>
                      </div>
                      <div className="flex gap-2">
                        <th className="px-2 py-1 border">Subejct</th>
                      <th className="px-2 py-1 border">Topic</th>
                      <th className="px-2 py-1 border">Round</th>
                      </div> */}
                
                    </tr>
                  </thead>
                  <tbody>
                    {data?.map((item, index) => (
                      <tr key={index} className="even:bg-gray-50">
                        <td className="px-2 py-1 border text-center">
                          {index + 1}
                        </td>
                        <td className="px-2 py-1 border">
                          {item.questionTitle}
                        </td>
                        <td className="px-2 py-1 border">
                          {item.questionText}
                        </td>
                        <td className="px-2 py-1 border">{item.answerA}</td>
                        <td className="px-2 py-1 border">{item.answerB}</td>
                        <td className="px-2 py-1 border">{item.answerC}</td>
                        <td className="px-2 py-1 border">{item.answerD}</td>
                        <td className="px-2 py-1 border font-bold text-green-600">
                          {item.answerCorrect}
                        </td>
                        {/* <div className="flex gap-2">

                      <th className="px-2 py-1 border">{
                          examBoards.find(
                            (board) => board.id === selectedBoardId
                          )?.examBoardShortName?.toUpperCase()
                        
                        }</th>
                      <th className="px-2 py-1 border">{
                          examBoards.find(
                            (board) => board.id === selectedBoardId
                          )?.examName?.toUpperCase()
                        }</th>
                      </div>
                      <div className="flex gap-2">
                        <th className="px-2 py-1 border">{
                          subjects.find(
                            (subject) => subject.id === selectedSubjectId
                          )?.subjectName.toUpperCase()

                          }</th>
                      <th className="px-2 py-1 border">{
                          topics.find((topic) => topic.id === selectedTopicId)
                            ?.topicName.toUpperCase()
                        }</th>
                      <th className="px-2 py-1 border">{
                          rounds.find((round) => round.id === selectedRoundId)
                            ?.roundName.toUpperCase()
                        }</th>
                      </div> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => {
                  handleSubmitToBackend();
                  setIsModalOpen(false);
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table of all questions */}
      <div className="py-5">
        <TablePagination
          examBoards={examBoards}
          questions={questions}
          subjects={subjects}
          rounds={rounds}
          topics={topics}
          component="question"
          handleEdit={handleEdit}
        />
      </div>
    </div>
  );
}
