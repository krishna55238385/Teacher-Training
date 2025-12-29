import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.TOUGH_TONGUE_API_KEY;
const BASE_URL = process.env.TOUGH_TONGUE_API_BASE;

export class ToughTongueService {
    private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: "Unknown error" }));
            throw new Error(error.message || `API request failed with status ${response.status}`);
        }

        return response.json();
    }

    async getAccessToken(scenarioId: string) {
        return this.fetchWithAuth("/scenario-access-token", {
            method: "POST",
            body: JSON.stringify({ scenario_id: scenarioId }),
        });
    }

    async getSessionDetails(sessionId: string) {
        return this.fetchWithAuth(`/sessions/${sessionId}`);
    }

    async triggerAnalysis(sessionId: string) {
        return this.fetchWithAuth("/sessions/analyze", {
            method: "POST",
            body: JSON.stringify({ session_id: sessionId }),
        });
    }

    async listSessions(params: { scenario_id?: string; user_email?: string } = {}) {
        const query = new URLSearchParams(params as any).toString();
        return this.fetchWithAuth(`/sessions?${query}`);
    }
}
