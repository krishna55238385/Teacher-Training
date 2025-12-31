import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Scenario } from '../types';
import api from '../services/api';

interface ScenarioState {
    scenarios: Scenario[];
    isLoading: boolean;
    error: string | null;
    initializeScenarios: () => void;
    fetchScenarios: () => Promise<void>;
    updateScenarioStatus: (id: string, status: Scenario['status'], score?: number) => void;
    syncWithBackend: (id: string, status: Scenario['status'], score?: number) => Promise<void>;
}

const INITIAL_SCENARIOS: Scenario[] = [
    {
        id: '1',
        title: 'PTM Assessment: Handling Parent Concerns',
        description: 'Navigate a challenging Parent-Teacher Meeting where a parent is concerned about their child\'s progress. Practice active listening and evidence-based feedback.',
        difficulty: 'Intermediate',
        status: 'NOT_STARTED',
        toughTongueId: '693877e7b8892d3f7b91eb31',
        customEmbedUrl: 'https://bambinos.app.toughtongueai.com/embed/693877e7b8892d3f7b91eb31?skipPrecheck=true',
    },
    {
        id: '2',
        title: 'PTM Coach: Framework Mastery',
        description: 'Master the structural framework for conducting effective PTMs. Focus on the "Sandwich Method" of feedback and setting actionable goals.',
        difficulty: 'Advanced',
        status: 'NOT_STARTED',
        toughTongueId: '6939d23e07d90d92fea80199',
        customEmbedUrl: 'https://bambinos.app.toughtongueai.com/embed/6939d23e07d90d92fea80199?skipPrecheck=true',
    },
    {
        id: '3',
        title: 'Renewal Roleplay: Hesitant Parent (English Communication)',
        description: 'Roleplay a renewal conversation with a parent hesitant due to perceived lack of improvement in English communication skills. Address objections convincingly.',
        difficulty: 'Advanced',
        status: 'NOT_STARTED',
        toughTongueId: '693a7c1507d90d92fea80744',
        customEmbedUrl: 'https://bambinos.app.toughtongueai.com/embed/693a7c1507d90d92fea80744?skipPrecheck=true',
    },
    {
        id: '4',
        title: 'Coach: The Perfect Renewal Call',
        description: 'Learn the best practices for a renewal call. Focus on value proposition, celebrating student wins, and closing the renewal effectively.',
        difficulty: 'Intermediate',
        status: 'NOT_STARTED',
        toughTongueId: '6942c17a25f8fcc9bc250d03',
        customEmbedUrl: 'https://bambinos.app.toughtongueai.com/embed/6942c17a25f8fcc9bc250d03?skipPrecheck=true',
    },
];

export const useScenarioStore = create<ScenarioState>()(
    persist(
        (set, get) => ({
            scenarios: INITIAL_SCENARIOS,
            isLoading: false,
            error: null,
            initializeScenarios: () => {
                const currentScenarios = get().scenarios;
                if (currentScenarios.length === 0) {
                    set({ scenarios: INITIAL_SCENARIOS });
                }
            },
            fetchScenarios: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.get('/scenarios');
                    if (response.data.success && response.data.scenarios) {
                        set({ scenarios: response.data.scenarios, isLoading: false });
                    } else {
                        // Fallback to initial scenarios if API fails
                        set({ scenarios: INITIAL_SCENARIOS, isLoading: false });
                    }
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch scenarios';
                    console.warn('Failed to fetch scenarios from API, using local data:', error);
                    // Fallback to initial scenarios on error
                    set({ scenarios: INITIAL_SCENARIOS, isLoading: false, error: errorMessage });
                }
            },
            updateScenarioStatus: (id: string, status: Scenario['status'], score?: number) => {
                set((state: ScenarioState) => ({
                    scenarios: state.scenarios.map((s: Scenario) =>
                        s.id === id ? { ...s, status, score } : s
                    ),
                }));
            },
            syncWithBackend: async (id: string, status: Scenario['status'], score?: number) => {
                try {
                    // Update status via API
                    await api.put(`/scenarios/${id}/status`, { status });
                    // Update local state
                    get().updateScenarioStatus(id, status, score);
                } catch (error) {
                    console.error('Failed to sync scenario status with backend:', error);
                    // Still update local state even if backend fails
                    get().updateScenarioStatus(id, status, score);
                }
            },
        }),
        {
            name: 'scenario-storage',
        }
    )
);
