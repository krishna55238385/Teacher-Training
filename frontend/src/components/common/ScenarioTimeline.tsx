import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';
import { CheckCircle, FileText } from 'lucide-react';

interface Scenario {
    id?: string;
    title: string;
    status: string;
}

interface ScenarioTimelineProps {
    scenarios: Scenario[];
    currentScenarioIndex?: number;
    teacherId: string;
    isSummary?: boolean;
}

const ScenarioTimeline = ({ scenarios, currentScenarioIndex, teacherId, isSummary }: ScenarioTimelineProps) => {
    const navigate = useNavigate();

    return (
        <div className="sticky top-[80px] z-30 mb-8 flex justify-center">
            <div className="bg-white/90 backdrop-blur-xl p-1.5 rounded-full inline-flex items-center gap-1 shadow-lg shadow-blue-900/5 border border-white/50 max-w-full overflow-x-auto no-scrollbar ring-1 ring-black/5">

                {/* Summary Pill */}
                <button
                    onClick={() => navigate(`/admin/teacher/${teacherId}/scenario/summary`)}
                    className={cn(
                        "relative px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap min-w-fit outline-none focus:outline-none",
                        isSummary ? "text-white" : "text-gray-500 hover:text-gray-900"
                    )}
                >
                    {isSummary && (
                        <motion.div
                            layoutId="active-scenario-pill"
                            className="absolute inset-0 bg-blue-600 rounded-full shadow-md"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                        <FileText className={cn("w-3.5 h-3.5", isSummary ? "text-blue-200" : "text-gray-500")} />
                        Summary
                    </span>
                </button>

                <div className="w-px h-6 bg-gray-200 mx-1"></div>

                {scenarios.map((scenario, idx) => {
                    const isCompleted = scenario.status === 'COMPLETED';
                    const isCurrent = idx === currentScenarioIndex && !isSummary;
                    const scenarioId = scenario.id || idx.toString();

                    return (
                        <button
                            key={scenarioId}
                            onClick={() => navigate(`/admin/teacher/${teacherId}/scenario/${scenarioId}`)}
                            className={cn(
                                "relative px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap min-w-fit outline-none focus:outline-none",
                                isCurrent ? "text-white" : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            {/* Active Background Pill */}
                            {isCurrent && (
                                <motion.div
                                    layoutId="active-scenario-pill"
                                    className="absolute inset-0 bg-blue-600 rounded-full shadow-md"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}

                            {/* Content Layered on Top */}
                            <span className="relative z-10 flex items-center gap-2">
                                {/* Status Indicator Icon */}
                                {isCompleted ? (
                                    <CheckCircle className={cn("w-3.5 h-3.5", isCurrent ? "text-blue-200" : "text-emerald-500")} />
                                ) : (
                                    <span className={cn("w-1.5 h-1.5 rounded-full ml-1 mr-1", isCurrent ? "bg-blue-300" : "bg-gray-300")} />
                                )}

                                {scenario.title}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ScenarioTimeline;
