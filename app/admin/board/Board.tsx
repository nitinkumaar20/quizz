"use client";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalDataStore } from "../../stores/globalDataStores";
import { ExamBoard } from "../../stores/globalDataStores";

export default function ExamBoardManager() {
  const { examBoards, fetchExamBoards } = useGlobalDataStore();

  const [formData, setFormData] = useState<ExamBoard>({
    examBoardType: "",
    examBoardLongName: "",
    examBoardShortName: "",
    examName: "",
    boardLogo: "none",
    examLogo: "none",
    active: false,
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);

  // POST new board
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_EXAMBOARD_API_KEY}`,
        formData
      );
      setFormData({
        examBoardType: "",
        examBoardLongName: "",
        examBoardShortName: "",
        examName: "",
        boardLogo: "none",
        examLogo: "none",
        active: false,
      });
      fetchExamBoards(); // refetch after post
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message?.meta) {
        console.error(
          "Error submitting exam board:",
          err.response.data.message.meta.target
        );
        Swal.fire({
          title: "Error!",
          text: "Error submitting exam board",
          icon: "error",
          confirmButtonText: "Ok",
        });
      } else {
        console.error("An unknown error occurred:", err);
      }
    }
  };

  const handleEdit = (id: string | undefined) => {
    if (!id) return;

    const boardToEdit = examBoards.find((board) => board.id === id);
    if (boardToEdit) {
      setFormData({
        examBoardType: boardToEdit.examBoardType,
        examBoardLongName: boardToEdit.examBoardLongName,
        examBoardShortName: boardToEdit.examBoardShortName,
        examName: boardToEdit.examName,
        boardLogo: boardToEdit.boardLogo,
        examLogo: boardToEdit.examLogo,
        active: boardToEdit.active,
      });
      setEditId(id);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!editId) return;

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_EXAMBOARD_API_KEY}/${editId}`,
        formData
      );
      Swal.fire({
        title: "Updated!",
        text: "Exam board updated successfully.",
        icon: "success",
      });
      setIsEditModalOpen(false);
      setEditId(undefined);
      setFormData({
        examBoardType: "",
        examBoardLongName: "",
        examBoardShortName: "",
        examName: "",
        boardLogo: "none",
        examLogo: "none",
        active: false,
      });
      fetchExamBoards();
    } catch {
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while updating.",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    fetchExamBoards();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "examBoardType"
          ? value.toUpperCase()
          : type === "checkbox"
          ? checked
          : value,
    }));
  };

  return (
    <div className=" ">
      <h1 className="text-2xl font-bold mb-4 mx-10">Add New Exam Board</h1>
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit Exam Board</h2>
            <div className="space-y-3">
              <select
                name="examBoardType"
                value={formData.examBoardType}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              >
                <option value="" disabled>
                  Select Exam Board Type
                </option>
                <option value="CENTRAL">CENTRAL</option>
                <option value="SPECIAL">SPECIAL</option>
                <option value="STATE">STATE</option>
              </select>

              <input
                type="text"
                name="examBoardLongName"
                placeholder="Exam Board Long Name"
                value={formData.examBoardLongName}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="examBoardShortName"
                placeholder="Exam Board Short Name"
                value={formData.examBoardShortName}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="examName"
                placeholder="Exam Name"
                value={formData.examName}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                  className="accent-[--secondary]"
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
                  className="bg-[--secondary] text-white px-4 py-2 rounded"
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
        <select
          name="examBoardType"
          value={formData.examBoardType}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="" disabled>
            Select Exam Board Type
          </option>
          <option value="CENTRAL">CENTRAL</option>
          <option value="SPECIAL">SPECIAL</option>
          <option value="STATE">STATE</option>
        </select>

        <input
          type="text"
          name="examBoardLongName"
          placeholder="Exam Board Long Name"
          value={formData.examBoardLongName}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="examBoardShortName"
          placeholder="Exam Board Short Name"
          value={formData.examBoardShortName}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="examName"
          placeholder="Exam Name"
          value={formData.examName}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={(e) =>
              setFormData({ ...formData, active: e.target.checked })
            }
            className="accent-[--secondary]"
          />
          <span>Is Active?</span>
        </label>

        <button
          type="submit"
          className="bg-[--secondary] text-white px-4 py-2 rounded"
        >
          Add Exam Board
        </button>
      </form>

      {/* Table */}
      <div className="mt-8 mx-10">
        <h2 className="text-xl font-semibold mb-2">All Exam Boards</h2>
        {examBoards.length > 0 ? (
          <div className="w-full border rounded bg-white">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-gray-100 z-10">
                <tr>
                  <th className="p-2 border">Type</th>
                  <th className="p-2 border">Long Name</th>
                  <th className="p-2 border">Short Name</th>
                  <th className="p-2 border">Exam Name</th>
                  <th className="p-2 border">Active</th>
                  <th className="p-2 border">Edit</th>
                </tr>
              </thead>
              <tbody>
                {examBoards.map((board, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-2 border">{board.examBoardType}</td>
                    <td className="p-2 border">{board.examBoardLongName}</td>
                    <td className="p-2 border">{board.examBoardShortName}</td>
                    <td className="p-2 border">{board.examName}</td>
                    <td className="p-2 border">
                      {board.active ? "Yes" : "No"}
                    </td>
                    <td className="p-2 border">
                      <svg
                        className="w-8 h-8 text-black hover:text-[#ff0101] "
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => handleEdit(board.id)}
                      >
                        <path
                          d="m18.945 9.188-4-4m4 4-4.999 4.998c-.659.659-1.458 1.179-2.376 1.337-.927.16-2.077.213-2.626-.335-.548-.549-.495-1.7-.335-2.626.158-.918.678-1.717 1.337-2.376l4.998-4.998m4 4s3-3 1-5-5 1-5 1M20.5 12c0 6.5-2 8.5-8.5 8.5s-8.5-2-8.5-8.5 2-8.5 8.5-8.5"
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
          <p>No exam boards found.</p>
        )}
      </div>
    </div>
  );
}
