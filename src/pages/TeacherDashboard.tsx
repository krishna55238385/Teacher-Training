import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useScenarioStore } from '../store/useScenarioStore';
import { ArrowRight, Mic, Brain, MessageCircle, Sparkles, Target, Star } from 'lucide-react';
import { Card } from '../components/common/Card';
import { cn } from '../utils/cn';

const ScenarioIcon = ({ title, className }: { title: string, className?: string }) => {
    if (title.includes('Assessment')) return <Target className={className} />;
    if (title.includes('Framework')) return <Brain className={className} />;
    if (title.includes('Roleplay')) return <MessageCircle className={className} />;
    if (title.includes('Call')) return <Mic className={className} />;
    return <Sparkles className={className} />;
};

const TeacherDashboard = () => {
    const { user } = useAuthStore();
    const { scenarios, initializeScenarios } = useScenarioStore();

    React.useEffect(() => {
        initializeScenarios();
    }, [initializeScenarios]);

    const completedCount = scenarios.filter(s => s.status === 'COMPLETED').length;
    const progressPercentage = (completedCount / scenarios.length) * 100;
    const avgScore = completedCount > 0 ? Math.round(scenarios.reduce((acc, s) => acc + (s.score || 0), 0) / completedCount) : 0;

    return (
        <div className="h-full flex flex-col p-8 max-h-[calc(100vh-5rem)] bg-white/50 backdrop-blur-sm">
            {/* Elegant Header Section */}
            <div className="flex-none mb-8">
                <div className="flex items-center justify-between p-1">
                    <div className="flex items-center gap-8">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-200 text-white text-3xl font-bold ring-4 ring-white z-10 relative">
                                {user?.name?.charAt(0) || 'T'}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md z-20">
                                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                                Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{user?.name?.split(' ')[0]}</span>
                            </h1>
                            <p className="text-gray-500 mt-2 font-medium flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Ready to master your next scenario?
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-16 px-10 border-l border-gray-100">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">{completedCount}<span className="text-gray-300 text-lg font-medium">/</span>{scenarios.length}</div>
                            <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-blue-600 mt-1">Scenarios</div>
                        </div>

                        <div className="text-center">
                            <div className={cn("text-3xl font-bold", avgScore >= 80 ? "text-gray-900" : "text-gray-900")}>
                                {avgScore > 0 ? avgScore : '-'}<span className="text-lg text-gray-400 align-top ml-0.5">%</span>
                            </div>
                            <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-blue-600 mt-1">Efficiency</div>
                        </div>

                        <div className="w-56">
                            <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-gray-900">Overall Progress</span>
                                <span className="text-blue-600">{Math.round(progressPercentage)}%</span>
                            </div>
                            <div className="h-1.5 bg-blue-50 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scenarios Grid - Luxury Cards */}
            <div className="flex-1 min-h-0 pb-2">
                <div className="grid grid-cols-2 gap-6 h-full">
                    {scenarios.map((scenario, index) => {
                        const isCompleted = scenario.status === 'COMPLETED';
                        const isInProgress = scenario.status === 'IN_PROGRESS';

                        return (
                            <Link
                                key={scenario.id}
                                to={`/dashboard/scenario/${scenario.id}`}
                                className={cn(
                                    "group relative block h-full animate-fade-in-up",
                                    index === 0 ? "animation-delay-100" :
                                        index === 1 ? "animation-delay-200" :
                                            index === 2 ? "animation-delay-300" : "animation-delay-100"
                                )}
                            >
                                <Card className="h-full border-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-6px_rgba(59,130,246,0.15)] transition-all duration-500 bg-white flex flex-col p-0 overflow-hidden rounded-2xl ring-1 ring-gray-100/70 group-hover:ring-blue-200 group-hover:-translate-y-1">
                                    <div className="p-8 flex flex-col h-full relative">
                                        {/* Luxury Accent Line */}
                                        <div className={cn("absolute top-0 left-0 w-full h-1 transition-all duration-500 transform origin-left md:w-1.5 md:h-full",
                                            isCompleted ? "bg-gradient-to-b from-green-400 to-green-600" :
                                                isInProgress ? "bg-gradient-to-b from-blue-400 to-indigo-600" : "bg-transparent group-hover:bg-gray-100"
                                        )} />

                                        <div className="flex justify-between items-start mb-6 pl-4">
                                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm",
                                                isCompleted ? "bg-green-50 text-green-600 ring-1 ring-green-100" :
                                                    isInProgress ? "bg-blue-50 text-blue-600 ring-1 ring-blue-100" :
                                                        "bg-gray-50 text-gray-400 ring-1 ring-gray-100 group-hover:bg-white group-hover:shadow-md group-hover:text-blue-600 group-hover:scale-110"
                                            )}>
                                                <ScenarioIcon title={scenario.title} className="w-6 h-6" />
                                            </div>
                                            {scenario.score && (
                                                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm ring-1 ring-gray-100">
                                                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                                    <span className="text-sm font-bold text-gray-800">{scenario.score}</span>
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-3 pl-4 group-hover:text-blue-700 transition-colors tracking-tight">
                                            {scenario.title}
                                        </h3>

                                        <p className="text-sm text-gray-500 leading-relaxed pl-4 line-clamp-2 mb-auto font-medium">
                                            {scenario.description}
                                        </p>

                                        <div className="mt-8 pl-4 flex items-center justify-between border-t border-gray-50 pt-6">
                                            <span className={cn("text-[10px] font-bold uppercase tracking-widest flex items-center gap-2",
                                                isCompleted ? "text-green-600" :
                                                    isInProgress ? "text-blue-600" : "text-gray-400"
                                            )}>
                                                <span className={cn("w-1.5 h-1.5 rounded-full",
                                                    isCompleted ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" :
                                                        isInProgress ? "bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]" : "bg-gray-300"
                                                )} />
                                                {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Not Started'}
                                            </span>

                                            <span className="flex items-center gap-2 text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {isCompleted ? 'Review' : 'Start'}
                                                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
