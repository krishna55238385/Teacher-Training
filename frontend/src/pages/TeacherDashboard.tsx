import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useScenarioStore } from '../store/useScenarioStore';
import { ArrowRight, Mic, Brain, MessageCircle, Sparkles, Target, Star, Lock, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/common/Card';
import { cn } from '../utils/cn';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/common/Toast';

const ScenarioIcon = ({ title, className }: { title: string, className?: string }) => {
    const iconBaseClasses = "w-[48px] h-[48px] stroke-[1.5]";
    if (title.includes('Assessment')) return <Target className={cn(iconBaseClasses, className)} />;
    if (title.includes('Framework')) return <Brain className={cn(iconBaseClasses, className)} />;
    if (title.includes('Roleplay')) return <MessageCircle className={cn(iconBaseClasses, className)} />;
    if (title.includes('Call')) return <Mic className={cn(iconBaseClasses, className)} />;
    return <Sparkles className={cn(iconBaseClasses, className)} />;
};

const TeacherDashboard = () => {
    const { user } = useAuthStore();
    const { scenarios, isLoading, fetchScenarios, initializeScenarios } = useScenarioStore();
    const location = useLocation();
    const { toasts, removeToast, success } = useToast();
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    // Show success message if redirected from scenario completion
    React.useEffect(() => {
        if (location.state?.showSuccess) {
            const scenarioTitle = location.state.scenarioTitle || 'Scenario';
            const score = location.state.score;
            const message = score 
                ? `Great job! You scored ${score}% on "${scenarioTitle}"`
                : `Successfully completed "${scenarioTitle}"`;
            
            success(message, 'Scenario Completed');
            
            // Clear location state
            window.history.replaceState({}, document.title);
        }
    }, [location.state, success]);

    React.useEffect(() => {
        // Fetch scenarios from backend on mount
        const loadScenarios = async () => {
            setIsRefreshing(true);
            try {
                await fetchScenarios();
            } catch {
                initializeScenarios();
            } finally {
                setIsRefreshing(false);
            }
        };
        loadScenarios();
    }, [fetchScenarios, initializeScenarios]);

    // Refresh scenarios when returning to dashboard
    React.useEffect(() => {
        const handleFocus = () => {
            fetchScenarios().catch(() => {
                initializeScenarios();
            });
        };
        
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [fetchScenarios, initializeScenarios]);

    const completedCount = scenarios.filter(s => s.status === 'COMPLETED').length;
    const progressPercentage = (completedCount / scenarios.length) * 100;
    const avgScore = completedCount > 0 ? Math.round(scenarios.reduce((acc, s) => acc + (s.score || 0), 0) / completedCount) : 0;

    // Get scenario index for display (1-based)
    const getScenarioNumber = (scenarioId: string) => {
        const index = scenarios.findIndex(s => s.id === scenarioId);
        return index + 1;
    };

    // Get progress text for scenario
    const getProgressText = (scenario: typeof scenarios[0]) => {
        if (!scenario.requiredAttempts || scenario.requiredAttempts === 1) {
            return scenario.status === 'COMPLETED' ? 'Completed' : 'Not Started';
        }
        const completed = scenario.completedAttempts || 0;
        const required = scenario.requiredAttempts;
        if (completed === 0) return 'Not Started';
        if (completed >= required) return 'Completed';
        return `${completed}/${required} Attempts`;
    };

    return (
        <div className="min-h-full flex flex-col p-4 sm:p-6 md:p-8 bg-gray-50/50 backdrop-blur-sm font-sans">
            {/* Header Section */}
            <div className="flex-none mb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6 sm:gap-8">
                        <div className="relative group cursor-pointer">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 text-white text-3xl font-bold ring-4 ring-white z-10 relative overflow-hidden">
                                {user?.name?.charAt(0) || 'T'}
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md z-20 transition-transform duration-300 group-hover:scale-110">
                                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                                Hello, <span className="text-blue-600">{user?.name?.split(' ')[0] || user?.name}</span>
                            </h1>
                            <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base font-medium flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Ready to master your next scenario?
                            </p>
                        </div>
                    </div>

                    {/* Metrics Section */}
                    <Card className="flex flex-col sm:flex-row items-stretch sm:items-center gap-0 p-0 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 border-gray-100">
                        <div className="flex flex-1 items-center justify-center gap-4 px-8 py-4 border-b sm:border-b-0 sm:border-r border-gray-100 bg-gray-50/30">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">
                                    {completedCount}
                                    <span className="text-gray-300 text-xl font-medium mx-1">/</span>
                                    <span className="text-gray-400">{scenarios.length}</span>
                                </div>
                                <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mt-1">Scenarios</div>
                            </div>
                        </div>

                        <div className="flex flex-1 items-center justify-center gap-4 px-8 py-4 border-b sm:border-b-0 sm:border-r border-gray-100">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">
                                    {avgScore > 0 ? avgScore : '-'}<span className="text-xl text-gray-400 align-baseline ml-0.5">%</span>
                                </div>
                                <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mt-1">Efficiency</div>
                            </div>
                        </div>

                        <div className="flex-[1.5] px-8 py-4 bg-blue-50/30 min-w-[240px]">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600">Overall Progress</span>
                                <span className="text-lg font-bold text-blue-700">{Math.round(progressPercentage)}%</span>
                            </div>
                            <div className="h-2 bg-blue-100/50 rounded-full overflow-hidden relative">
                                <div
                                    className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                                {progressPercentage === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest animate-pulse">Let's get started!</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Scenarios Grid */}
            <div className="flex-1 min-h-0">
                {isLoading ? (
                    <div className="py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4 text-gray-400">
                            <Sparkles className="w-8 h-8 animate-pulse" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Loading scenarios...</h3>
                        <p className="text-gray-500 mt-1">Please wait while we fetch your progress.</p>
                    </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    {scenarios.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4 text-gray-400">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">No scenarios yet</h3>
                            <p className="text-gray-500 mt-1">Check back later for new training content.</p>
                        </div>
                    ) : (
                        scenarios.map((scenario) => {
                            const isCompleted = scenario.status === 'COMPLETED';
                            const isLocked = scenario.isLocked || false;
                            const scenarioNumber = getScenarioNumber(scenario.id);
                            const progressText = getProgressText(scenario);
                            const isInProgress = scenario.status === 'IN_PROGRESS';

                            return (
                                <div
                                    key={scenario.id}
                                    className={cn(
                                        "group block h-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl focus:ring-offset-2 relative",
                                        isLocked && "pointer-events-none opacity-60"
                                    )}
                                >
                                    {isLocked && (
                                        <div className="absolute top-4 right-4 z-10">
                                            <div className="bg-gray-100 rounded-full p-2">
                                                <Lock className="w-4 h-4 text-gray-500" />
                                            </div>
                                        </div>
                                    )}
                                    <Link
                                        to={isLocked ? '#' : `/dashboard/scenario/${scenario.id}`}
                                        className="block h-full"
                                        aria-label={isLocked ? `${scenario.title} is locked` : `Start ${scenario.title} scenario`}
                                    >
                                        <Card className={cn(
                                            "h-full border border-gray-100 shadow-sm transition-all duration-300 bg-white flex flex-col p-8 rounded-2xl",
                                            !isLocked && "hover:shadow-lg hover:scale-[1.02] cursor-pointer",
                                            isLocked && "cursor-not-allowed"
                                        )}>
                                            <div className="flex justify-between items-start mb-6">
                                                <div className={cn(
                                                    "w-[48px] h-[48px] rounded-xl flex items-center justify-center transition-all duration-500",
                                                    isCompleted ? "bg-green-50 text-green-600" :
                                                        isInProgress ? "bg-blue-50 text-blue-600" :
                                                            "bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600"
                                                )}>
                                                    <ScenarioIcon title={scenario.title} />
                                                </div>

                                                <div className="flex flex-col items-end gap-2">
                                                    {/* Progress badge */}
                                                    <div className={cn(
                                                        "px-3 py-1 rounded-full text-xs font-bold",
                                                        isCompleted ? "bg-green-100 text-green-700" :
                                                            isInProgress ? "bg-blue-100 text-blue-700" :
                                                                "bg-gray-100 text-gray-500"
                                                    )}>
                                                        {progressText}
                                                    </div>
                                                    
                                                    {/* Scenario number indicator */}
                                                    <div className={cn(
                                                        "px-3 py-1 rounded-full text-xs font-bold",
                                                        isCompleted ? "bg-green-100 text-green-700" :
                                                            "bg-gray-100 text-gray-500"
                                                    )}>
                                                        {scenarioNumber}/{scenarios.length}
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                {scenario.title}
                                            </h3>

                                            <p className="text-sm text-gray-600 leading-[1.6] mb-8 flex-1">
                                                {scenario.description}
                                            </p>

                                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                                                {/* Show score or progress */}
                                                {scenario.score ? (
                                                    <div className="flex items-center gap-1.5 bg-amber-50/50 px-3 py-1.5 rounded-lg">
                                                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                        <span className="text-sm font-bold text-amber-700">{scenario.score}% Score</span>
                                                    </div>
                                                ) : (
                                                    <div className="w-1" />
                                                )}

                                                <button className={cn(
                                                    "inline-flex items-center gap-2 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md transition-all duration-200",
                                                    isLocked ? "bg-gray-400 cursor-not-allowed" :
                                                        isCompleted ? "bg-green-600 hover:bg-green-700" :
                                                            "bg-blue-600 hover:bg-blue-700 active:scale-95"
                                                )}>
                                                    {isLocked ? 'Locked' : isCompleted ? 'Completed' : isInProgress ? 'Continue' : 'Start'}
                                                    {!isLocked && <ArrowRight className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </Card>
                                    </Link>
                                </div>
                            );
                        })
                    )}
                </div>
                )}
            </div>
            
            {/* Toast Notifications */}
            <ToastContainer toasts={toasts} onClose={removeToast} />
        </div>
    );
};

export default TeacherDashboard;
