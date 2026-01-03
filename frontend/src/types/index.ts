export type Role = 'TEACHER' | 'ADMIN';

export interface EvaluationData {
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

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatar?: string;
}

export interface TeacherProfile extends User {
    phone?: string;
    subject?: string;
    yearsOfExperience?: number;
    institution?: string;
    scenarioProgress: {
        scenarioId: string;
        attemptNumber?: number;
        status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
        score?: number | null;
        completedAttempts?: number;
        requiredAttempts?: number;
        session_id?: string | null;
        evaluation?: EvaluationData | null;
        created_at?: string;
        updated_at?: string;
    }[];
    evaluation?: {
        llmSummary: string;
    };
}

export interface Scenario {
    id: string;
    title: string;
    description: string;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    difficulty?: string;
    score?: number | null;
    toughTongueId?: string;
    customEmbedUrl?: string;
    completedAttempts?: number;
    requiredAttempts?: number;
    isLocked?: boolean;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}
