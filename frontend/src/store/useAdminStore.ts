import { create } from 'zustand';
import type { TeacherProfile } from '../types';
import api from '../services/api';

interface EvaluationData {
    final_score?: number;
    overall_score?: number | string;
    strengths?: string | string[];
    weaknesses?: string | string[];
    improvement_areas?: string | string[];
    strength_points?: string | string[];
    detailed_feedback?: string;
    llmSummary?: string;
    report_card?: Record<string, number | { score: number; description?: string }>;
    duration?: number;
    completed_at?: string;
    [key: string]: unknown;
}

interface AdminState {
    teachers: TeacherProfile[];
    isLoading: boolean;
    error: string | null;
    fetchTeachers: () => Promise<void>;
    fetchTeacherById: (id: string) => Promise<void>;
}

interface ScenarioAttemptResponse {
    id: number;
    scenarioId: string;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    score: number | null;
    session_id: string | null;
    evaluation: EvaluationData | null;
    created_at: string;
    updated_at: string;
}

interface TeacherResponse {
    id: number;
    email: string;
    full_name: string;
    role: string;
    status: string;
    created_at: string;
    scenarioAttempts: ScenarioAttemptResponse[];
}

export const useAdminStore = create<AdminState>((set) => ({
    teachers: [],
    isLoading: false,
    error: null,
    
    fetchTeachers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get<{ success: boolean; data: TeacherResponse[] }>('/teachers');
            
            if (!response.data.success || !response.data.data) {
                throw new Error('Failed to fetch teachers');
            }

            const teachers: TeacherProfile[] = response.data.data.map((t: TeacherResponse) => ({
                id: t.id.toString(),
                name: t.full_name,
                email: t.email,
                role: t.role.toUpperCase() as 'TEACHER' | 'ADMIN',
                scenarioProgress: t.scenarioAttempts.map((a: ScenarioAttemptResponse) => ({
                    scenarioId: a.scenarioId,
                    status: a.status as 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED',
                    score: a.score,
                    session_id: a.session_id,
                    evaluation: a.evaluation,
                    created_at: a.created_at,
                    updated_at: a.updated_at
                })),
                evaluation: t.scenarioAttempts.length > 0 && t.scenarioAttempts.some(a => a.evaluation) 
                    ? {
                        llmSummary: t.scenarioAttempts
                            .filter(a => a.evaluation?.detailed_feedback || a.evaluation?.llmSummary)
                            .map(a => a.evaluation?.detailed_feedback || a.evaluation?.llmSummary)
                            .join(' ')
                            .substring(0, 200) + '...'
                    }
                    : undefined
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
            const response = await api.get<{ success: boolean; data: TeacherResponse }>(`/teachers/${id}`);
            
            if (!response.data.success || !response.data.data) {
                throw new Error('Failed to fetch teacher');
            }

            const t = response.data.data;
            const teacher: TeacherProfile = {
                id: t.id.toString(),
                name: t.full_name,
                email: t.email,
                role: t.role.toUpperCase() as 'TEACHER' | 'ADMIN',
                scenarioProgress: t.scenarioAttempts.map((a: ScenarioAttemptResponse) => ({
                    scenarioId: a.scenarioId,
                    status: a.status as 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED',
                    score: a.score,
                    session_id: a.session_id,
                    evaluation: a.evaluation,
                    created_at: a.created_at,
                    updated_at: a.updated_at
                })),
                evaluation: t.scenarioAttempts.length > 0 && t.scenarioAttempts.some(a => a.evaluation) 
                    ? {
                        llmSummary: t.scenarioAttempts
                            .filter(a => a.evaluation?.detailed_feedback || a.evaluation?.llmSummary)
                            .map(a => a.evaluation?.detailed_feedback || a.evaluation?.llmSummary)
                            .join(' ')
                    }
                    : undefined
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
