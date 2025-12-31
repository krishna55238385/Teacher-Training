import { AuthRepository } from '../repositories/AuthRepository';
import type { LoginRequest } from '../repositories/AuthRepository';
import type { User, Role } from '../types';

export interface LoginResult {
    token: string;
    user: User;
}

export class AuthService {
    private authRepository: AuthRepository;

    constructor(authRepository: AuthRepository) {
        this.authRepository = authRepository;
    }

    async login(credentials: LoginRequest): Promise<LoginResult> {
        const response = await this.authRepository.login(credentials);

        if (!response.success || !response.data) {
            throw new Error(response.message || 'Login failed');
        }

        // Transform backend response to frontend User type
        const user: User = {
            id: response.data.user.id.toString(),
            name: response.data.user.name,
            email: response.data.user.email,
            role: response.data.user.role.toUpperCase() as Role,
            avatar: undefined,
        };

        return {
            token: response.data.token,
            user,
        };
    }
}

