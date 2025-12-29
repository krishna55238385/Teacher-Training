export type Role = 'TEACHER' | 'ADMIN';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatar?: string;
}

export interface TeacherProfile extends User {
    phone: string;
    subject: string;
    yearsOfExperience: number;
    institution: string;
    scenarioProgress: {
        scenarioId: string;
        status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
        score?: number;
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
    score?: number;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}
