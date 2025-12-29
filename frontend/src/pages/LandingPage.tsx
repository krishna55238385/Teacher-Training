
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ArrowRight, CheckCircle, BookOpen, Users, Award } from 'lucide-react';
import Button from '../components/common/Button';
import { Card, CardContent } from '../components/common/Card';

const LandingPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        }
    }, [isAuthenticated, user, navigate]);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-white py-20 lg:py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                        Master the Art of Teaching with <br className="hidden md:block" />
                        <span className="text-primary-600">AI-Powered Roleplay</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                        Practice real-world classroom scenarios in a safe, interactive environment.
                        Get instant feedback and improve your teaching skills before stepping into a classroom.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/apply">
                            <Button size="lg" className="w-full sm:w-auto">
                                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                Teacher Login
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Background blobs */}
                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
            </section>

            {/* How it Works */}
            <section id="how-it-works" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Our platform uses advanced AI to simulate realistic classroom situations.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Users,
                                title: '1. Choose a Scenario',
                                description: 'Select from a library of common teaching challenges like classroom management or parent conferences.'
                            },
                            {
                                icon: BookOpen,
                                title: '2. Roleplay with AI',
                                description: 'Interact with AI students or parents in real-time. Respond to their actions and practice your strategies.'
                            },
                            {
                                icon: Award,
                                title: '3. Get Feedback',
                                description: 'Receive detailed analysis of your performance, including strengths and areas for improvement.'
                            }
                        ].map((step, index) => (
                            <Card key={index} className="border-none shadow-md bg-white">
                                <CardContent className="pt-6 text-center">
                                    <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6 text-primary-600">
                                        <step.icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                    <p className="text-gray-600">{step.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section id="benefits" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Bambinos Teacher Training?</h2>
                            <ul className="space-y-4">
                                {[
                                    'Safe practice environment with zero risk',
                                    'Instant, objective feedback on your performance',
                                    'Scenarios designed by educational experts',
                                    'Track your progress and growth over time',
                                    'Accessible anytime, anywhere'
                                ].map((benefit, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                                        <span className="text-lg text-gray-700">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8">
                                <Link to="/apply">
                                    <Button size="lg">Apply Now</Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            {/* Visual representation/placeholder image */}
                            <div className="aspect-square rounded-2xl bg-gray-100 overflow-hidden shadow-xl border border-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 font-medium text-lg">Platform Demo Preview UI</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-primary-600 text-white text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Teaching?</h2>
                    <p className="text-xl text-primary-100 mb-10">
                        Join thousands of educators who are mastering their craft with AI-powered training.
                    </p>
                    <Link to="/apply">
                        <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100 border-transparent">
                            Apply for Access
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
