import { useParams } from 'react-router-dom';
import { useAdminStore } from '../store/useAdminStore';
import { Card } from '../components/common/Card';
import Button from '../components/common/Button';
import {
    Award, Brain, TrendingUp
} from 'lucide-react';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const AdminOverallResult = () => {
    const { id } = useParams<{ id: string }>();
    const { teachers } = useAdminStore();
    const teacher = teachers.find(t => t.id === id);

    if (!teacher) return <div>Teacher not found</div>;

    // Use real data from teacher if available
    const overallStats = {
        totalScore: teacher.scenarioProgress.reduce((sum, p) => sum + (p.score || 0), 0) / (teacher.scenarioProgress.length || 1),
        percentile: 92, // Still mock for now as we don't have batch stats
        rank: 4,
        totalCandidates: 156,
        recommendation: teacher.evaluation ? 'Highly Recommended' : 'Pending Evaluation'
    };

    const skillRadarData = [
        { subject: 'Classroom Mgmt', A: 120, fullMark: 150 },
        { subject: 'Instruction', A: 98, fullMark: 150 },
        { subject: 'Empathy', A: 86, fullMark: 150 },
        { subject: 'Communication', A: 99, fullMark: 150 },
        { subject: 'Adaptability', A: 85, fullMark: 150 },
        { subject: 'Subject Matter', A: 65, fullMark: 150 },
    ];

    const performanceData = teacher.scenarioProgress.map((p, idx) => ({
        name: `Scenario ${idx + 1}`,
        score: p.score || 0,
        avg: 75 // Mock average
    }));

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Top Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-6 border-none shadow-lg bg-white">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg"><Award className="w-6 h-6 text-blue-600" /></div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+4% vs avg</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{overallStats.totalScore.toFixed(0)}/100</div>
                    <div className="text-sm text-gray-500 mt-1">Average Score</div>
                </Card>
                <Card className="p-6 border-none shadow-lg bg-white">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-50 rounded-lg"><TrendingUp className="w-6 h-6 text-purple-600" /></div>
                        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Top 10%</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">#{overallStats.rank}</div>
                    <div className="text-sm text-gray-500 mt-1">Rank among {overallStats.totalCandidates} candidates</div>
                </Card>
                <Card className="p-6 border-none shadow-lg bg-white">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-amber-50 rounded-lg"><Brain className="w-6 h-6 text-amber-600" /></div>
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">High</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">Adaptable</div>
                    <div className="text-sm text-gray-500 mt-1">Key Trait Identified</div>
                </Card>
                <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                    <div className="text-sm text-blue-100 mb-2">Final Recommendation</div>
                    <div className="text-2xl font-bold mb-4">{overallStats.recommendation}</div>
                    <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 border-none">
                        Proceed to Offer
                    </Button>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Radar Chart */}
                <Card className="lg:col-span-1 p-6 border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Competency Map</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillRadarData}>
                                <PolarGrid stroke="#e5e7eb" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                <Radar name="Candidate" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.5} />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Performance vs Average Chart */}
                <Card className="lg:col-span-2 p-6 border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Performance by Scenario</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                                <Tooltip
                                    cursor={{ fill: '#f9fafb' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Bar dataKey="score" name="Candidate Score" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={30} />
                                <Bar dataKey="avg" name="Batch Average" fill="#e5e7eb" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* AI Executive Summary */}
            <Card className="p-8 border-l-4 border-l-blue-600 shadow-sm bg-white">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                        <Brain className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">AI Executive Summary</h3>
                            <p className="text-sm text-gray-500">
                                {teacher.evaluation
                                    ? 'Generated based on analysis of completed scenarios'
                                    : 'Complete all 4 scenarios to generate summary'}
                            </p>
                        </div>
                        <div className="prose prose-sm text-gray-600 max-w-none">
                            {teacher.evaluation ? (
                                <p className="whitespace-pre-wrap">{teacher.evaluation.llmSummary}</p>
                            ) : (
                                <p>Summary will be available once the teacher completes all training scenarios.</p>
                            )}
                            {teacher.evaluation && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100">Strong Communicator</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">Empathetic Leader</span>
                                    <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-100">Tech Savvy</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div >
    );
};

export default AdminOverallResult;
