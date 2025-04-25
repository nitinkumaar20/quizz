"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface Round {
  id?: string;
  roundName: string;
  sectionName: string;
  roundType: "MAIN" | "PRE" | "OTHER";
  examId: number | null;
  ownerId: number | null;
  accessType: "PUBLIC" | "PRIVATE";
  active: boolean;
}

interface ExamBoard {
  id: number;
  examName: string;
  examBoardShortName: string;
}

export default function RoundManager() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [formData, setFormData] = useState<Round>({
    roundName: "",
    sectionName: "",
    roundType: "MAIN",
    examId: null,
    ownerId: null,
    accessType: "PUBLIC",
    active: true,
  });

  const [examBoards, setExamBoards] = useState<ExamBoard[]>([]);
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedBoard, setSelectedBoard] = useState<string>("");

  useEffect(() => {
    fetchRounds();
    fetchExamBoards();
  }, []);

  const fetchRounds = async () => {
    try {
      const res = await axios.get("http://localhost:1100/api/round");
      setRounds(res.data.data);
    } catch (err) {
      console.error("Failed to fetch rounds", err);
    }
  };

  const fetchExamBoards = async () => {
    try {
      const res = await axios.get("http://localhost:1100/api/examboard");
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
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const matchedExamBoard = examBoards.find(
      (eb) =>
        eb.examName === selectedExam &&
        eb.examBoardShortName === selectedBoard
    );

    if (!matchedExamBoard) {
      Swal.fire("Error", "Matching Exam and Board not found", "error");
      return;
    }

    const submitData = {
      ...formData,
      examId: matchedExamBoard.id,
      ownerId: 1,
    };

    try {
      await axios.post("http://localhost:1100/api/round", submitData);
      Swal.fire("Success", "Round created successfully", "success");
      setFormData({
        roundName: "",
        sectionName: "",
        roundType: "MAIN",
        examId: null,
        ownerId: null,
        accessType: "PUBLIC",
        active: true,
      });
      setSelectedExam("");
      setSelectedBoard("");
      fetchRounds();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Error submitting round:", err.response?.data || err.message);
      } else {
        console.error("Unexpected error:", err);
      }
      Swal.fire("Error", "Failed to submit round", "error");
    }
  };

  return (
    <div className="mx-10">
      <h1 className="text-2xl font-bold mb-4">Add New Round</h1>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
        <input
          type="text"
          name="roundName"
          placeholder="Round Name"
          value={formData.roundName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="sectionName"
          placeholder="Section Name"
          value={formData.sectionName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <select
          name="roundType"
          value={formData.roundType}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="MAIN">MAIN</option>
          <option value="PRE">PRE</option>
          <option value="OTHER">OTHER</option>
        </select>

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
            onChange={handleChange}
          />
          <span>Is Active?</span>
        </label>

        <button
          type="submit"
          className="bg-[--secondary] text-white px-4 py-2 rounded"
        >
          Add Round
        </button>
      </form>

      {/* Table of Rounds */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">All Rounds</h2>
        {rounds.length > 0 ? (
          <div className="w-full border rounded bg-white">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Round</th>
                  <th className="p-2 border">Section</th>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Exam</th>
                  <th className="p-2 border">Board</th>
                  <th className="p-2 border">Access</th>
                  <th className="p-2 border">Active</th>
                </tr>
              </thead>
              <tbody>
                {rounds.map((round, i) => {
                  const eb = examBoards.find((e) => e.id === round.examId);
                  return (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="p-2 border">{round.roundName}</td>
                      <td className="p-2 border">{round.sectionName}</td>
                      <td className="p-2 border">{round.roundType}</td>
                      <td className="p-2 border">{eb?.examName || "N/A"}</td>
                      <td className="p-2 border">
                        {eb?.examBoardShortName || "N/A"}
                      </td>
                      <td className="p-2 border">{round.accessType}</td>
                      <td className="p-2 border">{round.active ? "Yes" : "No"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No rounds found.</p>
        )}
      </div>
    </div>
  );
}
