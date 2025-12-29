import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Scenario } from '../types';

interface ScenarioState {
    scenarios: Scenario[];
    initializeScenarios: () => void;
    updateScenarioStatus: (id: string, status: Scenario['status'], score?: number) => void;
}

const INITIAL_SCENARIOS: Scenario[] = [
    {
        id: '1',
        title: 'PTM Assessment: Handling Parent Concerns',
        description: 'Navigate a challenging Parent-Teacher Meeting where a parent is concerned about their child\'s progress. Practice active listening and evidence-based feedback.',
        difficulty: 'Intermediate',
        status: 'NOT_STARTED',
    },
    {
        id: '2',
        title: 'PTM Coach: Framework Mastery',
        description: 'Master the structural framework for conducting effective PTMs. Focus on the "Sandwich Method" of feedback and setting actionable goals.',
        difficulty: 'Advanced',
        status: 'NOT_STARTED',
    },
    {
        id: '3',
        title: 'Renewal Roleplay: Hesitant Parent (English Communication)',
        description: 'Roleplay a renewal conversation with a parent hesitant due to perceived lack of improvement in English communication skills. Address objections convincingly.',
        difficulty: 'Advanced',
        status: 'NOT_STARTED',
    },
    {
        id: '4',
        title: 'Coach: The Perfect Renewal Call',
        description: 'Learn the best practices for a renewal call. Focus on value proposition, celebrating student wins, and closing the renewal effectively.',
        difficulty: 'Intermediate',
        status: 'NOT_STARTED',
    },
];

export const useScenarioStore = create<ScenarioState>()(
    persist(
        (set, get) => ({
            scenarios: INITIAL_SCENARIOS,
            initializeScenarios: () => {
                const currentScenarios = get().scenarios;
                if (currentScenarios.length === 0) {
                    set({ scenarios: INITIAL_SCENARIOS });
                }
            },
            updateScenarioStatus: (id: string, status: Scenario['status'], score?: number) => {
                set((state: ScenarioState) => ({
                    scenarios: state.scenarios.map((s: Scenario) =>
                        s.id === id ? { ...s, status, score } : s
                    ),
                }));
            },
        }),
        {
            name: 'scenario-storage',
        }
    )
);
