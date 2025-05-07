"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import { RoundType, useGlobalDataStore } from "../../stores/globalDataStores";
import { QuestionType } from "../../stores/globalDataStores";
import { TablePagination } from "@/app/components/Table";

export default function New() {
    const {
        examBoards,
        questions,
        subjects,
        rounds,
        topics,
        fetchQuestions,
        fetchRounds,
        fetchTopics,
        fetchExamBoards,
    } = useGlobalDataStore();
    console.log(questions, "questions");

    const [selectedBoard, setSelectedBoard] = useState("");

    const [roundMode, setRoundMode] = useState<boolean>(true);
    const [roundFormData, setRoundFormData] = useState<RoundType>({
        roundName: "",
        sectionName: "",
        examId: null,
        ownerId: null,
        active: false,
        roundType: "PRELIMS",
        accessType: "PUBLIC",
    });


    const [formData, setFormData] = useState<QuestionType>({
        questionText: "",
        questionTitle: "",
        answerA: "",
        answerB: "",
        answerC: "",
        answerD: "",
        answerCorrect: "A",
        topicId: null,
        roundId: null,
        active: true,
        questionYear: "",
    });

    const [editId, setEditId] = useState<string | undefined>(undefined);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchQuestions();
        fetchRounds();
        fetchTopics();
        fetchExamBoards();
    }, []);

    const resetForm = () => {
        setFormData({
            questionText: "",
            questionTitle: "",
            answerA: "",
            answerB: "",
            answerC: "",
            answerD: "",
            answerCorrect: "A",
            topicId: null,
            roundId: null,
            active: true,
            questionYear: "",
        });
        setEditId(undefined);
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : ["roundId", "topicId"].includes(name)
                        ? value === ""
                            ? null
                            : Number(value)
                        : value,
        }));

        console.log(formData, "formData ques");
    };

    const handleRoundChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setRoundFormData((prev) => ({
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

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_QUESTIONS_API_KEY}`,
                {...formData, roundId}
            );
            Swal.fire("Success", "Question added successfully", "success");
            resetForm();
            fetchQuestions();
        } catch (error) {
            console.error("Failed to add question", error);
            Swal.fire("Error", "Failed to add question", "error");
        }
    };

    const handleEdit = (id: string | undefined) => {
        const questionToEdit = questions.find((s) => s.id === id);
        if (questionToEdit) {
            setFormData(questionToEdit);
            setEditId(id);
        }
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!editId) return;

        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_QUESTIONS_API_KEY}/${editId}`,
                formData
            );
            Swal.fire("Updated!", "Question updated successfully.", "success");
            resetForm();
            setIsEditModalOpen(false);
            fetchQuestions();
        } catch (error) {
            console.error("Failed to update question", error);
            Swal.fire("Error", "Failed to update question", "error");
        }
    };

    const [selectedExam, setSelectedExam] = useState<string>("");
    const [roundId, setRoundId] = useState<number>(0);
    const roundSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const matchedExamBoard = examBoards.find(
            (eb) =>
                eb.examName.toLowerCase() === selectedExam.toLowerCase() &&
                eb.examBoardShortName === selectedBoard
        );

        if (!matchedExamBoard) {
            Swal.fire("Error", "Matching Exam and Board not found", "error");
            return;
        }

        const submitData = {
            roundName: roundFormData.roundName,
            sectionName: roundFormData.sectionName,
            active: roundFormData.active,
            roundType: roundFormData.roundType,
            accessType: roundFormData.accessType,
            examId: matchedExamBoard.id,
            ownerId: 1, // Replace with actual user ID if needed
        };
        console.log(submitData, "submitData");

        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_ROUNDS_API_KEY} `,
                submitData
            );
            Swal.fire("Success", "Round created successfully", "success");
            if (data.data && data.data.length > 0) {
                console.log(data.data);
                console.log(data.data[0]['id']);
                setRoundId(data.data[0]['id']);
                setRoundMode(false);
                setFormData((prev) => ({ ...prev, roundId }))
            }

        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                console.error(
                    "Error submitting subject:",
                    err.response?.data || err.message
                );
            } else {
                console.error("Unexpected error:", err);
            }
            Swal.fire("Error", "Failed to submit subject", "error");
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">{roundMode ? "New Round" : "Round Details"}</h1>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl space-y-4">
                        <h2 className="text-xl font-bold mb-4">Edit Question</h2>

                        <input
                            name="questionText"
                            value={formData.questionText}
                            onChange={handleChange}
                            placeholder="Question Text"
                            className="border p-2 w-full rounded"
                        />
                        <input
                            name="questionTitle"
                            value={formData.questionTitle}
                            onChange={handleChange}
                            placeholder="Question Title"
                            className="border p-2 w-full rounded"
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                name="answerA"
                                value={formData.answerA}
                                onChange={handleChange}
                                placeholder="Answer A"
                                className="border p-2 rounded"
                            />
                            <input
                                name="answerB"
                                value={formData.answerB}
                                onChange={handleChange}
                                placeholder="Answer B"
                                className="border p-2 rounded"
                            />
                            <input
                                name="answerC"
                                value={formData.answerC}
                                onChange={handleChange}
                                placeholder="Answer C"
                                className="border p-2 rounded"
                            />
                            <input
                                name="answerD"
                                value={formData.answerD}
                                onChange={handleChange}
                                placeholder="Answer D"
                                className="border p-2 rounded"
                            />
                        </div>

                        <select
                            name="answerCorrect"
                            value={formData.answerCorrect}
                            onChange={handleChange}
                            className="border p-2 w-full rounded"
                        >
                            <option value="A">Answer A</option>
                            <option value="B">Answer B</option>
                            <option value="C">Answer C</option>
                            <option value="D">Answer D</option>
                        </select>

                        <select
                            name="topicId"
                            value={formData.topicId ?? ""}
                            onChange={handleChange}
                            className="border p-2 w-full rounded"
                        >
                            <option value="">Select Topic</option>
                            {topics.map((topic) => (
                                <option key={topic.id} value={topic.id}>
                                    {topic.topicName}
                                </option>
                            ))}
                        </select>

                        <select
                            name="roundId"
                            value={formData.roundId ?? ""}
                            onChange={handleChange}
                            className="border p-2 w-full rounded"
                        >
                            <option value="">Select Round</option>
                            {rounds.map((round) => (
                                <option key={round.id} value={round.id}>
                                    {round.roundName} - {round.sectionName}
                                </option>
                            ))}
                        </select>

                        <input
                            name="questionYear"
                            value={formData.questionYear}
                            onChange={handleChange}
                            placeholder="Question Year"
                            className="border p-2 w-full rounded"
                        />

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="active"
                                checked={formData.active}
                                onChange={handleChange}
                            />
                            Active
                        </label>

                        <div className="flex justify-end gap-4">
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
            )}

            {
                roundMode ?
                    (
                        <form
                            onSubmit={roundSubmit}
                            className="space-y-4 max-w-5xl bg-white p-6 rounded-lg shadow-md"
                        >
                            <input
                                type="text"
                                name="roundName"
                                placeholder="Round Name"
                                value={roundFormData.roundName}
                                onChange={handleRoundChange}
                                required
                                className="w-full border p-2 rounded"
                            />

                            <input
                                type="text"
                                name="sectionName"
                                placeholder="Section Name"
                                value={roundFormData.sectionName}
                                onChange={handleRoundChange}
                                className="w-full border p-2 rounded"
                            />
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
                                value={selectedExam}
                                onChange={(e) => setSelectedExam(e.target.value)}
                                className="w-full border p-2 rounded"
                                required
                            >
                                <option value="">Select Exam</option>
                                {examBoards
                                    .filter(
                                        (eb) =>
                                            eb.examBoardShortName.toLowerCase() ===
                                            selectedBoard.toLowerCase()
                                    )
                                    .map((exam, i) => (
                                        <option key={i} value={exam.examName}>
                                            {exam.examName.toUpperCase()}
                                        </option>
                                    ))}
                            </select>

                            <select
                                name="roundType"
                                value={roundFormData.roundType}
                                onChange={handleRoundChange}
                                className="w-full border p-2 rounded"
                            >
                                <option value="MAIN">MAIN</option>
                                <option value="PRELIMS">PRELIMS</option>
                            </select>

                            <select
                                name="accessType"
                                value={roundFormData.accessType}
                                onChange={handleRoundChange}
                                className="w-full border p-2 rounded"
                            >
                                <option value="PRIVATE">PRIVATE</option>
                                <option value="PUBLIC">PUBLIC</option>
                            </select>

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="active"
                                    checked={roundFormData.active}
                                    onChange={(e) =>
                                        setRoundFormData({ ...roundFormData, active: e.target.checked })
                                    }
                                />
                                <span>Is Active?</span>
                            </label>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                SAVE
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-4 max-w-5xl bg-white p-6 rounded-lg shadow-md mb-4">
                            <div className="grid grid-cols-2 gap-2">
                                <div>Round Name : {roundFormData.roundName}</div>
                                <div>Section Name : {roundFormData.sectionName}</div>
                                <div>Board : {selectedBoard}</div>
                                <div>Exam Name : {selectedExam}</div>
                                <div>Round Type : {roundFormData.roundType}</div>
                                <div>Access Mode : {roundFormData.accessType}</div>
                            </div>
                        </div>
                    )
            }

            {/* Add New Question Form */}
            {
                roundMode === false &&
                (
                    <>
                        <h1 className="text-2xl font-bold mb-6">{"Question"}</h1>
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 max-w-5xl bg-white p-6 rounded-lg shadow-md"
                        >
                            <input
                                name="questionTitle"
                                value={formData.questionTitle}
                                onChange={handleChange}
                                placeholder="Question Title"
                                className="w-full border p-2 rounded"
                            />
                            <textarea
                                name="questionText"
                                value={formData.questionText}
                                onChange={handleChange}
                                placeholder="Question Text"
                                required
                                className="w-full border p-2 rounded resize-none"
                            />

                            <div className="grid grid-cols-1 gap-2">
                                <input
                                    name="answerA"
                                    value={formData.answerA}
                                    onChange={handleChange}
                                    placeholder="Answer A"
                                    className="border p-2 rounded"
                                />
                                <input
                                    name="answerB"
                                    value={formData.answerB}
                                    onChange={handleChange}
                                    placeholder="Answer B"
                                    className="border p-2 rounded"
                                />
                                <input
                                    name="answerC"
                                    value={formData.answerC}
                                    onChange={handleChange}
                                    placeholder="Answer C"
                                    className="border p-2 rounded"
                                />
                                <input
                                    name="answerD"
                                    value={formData.answerD}
                                    onChange={handleChange}
                                    placeholder="Answer D"
                                    className="border p-2 rounded"
                                />
                            </div>

                            <select
                                name="answerCorrect"
                                value={formData.answerCorrect}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                            >
                                <option value="">Correct Answer</option>
                                <option value="A">Answer A</option>
                                <option value="B">Answer B</option>
                                <option value="C">Answer C</option>
                                <option value="D">Answer D</option>
                            </select>

                            {/* <select
          value={selectedSubject || ""}
          onChange={(e) => setselectedSubject(e.target.value)}
          onBlur={(e) => setselectedSubject(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Subject</option>
          {subjects.map((subject) => {
            const label = subject.subjectName.toUpperCase();
            const examBoard = examBoards.find(
              (eb) => Number(eb.id) === subject.examId
            );
            if (
              examBoard?.examName.toLowerCase() !==
              selectedExamName.toLowerCase()
            )
              return null; // Filter subjects based on selected exam

            return (
              <option key={subject.id} value={subject.id}>
                {label}
              </option>
            );
          })}
        </select>

        <select
          name="topicId"
          value={formData.topicId ?? ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select topic</option>
          {topics.map((topic) => {
            const label = topic.topicName.toUpperCase();
            const subject = subjects.find(
              (s) => Number(s.id) === topic.subjectId
            );
            if (Number(subject?.id) !== Number(selectedSubject)) return null; // Filter topics based on selected subject

            return (
              <option key={topic.id} value={topic.id}>
                {label}
              </option>
            );
          })}
        </select> */}


                            {/* <input
          name="questionYear"
          value={formData.questionYear}
          onChange={handleChange}
          placeholder="Question Year"
          className="w-full border p-2 rounded"
        /> */}

                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                            >
                                Add Question
                            </button>
                        </form>
                    </>
                )}

            {/* Question Table */}
            {
                roundMode === false &&
                (<div className="mt-10">
                    <h2 className="text-xl font-bold mb-4">All Questions</h2>
                    <div className="overflow-x-auto">
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
                </div>)}
        </div>
    );
}
