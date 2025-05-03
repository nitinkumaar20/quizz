// src/stores/globalDataStore.ts
import { create } from "zustand";
import axios from "axios";

export interface ExamBoard {
    id?: string;
  examBoardType: string;
  examBoardLongName: string;
  examBoardShortName: string;
  examName: string;
  boardLogo: string;
  examLogo: string;
  active: boolean;
}

interface Subject {
  subjectName: string;
  examId: number;
  accessType: string;
  active: boolean;
}

interface Topic {
  topicName: string;
  subjectId: number;
  active: boolean;
}

interface Round {
  roundName: string;
  sectionName: string;
  roundType: string;
  examId: number;
  ownerId: number;
  accessType: string;
  active: boolean;
}

interface GlobalDataState {
 
  examBoards: ExamBoard[];
  subjects: Subject[];
  topics: Topic[];
  rounds: Round[];
  loading: boolean;
  fetchExamBoards: () => Promise<void>;
  fetchSubjects: (examId?: number) => Promise<void>;
  fetchTopics: (subjectId?: number) => Promise<void>;
  fetchRounds: (boardShortName?: string, examName?: string) => Promise<void>;

}


export const useGlobalDataStore = create<GlobalDataState>((set) => ({
  examBoards: [],
  subjects: [],
  topics: [],
  rounds: [],
  loading: false,

  fetchExamBoards: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_EXAMBOARD_API_KEY}`);
      set({ examBoards: (res.data.data)     ? res.data.data : [] });
      // Check if the response is an array and set it accordingly
    } catch (error) {
      console.error("Error fetching exam boards:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchSubjects: async (examId) => {
    set({ loading: true });
    try {
      let url = `${process.env.NEXT_PUBLIC_SUBJECTS_API_KEY}}`;
      if (examId) {
        url += `?examId=${examId}`;
      }
      const res = await axios.get(url);
      set({ subjects: Array.isArray(res.data) ? res.data : [] });
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchTopics: async (subjectId) => {
    set({ loading: true });
    try {
      let url = `${process.env.NEXT_PUBLIC_TOPICS_API_KEY}`;
      if (subjectId) {
        url += `?subjectId=${subjectId}`;
      }
      const res = await axios.get(url);
      set({ topics: Array.isArray(res.data) ? res.data : [] });
    } catch (error) {
      console.error("Error fetching topics:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchRounds: async (boardShortName, examName) => {
    set({ loading: true });
    try {
      let url = `${process.env.NEXT_PUBLIC_ROUNDS_API_KEY}`;
      const params = [];
      if (boardShortName) params.push(`board=${boardShortName}`);
      if (examName) params.push(`exam=${examName}`);
      if (params.length > 0) url += `?${params.join("&")}`;

      const res = await axios.get(url);
      set({ rounds: Array.isArray(res.data) ? res.data : [] });
    } catch (error) {
      console.error("Error fetching rounds:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
