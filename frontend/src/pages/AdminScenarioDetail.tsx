import { useParams } from 'react-router-dom';
import { useAdminStore } from '../store/useAdminStore';
import { Play, CheckCircle2, AlertCircle, Star } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

const AdminScenarioDetail = () => {
    const { id, scenarioId } = useParams<{ id: string; scenarioId: string }>();
    const { teachers } = useAdminStore();
    const teacher = teachers.find(t => t.id === id);

    if (!teacher) return <div className="text-center p-8">Teacher not found</div>;
    if (!scenarioId) return <div className="text-center p-8">Scenario ID is required</div>;

    const scenario = teacher.scenarioProgress.find(s => s.scenarioId === scenarioId);
    
    if (!scenario) {
        return (
            <div className="text-center p-8">
                <p className="text-gray-600">Scenario {scenarioId} not found for this teacher</p>
            </div>
        );
    }

    const evaluation = scenario.evaluation || {};
    const score = scenario.score ?? 0;
    const status = scenario.status;
    const isCompleted = status === 'COMPLETED';

    // Extract evaluation data
    // Ensure finalScore is always a number
    const getNumericScore = (value: number | string | undefined | null): number => {
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
            const parsed = parseFloat(value);
            return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
    };
    
    const finalScore = getNumericScore(
        evaluation.final_score ?? evaluation.overall_score ?? score
    );
    const strengths = evaluation.strengths || evaluation.strength_points || [];
    const weaknesses = evaluation.weaknesses || evaluation.improvement_areas || [];
    const detailedFeedback = evaluation.detailed_feedback || '';
    const reportCard = evaluation.report_card || {};
    const duration = evaluation.duration || 0;
    const completedAt = scenario.updated_at || scenario.created_at;

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format duration
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate percentile (mock for now, can be calculated from batch data)
    const percentile = score >= 8 ? 85 : score >= 6 ? 70 : score >= 4 ? 50 : 30;

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-between mb-2"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                        <Star className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Scenario {scenarioId}</h2>
                        <p className="text-sm text-gray-500">
                            {isCompleted ? 'Completed' : 'Not Started'}
                        </p>
                    </div>
                </div>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs font-semibold">Read Only</span>
            </motion.div>

            {!isCompleted ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-amber-900 mb-2">Scenario Not Completed</h3>
                    <p className="text-amber-700">
                        This scenario is not started yet.
                        {scenario.created_at && (
                            <span className="block mt-2 text-sm">
                                Started: {formatDate(scenario.created_at)}
                            </span>
                        )}
                    </p>
                </div>
            ) : (
                <>
                    {/* Top Grid: Result Summary & Session Info */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Left: Overall Result Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-[#111827] rounded-xl p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[300px] shadow-2xl"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-3xl translate-x-1/2 -translate-y-1/2 animate-pulse"></div>

                            <div className="flex justify-between items-start z-10">
                                <div>
                                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Interview Status</div>
                                    <div className="text-emerald-400 font-bold text-xl flex items-center gap-2">
                                        {finalScore >= 7 ? 'Passed' : finalScore >= 5 ? 'Conditional' : 'Failed'} 
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className={cn(
                                    "backdrop-blur text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-2 border",
                                    finalScore >= 7 ? "bg-white/10 text-emerald-400 border-emerald-500/30" :
                                    finalScore >= 5 ? "bg-white/10 text-amber-400 border-amber-500/30" :
                                    "bg-white/10 text-red-400 border-red-500/30"
                                )}>
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    {finalScore >= 7 ? 'Qualified' : finalScore >= 5 ? 'Review' : 'Not Qualified'}
                                </div>
                            </div>

                            <div className="z-10 mt-8">
                                <div className="flex items-end gap-3 mb-2">
                                    <span className="text-6xl font-bold text-emerald-400">{finalScore.toFixed(1)}</span>
                                    <span className="text-2xl text-gray-400 mb-1.5">/10</span>
                                    <span className="text-emerald-400 font-bold text-xl mb-1.5 ml-4">{percentile}%</span>
                                    <span className="text-gray-400 text-sm mb-2">Overall Performance</span>
                                </div>

                                {completedAt && (
                                    <div className="text-xs text-gray-400 mt-2">
                                        Completed: {formatDate(completedAt)}
                                    </div>
                                )}

                                {duration > 0 && (
                                    <div className="text-xs text-gray-400">
                                        Duration: {formatDuration(duration)}
                                    </div>
                                )}

                                <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden mt-4">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(finalScore / 10) * 100}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                    ></motion.div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right: Session Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
                        >
                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-2 bg-pink-100 rounded-lg text-pink-500">
                                    <Play className="w-5 h-5 fill-current" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Session Information</h3>
                                    <p className="text-xs text-gray-500">Scenario attempt details</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {scenario.session_id && (
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase">Session ID</span>
                                        <p className="text-sm text-gray-900 font-mono">{scenario.session_id}</p>
                                    </div>
                                )}
                                
                                {completedAt && (
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase">Completed At</span>
                                        <p className="text-sm text-gray-900">{formatDate(completedAt)}</p>
                                    </div>
                                )}
                                
                                {scenario.created_at && (
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase">Started At</span>
                                        <p className="text-sm text-gray-900">{formatDate(scenario.created_at)}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Performance Analysis */}
                    {(strengths.length > 0 || weaknesses.length > 0 || detailedFeedback) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-purple-100 rounded text-purple-600">
                                    <Star className="w-4 h-4 fill-current" />
                                </div>
                                <h3 className="font-bold text-gray-900">Performance Analysis</h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Strengths */}
                                {strengths.length > 0 && (
                                    <div className="bg-[#F0FDF4] border border-green-100 rounded-xl p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-bold text-green-800 flex items-center gap-2">
                                                <CheckCircle2 className="w-5 h-5 text-green-600" /> Key Strengths
                                            </h4>
                                        </div>
                                        <div className="space-y-4">
                                            {Array.isArray(strengths) ? strengths.map((item: string, idx: number) => (
                                                <div key={idx} className="flex gap-3">
                                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-200 text-green-700 flex items-center justify-center text-xs font-bold">
                                                        {idx + 1}
                                                    </div>
                                                    <p className="text-xs text-green-900 leading-relaxed font-medium">
                                                        {item}
                                                    </p>
                                                </div>
                                            )) : (
                                                <p className="text-xs text-green-900 leading-relaxed font-medium">
                                                    {typeof strengths === 'string' ? strengths : JSON.stringify(strengths)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Improvements */}
                                {weaknesses.length > 0 && (
                                    <div className="bg-[#EFF6FF] border border-blue-100 rounded-xl p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-bold text-blue-800 flex items-center gap-2">
                                                <AlertCircle className="w-5 h-5 text-blue-600" /> Areas for Improvement
                                            </h4>
                                        </div>
                                        <div className="space-y-4">
                                            {Array.isArray(weaknesses) ? weaknesses.map((item: string, idx: number) => (
                                                <div key={idx} className="flex gap-3">
                                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold">
                                                        {idx + 1}
                                                    </div>
                                                    <p className="text-xs text-blue-900 leading-relaxed font-medium">
                                                        {item}
                                                    </p>
                                                </div>
                                            )) : (
                                                <p className="text-xs text-blue-900 leading-relaxed font-medium">
                                                    {typeof weaknesses === 'string' ? weaknesses : JSON.stringify(weaknesses)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Detailed Feedback */}
                            {detailedFeedback && (
                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <h4 className="font-bold text-gray-900 mb-3">Detailed Feedback</h4>
                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {detailedFeedback}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Skills Report Card */}
                    {Object.keys(reportCard).length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-yellow-100 rounded text-yellow-600">
                                    <Star className="w-4 h-4 fill-current" />
                                </div>
                                <h3 className="font-bold text-gray-900">Skills Report Card</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(reportCard).map(([skillName, skillData], index) => {
                                    const typedSkillData = skillData as number | { score: number; description?: string };
                                    const score = typeof typedSkillData === 'number' ? typedSkillData : typedSkillData?.score || 0;
                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.5 + (index * 0.05) }}
                                            className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-sm">{skillName}</h4>
                                                </div>
                                                <div className={cn(
                                                    "text-lg font-bold px-2 py-1 rounded bg-gray-50",
                                                    score >= 8 ? "text-emerald-600" : score >= 5 ? "text-amber-600" : "text-red-600"
                                                )}>
                                                    {score.toFixed(1)}<span className="text-gray-400 text-xs font-normal">/10</span>
                                                </div>
                                            </div>

                                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(score / 10) * 100}%` }}
                                                    transition={{ duration: 1, delay: 0.6 + (index * 0.05) }}
                                                    className={cn(
                                                        "h-full rounded-full",
                                                        score >= 8 ? "bg-emerald-400" : score >= 5 ? "bg-amber-400" : "bg-red-400"
                                                    )}
                                                ></motion.div>
                                            </div>

                                            {typeof typedSkillData === 'object' && typedSkillData.description && (
                                                <p className="text-xs text-gray-500 leading-relaxed">
                                                    {typedSkillData.description}
                                                </p>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* Full Evaluation JSON (for debugging/admin) */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <details className="cursor-pointer">
                            <summary className="text-xs font-bold text-gray-600 uppercase">View Raw Evaluation Data</summary>
                            <pre className="mt-2 text-xs text-gray-700 overflow-auto max-h-96 bg-white p-4 rounded border">
                                {JSON.stringify(evaluation, null, 2)}
                            </pre>
                        </details>
                    </div>
                </>
            )}

            <div className="bg-purple-50 text-purple-700 text-xs p-4 rounded-xl text-center border border-purple-100 flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                AI Interview results are automatically populated from the interview system and cannot be edited here.
            </div>
        </div>
    );
};

export default AdminScenarioDetail;
