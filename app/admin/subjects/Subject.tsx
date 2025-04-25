"use client";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";

interface Subject {
  id?: string;
  subjectName: string;
  examId: number | null;
  ownerId: number | null;
  active: boolean;
  accessType: "PUBLIC" | "PRIVATE";
}

export default function SubjectManager() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [formData, setFormData] = useState<Subject>({
    subjectName: "",
    examId: null,
    ownerId: null,
    active: false,
    accessType: "PUBLIC",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  interface ExamBoard {
    id: number;
    examName: string;
    examBoardShortName: string;
  }

  const [examBoards, setExamBoards] = useState<ExamBoard[]>([]);
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedBoard, setSelectedBoard] = useState<string>("");
  const [editExamName, setEditExamName] = useState<string>("");
  const [editBoardShortName, setEditBoardShortName] = useState<string>("");

  // Fetch subjects
  const fetchSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:1100/api/subject/");
      setSubjects(res.data.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchExamBoards();
  }, []);

  const fetchExamBoards = async () => {
    try {
      const res = await axios.get("http://localhost:1100/api/examboard");
      console.log(res, "res");
      setExamBoards(res.data.data);
    } catch (err) {
      console.error("Failed to fetch exam boards", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : ["examId", "ownerId"].includes(name)
          ? value === ""
            ? null // Store null for empty input
            : Number(value) // Convert to number if not empty
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const matchedExamBoard = examBoards.find(
      (eb) =>
        eb.examName === selectedExam && eb.examBoardShortName === selectedBoard
    );

    if (!matchedExamBoard) {
      Swal.fire("Error", "Matching Exam and Board not found", "error");
      return;
    }

    const submitData = {
      ...formData,
      examId: matchedExamBoard.id,
      ownerId: 1, // Replace with actual user ID if needed
    };

    try {
      await axios.post("http://localhost:1100/api/subject/", submitData);
      Swal.fire("Success", "Subject created successfully", "success");
      setFormData({
        subjectName: "",
        examId: null,
        ownerId: null,
        active: false,
        accessType: "PUBLIC",
      });
      setSelectedExam("");
      setSelectedBoard("");
      fetchSubjects();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Error submitting subject:", err.response?.data || err.message);
      } else {
        console.error("Unexpected error:", err);
      }
      Swal.fire("Error", "Failed to submit subject", "error");
    }
  };

  const handleEdit = (id: string | undefined) => {
    const subjectToEdit = subjects.find((s) => s.id === id);
    if (subjectToEdit) {
      setFormData(subjectToEdit);
      setEditId(id);

      const matchingBoard = examBoards.find(
        (eb) => eb.id === subjectToEdit.examId
      );
      setEditExamName(matchingBoard?.examName || "");
      setEditBoardShortName(matchingBoard?.examBoardShortName || "");

      setIsEditModalOpen(true);
    }
  };
  const handleSaveEdit = async () => {
    if (!editId) return;

    const matchedExamBoard = examBoards.find(
      (eb) =>
        eb.examName === editExamName &&
        eb.examBoardShortName === editBoardShortName
    );

    if (!matchedExamBoard) {
      Swal.fire("Error", "Matching Exam and Board not found", "error");
      return;
    }

    const updateData = {
      subjectName: formData.subjectName,
      accessType: formData.accessType,
      active: formData.active,
      examId: matchedExamBoard.id,
      ownerId: 1, // TEMP: Hardcoded user ID (adjust based on your logic)
    };

    console.log("🚀 Update Payload:", updateData);

    try {
      await axios.put(
        `http://localhost:1100/api/subject/${editId}`,
        updateData
      );
      Swal.fire("Updated!", "Subject updated successfully.", "success");

      setIsEditModalOpen(false);
      setEditId(undefined);
      setFormData({
        subjectName: "",
        examId: null,
        ownerId: null,
        active: false,
        accessType: "PUBLIC",
      });
      setEditExamName("");
      setEditBoardShortName("");
      fetchSubjects();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("PUT error:", error.response?.data || error.message);
        Swal.fire(
          "Error",
          error.response?.data?.message?.[0]?.message ||
            "Failed to update subject",
          "error"
        );
      } else {
        console.error("Unexpected error:", error);
        Swal.fire("Error", "An unexpected error occurred", "error");
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 mx-10">Add New Subject</h1>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit Subject</h2>
            <div className="space-y-3">
              <input
                type="text"
                name="subjectName"
                placeholder="Subject Name"
                value={formData.subjectName}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <select
                value={editExamName}
                onChange={(e) => setEditExamName(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Exam</option>
                {[...new Set(examBoards.map((eb) => eb.examName))].map(
                  (exam, i) => (
                    <option key={i} value={exam.trim()}>
                      {exam.toUpperCase()}
                    </option>
                  )
                )}
              </select>

              <select
                value={editBoardShortName}
                onChange={(e) => setEditBoardShortName(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Board</option>
                {[
                  ...new Set(examBoards.map((eb) => eb.examBoardShortName)),
                ].map((board, i) => (
                  <option key={i} value={board}>
                    {board.toUpperCase()}
                  </option>
                ))}
              </select>

              <select
                name="accessType"
                value={formData.accessType}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="PUBLIC">PUBLIC</option>
                <option value="PRIVATE">PRIVATE</option>
              </select>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                />
                <span>Is Active?</span>
              </label>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-3 max-w-md mx-10 flex flex-col justify-start items-start"
      >
        <input
          type="text"
          name="subjectName"
          placeholder="Subject Name"
          value={formData.subjectName}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <select
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Exam</option>
          {[...new Set(examBoards.map((eb) => eb.examName))].map((exam, i) => (
            <option key={i} value={exam}>
              {exam.toUpperCase()}
            </option>
          ))}
        </select>

        <select
          value={selectedBoard}
          onChange={(e) => setSelectedBoard(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Board</option>
          {[...new Set(examBoards.map((eb) => eb.examBoardShortName))].map(
            (board, i) => (
              <option key={i} value={board}>
                {board.toUpperCase()}
              </option>
            )
          )}
        </select>

        <select
          name="accessType"
          value={formData.accessType}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="PUBLIC">PUBLIC</option>
          <option value="PRIVATE">PRIVATE</option>
        </select>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={(e) =>
              setFormData({ ...formData, active: e.target.checked })
            }
          />
          <span>Is Active?</span>
        </label>
        <button
          type="submit"
          className="bg-[--secondary] text-white px-4 py-2 rounded"
        >
          Add Subject
        </button>
      </form>

      {/* Table */}
      <div className="mt-8 mx-10">
        <h2 className="text-xl font-semibold mb-2">All Subjects</h2>
        {subjects.length > 0 ? (
          <div className="w-full border rounded bg-white">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-gray-100 z-10">
                <tr>
                  <th className="p-2 border">Subject</th>
                  <th className="p-2 border">Exam</th>
                  <th className="p-2 border">Board</th>

                  <th className="p-2 border">Access</th>
                  <th className="p-2 border">Active</th>
                  <th className="p-2 border">Edit</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subj, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-2 border">{subj.subjectName}</td>
                    <td className="p-2 border">
                      {examBoards.find((eb) => eb.id === subj.examId)
                        ?.examName.toUpperCase() || "N/A"}
                    </td>
                    <td className="p-2 border">
                      {examBoards
                        .find((eb) => eb.id === subj.examId)
                        ?.examBoardShortName.toUpperCase() || "N/A"}
                    </td>

                    <td className="p-2 border">{subj.accessType}</td>
                    <td className="p-2 border">{subj.active ? "Yes" : "No"}</td>
                    <td className="p-2 border">
                      <svg
                        className="w-6 h-6 text-black hover:text-red-600 cursor-pointer"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => handleEdit(subj.id)}
                      >
                        <path
                          d="M18.945 9.188l-4-4m4 4l-4.999 4.998a6.22 6.22 0 01-2.376 1.337c-.927.16-2.077.213-2.626-.335-.548-.549-.495-1.7-.335-2.626a6.22 6.22 0 011.337-2.376l4.998-4.998m4 4s3-3 1-5-5 1-5 1M20.5 12c0 6.5-2 8.5-8.5 8.5S3.5 18.5 3.5 12 5.5 3.5 12 3.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No subjects found.</p>
        )}
      </div>
    </div>
  );
}
