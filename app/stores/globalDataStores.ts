// src/stores/globalDataStore.ts
import { create } from "zustand";
import axios from "axios";
import Swal from "sweetalert2";

export interface ExamBoardType {
  id?: string;
  examBoardType: string;
  examBoardLongName: string;
  examBoardShortName: string;
  examName: string;
  boardLogo: string;
  examLogo: string;
  active: boolean;
}

export interface SubjectType {
  id?: string;
  subjectName: string;
  examId: number | null;
  ownerId: number | null;
  active: boolean;
  accessType: "PUBLIC" | "PRIVATE";
}

export interface TopicType {
  id?: string;
  topicName: string;
  subjectId: number | null;
  active: boolean;
}

export interface RoundType {
  id?: string;
  roundName: string;
  sectionName: string;
  examId: number | null;
  ownerId: number | null;
  active: boolean;
  roundType: "PRELIMS" | "MAIN";
  accessType: "PUBLIC" | "PRIVATE";
}

export interface QuestionType {
  id?: string;
  questionText: string;
  questionTitle: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  answerCorrect: string;
  topicId: number | null;
  roundId: number | null;
  active: boolean;
  questionYear: string;
}

interface GlobalDataState {
  examBoards: ExamBoardType[];
  subjects: SubjectType[];
  topics: TopicType[];
  rounds: RoundType[];
  questions: QuestionType[];
  loading: boolean;
  fetchExamBoards: () => Promise<void>;
  addExamBoard: (payload: ExamBoardType) => boolean;
  updateExamBoard: (payload: ExamBoardType) => boolean;
  fetchSubjects: () => Promise<void>;
  fetchTopics: () => Promise<void>;
  fetchRounds: () => Promise<void>;
  fetchQuestions: () => Promise<void>;
  addQuestions: (payload: QuestionType) => boolean;
  updateQuestion: (payload: QuestionType) => boolean;
  showAlert: (params: {
    icon?: "success" | "error" | "warning" | "info" | "question";
    title?: string;
    text?: string;
    confirmButtonText?: string;
  }) => void;
}

export const useGlobalDataStore = create<GlobalDataState>((set, get) => ({
  examBoards: [],
  subjects: [],
  topics: [],
  rounds: [],
  questions: [],
  loading: false,

  fetchExamBoards: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_EXAMBOARD_API_KEY}`
      );
      set({ examBoards: res.data.data ? res.data.data : [] });
      // Check if the response is an array and set it accordingly
    } catch (error) {
    } finally {
      set({ loading: false });
    }
  },

  addExamBoard: (payload: ExamBoardType) => {
    const { examBoards } = get();
    console.log(payload, "payload");

    const newExamBoards: ExamBoardType[] = [...examBoards, payload];
    console.log(newExamBoards, "newExamBoards");

    set((state) => ({ ...state, examBoards: newExamBoards }));
    return true;
  },

  updateExamBoard: (payload: ExamBoardType) => {
    let res = false;
    const { examBoards } = get();
    const newExamBoards: ExamBoardType[] = [];
    examBoards.forEach((e) => {
      if (e.id === payload.id) {
        newExamBoards.push(payload);
        res = true;
      } else newExamBoards.push(e);
    });
    set((state) => ({ ...state, examBoards: newExamBoards }));
    return res;
  },

  fetchSubjects: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SUBJECTS_API_KEY}`
      );
      set({ subjects: res.data.data ? res.data.data : [] });
    } catch (error) {
      // console.error("Error fetching subjects:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchTopics: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_TOPICS_API_KEY}`);
      set({ topics: res.data.data ? res.data.data : [] });
    } catch (error) {
      // console.error("Error fetching topics:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchRounds: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_ROUNDS_API_KEY}`);
      set({ rounds: res.data.data ? res.data.data : [] });
    } catch (error) {
      // console.error("Error fetching rounds:", error);
    } finally {
      set({ loading: false });
    }
  },
  fetchQuestions: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_QUESTIONS_API_KEY}`
      );
      // console.log(res, "log");

      set({ questions: res.data.data ? res.data.data : [] });
    } catch (error) {
      // console.error("Error fetching rounds:", error);
    } finally {
      set({ loading: false });
    }
  },

  addQuestions: (payload: QuestionType | QuestionType[]) => {
    const { questions } = get();

    const newQuestions = Array.isArray(payload)
      ? [...questions, ...payload]
      : [...questions, payload];

    set((state) => ({ ...state, questions: newQuestions }));

    return true;
  },
updateQuestion: (payload: QuestionType) => {
  const { questions } = get();
  let res = false;
console.log(payload ,'payload');

  const updatedQuestions = questions.map((q) => {
    if (q.id === payload.id) {
      res = true;
      return payload; // Replace the matching question
    }
    return q;
  });
console.log(updatedQuestions ,'updated qu');

  set((state) => ({ ...state, questions: updatedQuestions }));
  return res;
},

// updateExamBoard: (payload: ExamBoardType) => {
//     let res = false;
//     const { examBoards } = get();
//     const newExamBoards: ExamBoardType[] = [];
//     examBoards.forEach((e) => {
//       if (e.id === payload.id) {
//         newExamBoards.push(payload);
//         res = true;
//       } else newExamBoards.push(e);
//     });
//     set((state) => ({ ...state, examBoards: newExamBoards }));
//     return res;
//   },

  showAlert: ({
    icon = "info",
    title = "Alert",
    text = "",
    confirmButtonText = "OK",
  }) => {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonText,
    });
  },
}));
