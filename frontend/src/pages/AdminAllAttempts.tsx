import { useParams } from 'react-router-dom';
import { useAdminStore } from '../store/useAdminStore';
import { Card } from '../components/common/Card';
import { CheckCircle2, Clock, Star, MessageSquare, ArrowLeft } from 'lucide-react';
import { cn } from '../utils/cn';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const SCENARIO_NAMES: Record<string, string> = {
    '1': 'PTM Assessment: Handling Parent Concerns',
    '2': 'PTM Coach: Framework Mastery',
    '3': 'Renewal Roleplay: Hesitant Parent (English Communication)',
    '4': 'Coach: The Perfect Renewal Call'
};

const AdminAllAttempts = () => {
    const { id } = useParams<{ id: string }>();
    const { teachers } = useAdminStore();
    const teacher = teachers.find(t => t.id === id);

    if (!teacher) return <div className="text-center p-8">Teacher not found</div>;

    // Group attempts by scenario
    const attemptsByScenario = teacher.scenarioProgress.reduce((acc, attempt) => {
        const scenarioId = attempt.scenarioId;
        if (!acc[scenarioId]) {
            acc[scenarioId] = [];
        }
        acc[scenarioId].push(attempt);
        return acc;
    }, {} as Record<string, typeof teacher.scenarioProgress>);

    // Sort scenarios by ID
    const scenarioIds = Object.keys(attemptsByScenario).sort();

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

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">All Scenario Attempts</h2>
                    <p className="text-sm text-gray-500 mt-1">Complete history of all attempts and feedback for {teacher.name}</p>
                </div>
                <Link to={`/admin/teacher/${id}`}>
                    <Button variant="outline" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Teacher
                    </Button>
                </Link>
            </div>

            {scenarioIds.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-gray-500">No attempts found for this teacher.</p>
                </Card>
            ) : (
                scenarioIds.map((scenarioId) => {
                    const attempts = attemptsByScenario[scenarioId];
                    const scenarioName = SCENARIO_NAMES[scenarioId] || `Scenario ${scenarioId}`;
                    
                    // Sort attempts by attempt number
                    const sortedAttempts = [...attempts].sort((a, b) => {
                        const aNum = a.attemptNumber || 0;
                        const bNum = b.attemptNumber || 0;
                        return aNum - bNum;
                    });
                    
                    return (
                        <Card key={scenarioId} className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{scenarioName}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {sortedAttempts.length} attempt{sortedAttempts.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {sortedAttempts.map((attempt, idx) => {
                                    const evaluation = attempt.evaluation || {};
                                    const score = attempt.score ?? 0;
                                    const isCompleted = attempt.status === 'COMPLETED';
                                    const attemptNumber = attempt.attemptNumber || (idx + 1);

                                    return (
                                        <div
                                            key={attempt.session_id || idx}
                                            className={cn(
                                                "border rounded-xl p-6 transition-all",
                                                isCompleted
                                                    ? "border-green-200 bg-green-50/30"
                                                    : "border-gray-200 bg-gray-50/30"
                                            )}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={cn(
                                                            "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                                                            isCompleted
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-gray-100 text-gray-500"
                                                        )}
                                                    >
                                                        {attemptNumber}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-gray-900">
                                                                Attempt #{attemptNumber}
                                                            </span>
                                                            {isCompleted ? (
                                                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                            ) : (
                                                                <Clock className="w-5 h-5 text-gray-400" />
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-500">
                                                            {attempt.updated_at
                                                                ? formatDate(attempt.updated_at)
                                                                : attempt.created_at
                                                                ? formatDate(attempt.created_at)
                                                                : 'No date'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {score > 0 && (
                                                        <div className="flex items-center gap-2">
                                                            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                                                            <span className="text-2xl font-bold text-gray-900">
                                                                {score}%
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {isCompleted && evaluation && (
                                                <div className="mt-4 space-y-4">
                                                    {/* Strengths */}
                                                    {(evaluation.strengths || evaluation.strength_points) && (
                                                        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                                                            <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                                                                <CheckCircle2 className="w-4 h-4" />
                                                                Strengths
                                                            </h4>
                                                            <ul className="text-sm text-green-900 space-y-1">
                                                                {(() => {
                                                                    const strengthsData = evaluation.strengths || evaluation.strength_points;
                                                                    if (Array.isArray(strengthsData)) {
                                                                        return strengthsData.map((s: string, i: number) => (
                                                                            <li key={i}>• {s}</li>
                                                                        ));
                                                                    } else if (typeof strengthsData === 'string') {
                                                                        return <li>• {strengthsData}</li>;
                                                                    }
                                                                    return null;
                                                                })()}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {/* Areas for Improvement */}
                                                    {(evaluation.weaknesses || evaluation.improvement_areas) && (
                                                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                                            <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                                                                <MessageSquare className="w-4 h-4" />
                                                                Areas for Improvement
                                                            </h4>
                                                            <ul className="text-sm text-blue-900 space-y-1">
                                                                {(() => {
                                                                    const weaknessesData = evaluation.weaknesses || evaluation.improvement_areas;
                                                                    if (Array.isArray(weaknessesData)) {
                                                                        return weaknessesData.map((w: string, i: number) => (
                                                                            <li key={i}>• {w}</li>
                                                                        ));
                                                                    } else if (typeof weaknessesData === 'string') {
                                                                        return <li>• {weaknessesData}</li>;
                                                                    }
                                                                    return null;
                                                                })()}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {/* Detailed Feedback */}
                                                    {evaluation.detailed_feedback && (
                                                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                                                            <h4 className="font-bold text-gray-900 mb-2">Detailed Feedback</h4>
                                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                                                {evaluation.detailed_feedback}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* LLM Summary */}
                                                    {evaluation.llmSummary && (
                                                        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                                                            <h4 className="font-bold text-purple-800 mb-2">AI Summary</h4>
                                                            <p className="text-sm text-purple-900 whitespace-pre-wrap">
                                                                {evaluation.llmSummary}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* View Full Details Link */}
                                                    <Link to={`/admin/teacher/${id}/scenario/${scenarioId}`}>
                                                        <Button variant="outline" size="sm" className="w-full">
                                                            View Full Details
                                                        </Button>
                                                    </Link>
                                                </div>
                                            )}

                                            {!isCompleted && (
                                                <div className="mt-4 text-sm text-gray-500 italic">
                                                    This attempt is not completed yet.
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    );
                })
            )}
        </div>
    );
};

export default AdminAllAttempts;

