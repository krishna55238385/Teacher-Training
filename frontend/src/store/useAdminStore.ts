import { create } from 'zustand';
import type { TeacherProfile } from '../types';
import api from '../services/api';

interface AdminState {
    teachers: TeacherProfile[];
    isLoading: boolean;
    error: string | null;
    fetchTeachers: () => Promise<void>;
    fetchTeacherById: (id: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
    teachers: [],
    isLoading: false,
    error: null,
    fetchTeachers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/teachers');
            const teachers = response.data.map((t: any) => ({
                ...t,
                scenarioProgress: t.scenarioAttempts?.map((a: any) => ({
                    scenarioId: a.scenarioId,
                    status: a.status,
                    score: a.score
                })) || []
            }));
            set({ teachers, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },
    fetchTeacherById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/teachers/${id}`);
            const teacher = {
                ...response.data,
                scenarioProgress: response.data.scenarioAttempts?.map((a: any) => ({
                    scenarioId: a.scenarioId,
                    status: a.status,
                    score: a.score
                })) || []
            };
            set((state) => ({
                teachers: state.teachers.some(t => t.id === id)
                    ? state.teachers.map(t => t.id === id ? teacher : t)
                    : [...state.teachers, teacher],
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    }
}));
