import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/common/Card';
import Alert from '../components/common/Alert';

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const applicationSchema = z.object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(phoneRegex, 'Invalid phone number'),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const ApplicationPage = () => {
    const navigate = useNavigate();
    const [submitError, setSubmitError] = React.useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ApplicationFormData>({
        resolver: zodResolver(applicationSchema) as any,
    });

    const onSubmit: SubmitHandler<ApplicationFormData> = async (data) => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            // API call would go here
            console.log('Submitting application:', data);
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay

            // Success - Redirect to login with success message usually, or just login
            // For now, redirect to login
            navigate('/login?applied=true');
        } catch (error) {
            console.error(error);
            setSubmitError('Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
            <Card>
                <CardHeader className="text-center border-b border-gray-100 pb-8">
                    <CardTitle className="text-2xl font-bold text-primary-600">Join Teacher Training Program</CardTitle>
                    <p className="text-gray-600 mt-2">
                        Complete the form below to apply for access to our AI-powered training scenarios.
                    </p>
                </CardHeader>
                <CardContent className="pt-8 space-y-6">
                    {submitError && (
                        <Alert type="error" title="Submission Error">
                            {submitError}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-6">
                            <Input
                                label="Full Name"
                                placeholder="Jane Doe"
                                error={errors.fullName?.message}
                                {...register('fullName')}
                            />
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="jane@school.edu"
                                error={errors.email?.message}
                                {...register('email')}
                            />
                            <Input
                                label="Phone Number"
                                placeholder="+1 (555) 000-0000"
                                error={errors.phone?.message}
                                {...register('phone')}
                            />
                        </div>

                        <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
                            Submit Application
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center border-t border-gray-100 pt-6">
                    <p className="text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                            Log in here
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ApplicationPage;
