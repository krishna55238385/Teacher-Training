import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { AuthService } from '../services/AuthService';
import { AuthRepository } from '../repositories/AuthRepository';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/common/Card';
import Alert from '../components/common/Alert';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated, user } = useAuthStore();
    const [error, setError] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [appliedSuccess, setAppliedSuccess] = React.useState(false);

    React.useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'ADMIN') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate]);

    React.useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('applied') === 'true') {
            setAppliedSuccess(true);
        }
    }, [location.search]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await authService.login({
                email: data.email,
                password: data.password,
            });

            login(result.token, result.user);

            if (result.user.role === 'ADMIN') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }
        } catch (err) {
            let errorMessage = 'Invalid email or password';
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            // Check if it's an axios error
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string } } };
                errorMessage = axiosError.response?.data?.message || errorMessage;
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center space-y-1">
                    <CardTitle className="text-2xl font-bold">Sign in to your account</CardTitle>
                    <p className="text-sm text-gray-500">
                        Enter your email and password below to login
                    </p>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                    {appliedSuccess && (
                        <Alert type="success" title="Application Submitted">
                            Your application has been received. You can login now.
                        </Alert>
                    )}
                    {error && (
                        <Alert type="error" title="Login Failed">
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Email"
                            placeholder="name@example.com"
                            type="email"
                            error={errors.email?.message}
                            {...register('email')}
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••"
                            error={errors.password?.message}
                            {...register('password')}
                        />
                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Sign In
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center border-t border-gray-100 pt-6">
                    <p className="text-sm text-gray-500">
                        Contact your administrator to get access to the platform.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginPage;
