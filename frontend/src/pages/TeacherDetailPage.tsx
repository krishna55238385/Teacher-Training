import { useEffect } from 'react';
import { useParams, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAdminStore } from '../store/useAdminStore';
import Button from '../components/common/Button';
import ScenarioTimeline from '../components/common/ScenarioTimeline';
import { MOCK_SCENARIO_RESULTS } from '../data/mockData';
import {
    ArrowLeft, Mail, Phone, Calendar
} from 'lucide-react';

const TeacherDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { teachers, fetchTeacherById, isLoading } = useAdminStore();
    const teacher = teachers.find(t => t.id === id);

    useEffect(() => {
        if (!teacher && id) {
            fetchTeacherById(id);
        }
    }, [id, teacher, fetchTeacherById]);

    if (isLoading && !teacher) {
        return <div className="text-center p-8">Loading teacher details...</div>;
    }

    if (!teacher) {
        return <div className="text-center p-8">Teacher not found</div>;
    }

    // Determine current scenario index
    const isSummary = location.pathname.includes('/scenario/summary');
    const scenarioMatch = location.pathname.match(/\/scenario\/(\d+)/);
    const currentScenarioIndex = scenarioMatch ? parseInt(scenarioMatch[1]) : undefined;

    return (
        <div className="min-h-screen bg-[#F8F9FC] font-sans">
            {/* Blue Header Section */}
            <div className="bg-blue-600 text-white pb-24 pt-6 px-4 sm:px-6 lg:px-8 shadow-xl relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

                <div className="max-w-7xl mx-auto space-y-6 relative z-10">
                    {/* Top Bar */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/admin/dashboard')}
                                className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors text-sm font-medium"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Applications
                            </button>
                        </div>
                        <div className="text-blue-200 text-sm">Application ID: #{teacher.id.substring(0, 8).toUpperCase()}</div>
                    </div>

                    {/* Profile Info */}
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-2xl font-bold shadow-lg">
                            {teacher.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold tracking-tight">
                                {teacher.name}
                            </h1>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-blue-100 text-sm">
                                <span className="flex items-center gap-2"><Mail className="w-4 h-4 opacity-70" /> {teacher.email}</span>
                                <span className="flex items-center gap-2"><Phone className="w-4 h-4 opacity-70" /> {teacher.phone}</span>
                                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 opacity-70" /> Applied on Dec 12, 2024</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button className="bg-white text-blue-600 hover:bg-blue-50 border-none shadow-lg">
                                View Resume
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Overlapping Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-12 relative z-20">

                {/* Timeline Card */}
                <div>
                    <ScenarioTimeline
                        scenarios={MOCK_SCENARIO_RESULTS}
                        teacherId={teacher.id}
                        currentScenarioIndex={currentScenarioIndex}
                        isSummary={isSummary}
                    />
                </div>

                {/* Render Child Routes Here */}
                <Outlet />

            </div>
        </div>
    );
};

export default TeacherDetailPage;
