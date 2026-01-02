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

interface ScenarioAttemptResponse {
    scenarioId: string;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    score?: number;
}

interface TeacherResponse {
    id: number;
    email: string;
    full_name: string;
    role: string;
    status: string;
    scenarioAttempts?: ScenarioAttemptResponse[];
    [key: string]: unknown;
}

export const useAdminStore = create<AdminState>((set) => ({
    teachers: [],
    isLoading: false,
    error: null,
    fetchTeachers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get<TeacherResponse[]>('/teachers');
            const teachers: TeacherProfile[] = response.data.map((t: TeacherResponse) => ({
                id: t.id.toString(),
                name: t.full_name,
                email: t.email,
                role: t.role.toUpperCase() as 'TEACHER' | 'ADMIN',
                phone: (t as TeacherResponse & { phone?: string }).phone || '',
                subject: (t as TeacherResponse & { subject?: string }).subject || '',
                yearsOfExperience: (t as TeacherResponse & { yearsOfExperience?: number }).yearsOfExperience || 0,
                institution: (t as TeacherResponse & { institution?: string }).institution || '',
                scenarioProgress: t.scenarioAttempts?.map((a: ScenarioAttemptResponse) => ({
                    scenarioId: a.scenarioId,
                    status: a.status,
                    score: a.score
                })) || [],
                evaluation: (t as TeacherResponse & { evaluation?: { llmSummary: string } }).evaluation
            }));
            set({ teachers, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch teachers';
            set({ error: errorMessage, isLoading: false });
        }
    },
    fetchTeacherById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get<TeacherResponse>(`/teachers/${id}`);
            const teacher: TeacherProfile = {
                id: response.data.id.toString(),
                name: response.data.full_name,
                email: response.data.email,
                role: response.data.role.toUpperCase() as 'TEACHER' | 'ADMIN',
                phone: (response.data as TeacherResponse & { phone?: string }).phone || '',
                subject: (response.data as TeacherResponse & { subject?: string }).subject || '',
                yearsOfExperience: (response.data as TeacherResponse & { yearsOfExperience?: number }).yearsOfExperience || 0,
                institution: (response.data as TeacherResponse & { institution?: string }).institution || '',
                scenarioProgress: response.data.scenarioAttempts?.map((a: ScenarioAttemptResponse) => ({
                    scenarioId: a.scenarioId,
                    status: a.status,
                    score: a.score
                })) || [],
                evaluation: (response.data as TeacherResponse & { evaluation?: { llmSummary: string } }).evaluation
            };
            set((state) => ({
                teachers: state.teachers.some(t => t.id === id)
                    ? state.teachers.map(t => t.id === id ? teacher : t)
                    : [...state.teachers, teacher],
                isLoading: false
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch teacher';
            set({ error: errorMessage, isLoading: false });
        }
    }
}));
