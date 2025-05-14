"use client";
import { create } from "zustand";
import axios from "axios";
import Swal from "sweetalert2";

// ================== Types ==================
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

// ============== Zustand Store Interface ==============
interface GlobalDataState {
  examBoards: ExamBoardType[];
  subjects: SubjectType[];
  topics: TopicType[];
  rounds: RoundType[];
  questions: QuestionType[];
  loading: boolean;

  selectedExam: string;
  selectedBoard: string;
  editExamName: string;
  editBoardShortName: string;
  isEditModalOpen: boolean;
  setSelectedExam: (value: string) => void;
  setSelectedBoard: (value: string) => void;
  setEditExamName: (value: string) => void;
  setEditBoardShortName: (value: string) => void;
  setIsEditModalOpen: (value: boolean) => void;

  fetchExamBoards: () => Promise<void>;
  addExamBoard: (payload: ExamBoardType) => boolean;
  updateExamBoard: (payload: ExamBoardType) => boolean;

  fetchSubjects: () => Promise<void>;
  fetchTopics: () => Promise<void>;
  fetchRounds: () => Promise<void>;
  fetchQuestions: () => Promise<void>;

  addQuestions: (payload: QuestionType | QuestionType[]) => boolean;
  updateQuestion: (payload: QuestionType) => boolean;
  addSubjects: (payload: SubjectType) => boolean;
  updateSubject: (payload: SubjectType) => boolean;
//  updateTopic
  addTopic: (payload: TopicType) => boolean;
  updateTopic: (payload:TopicType) => boolean;
  showAlert: (params: {
    icon?: "success" | "error" | "warning" | "info" | "question";
    title?: string;
    text?: string;
    confirmButtonText?: string;
  }) => void;
}

// ============== Zustand Store ==============
export const useGlobalDataStore = create<GlobalDataState>((set, get) => ({
  examBoards: [],
  subjects: [],
  topics: [],
  rounds: [],
  questions: [],
  loading: false,

  selectedExam: "",
  selectedBoard: "",
  editExamName: "",
  editBoardShortName: "",
  isEditModalOpen: false,
 

  setSelectedExam: (value: string) => set({ selectedExam: value }),
  setSelectedBoard: (value: string) => set({ selectedBoard: value }),
  setEditExamName: (value: string) => set({ editExamName: value }),
  setEditBoardShortName: (value: string) => set({ editBoardShortName: value }),
  setIsEditModalOpen: (value: boolean) => set({ isEditModalOpen: value }),

  fetchExamBoards: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_EXAMBOARD_API_KEY}`
      );
      set({ examBoards: res.data.data ?? [] });
    } catch (error) {
      console.error("Error fetching exam boards:", error);
    } finally {
      set({ loading: false });
    }
  },

  addExamBoard: (payload: ExamBoardType) => {
    const { examBoards } = get();
    const newExamBoards: ExamBoardType[] = [...examBoards, payload];
    set({ examBoards: newExamBoards });
    return true;
  },

  updateExamBoard: (payload: ExamBoardType) => {
    const { examBoards } = get();
    let updated = false;
    const newExamBoards = examBoards.map((board) => {
      if (board.id === payload.id) {
        updated = true;
        return payload;
      }
      return board;
    });
    set({ examBoards: newExamBoards });
    return updated;
  },

  fetchSubjects: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SUBJECTS_API_KEY}`
      );
      set({ subjects: res.data.data ?? [] });
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      set({ loading: false });
    }
  },

   addSubjects: (payload: SubjectType) => {
    const { subjects } = get();
    const newSubjects: SubjectType[] = [...subjects, payload];
    set({ subjects: newSubjects });
    return true;
  },

  updateSubject: (payload: SubjectType) => {
    const { subjects } = get();
    let updated = false;
    const newSubjects = subjects.map((subject) => {
      if (subject.id === payload.id) {
        updated = true;
        return payload;
      }
      return subject;
    });
    set({ subjects: newSubjects});
    return updated;
  },

  fetchTopics: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_TOPICS_API_KEY}`);
      set({ topics: res.data.data ?? [] });
    } catch (error) {
      console.error("Error fetching topics:", error);
    } finally {
      set({ loading: false });
    }
  },

   addTopic: (payload: TopicType) => {
    const { topics } = get();
    const newTopics: TopicType[] = [...topics, payload];
    set({ topics:newTopics });
    return true;
  },

  updateTopic: (payload: TopicType) => {
  const { topics } = get();
    let updated = false;
    const newTopics = topics.map((topic) => {
      if (topic.id === payload.id) {
        updated = true;
        return payload;
      }
      return topic;
    });
      set({ topics:newTopics });
    return updated;
  },


  fetchRounds: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_ROUNDS_API_KEY}`);
      set({ rounds: res.data.data ?? [] });
    } catch (error) {
      console.error("Error fetching rounds:", error);
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
      set({ questions: res.data.data ?? [] });
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      set({ loading: false });
    }
  },

  addQuestions: (payload: QuestionType | QuestionType[]) => {
    const { questions } = get();
    const newQuestions = Array.isArray(payload)
      ? [...questions, ...payload]
      : [...questions, payload];
    set({ questions: newQuestions });
    return true;
  },

  updateQuestion: (payload: QuestionType) => {
    const { questions } = get();
    let updated = false;
    const updatedQuestions = questions.map((q) => {
      if (q.id === payload.id) {
        updated = true;
        return payload;
      }
      return q;
    });
    set({ questions: updatedQuestions });
    return updated;
  },

  showAlert: ({
    icon = "info",
    title = "Alert",
    text = "",
    confirmButtonText = "OK",
  }) => {
    Swal.fire({ icon, title, text, confirmButtonText });
  },
}));
