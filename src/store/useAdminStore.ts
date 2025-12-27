import { create } from 'zustand';
import type { TeacherProfile } from '../types';

interface AdminState {
    teachers: TeacherProfile[];
}

const MOCK_TEACHERS: TeacherProfile[] = [
    {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        role: 'TEACHER',
        phone: '+1 (555) 123-4567',
        subject: 'Mathematics',
        yearsOfExperience: 5,
        institution: 'Lincoln High School',
        scenarioProgress: [
            { scenarioId: '1', status: 'COMPLETED', score: 85 },
            { scenarioId: '2', status: 'COMPLETED', score: 92 },
            { scenarioId: '3', status: 'IN_PROGRESS' },
            { scenarioId: '4', status: 'NOT_STARTED' },
        ],
    },
    {
        id: '2',
        name: 'Michael Chen',
        email: 'm.chen@example.com',
        role: 'TEACHER',
        phone: '+1 (555) 987-6543',
        subject: 'History',
        yearsOfExperience: 8,
        institution: 'Washington Middle School',
        scenarioProgress: [
            { scenarioId: '1', status: 'COMPLETED', score: 78 },
            { scenarioId: '2', status: 'IN_PROGRESS' },
            { scenarioId: '3', status: 'NOT_STARTED' },
            { scenarioId: '4', status: 'NOT_STARTED' },
        ],
    },
    {
        id: '3',
        name: 'Emily Davis',
        email: 'emily.d@example.com',
        role: 'TEACHER',
        phone: '+1 (555) 456-7890',
        subject: 'English Literature',
        yearsOfExperience: 3,
        institution: 'Lincoln High School',
        scenarioProgress: [
            { scenarioId: '1', status: 'COMPLETED', score: 95 },
            { scenarioId: '2', status: 'COMPLETED', score: 88 },
            { scenarioId: '3', status: 'COMPLETED', score: 90 },
            { scenarioId: '4', status: 'COMPLETED', score: 85 },
        ],
    },
    {
        id: '4',
        name: 'Robert Wilson',
        email: 'rwilson@example.com',
        role: 'TEACHER',
        phone: '+1 (555) 222-3333',
        subject: 'Physics',
        yearsOfExperience: 12,
        institution: 'Tech Academy',
        scenarioProgress: [
            { scenarioId: '1', status: 'NOT_STARTED' },
            { scenarioId: '2', status: 'NOT_STARTED' },
            { scenarioId: '3', status: 'NOT_STARTED' },
            { scenarioId: '4', status: 'NOT_STARTED' },
        ],
    },
    {
        id: '5',
        name: 'Lisa Anderson',
        email: 'lisa.a@example.com',
        role: 'TEACHER',
        phone: '+1 (555) 444-5555',
        subject: 'Biology',
        yearsOfExperience: 4,
        institution: 'Science Prep',
        scenarioProgress: [
            { scenarioId: '1', status: 'COMPLETED', score: 82 },
            { scenarioId: '2', status: 'NOT_STARTED' },
            { scenarioId: '3', status: 'NOT_STARTED' },
            { scenarioId: '4', status: 'NOT_STARTED' },
        ],
    },
];

export const useAdminStore = create<AdminState>(() => ({
    teachers: MOCK_TEACHERS,
}));
