import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminStore } from '../store/useAdminStore';
import { Card, CardContent } from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Search, Eye, Download, UserPlus, Users, Target, Activity } from 'lucide-react';
import { cn } from '../utils/cn';

const AVATAR_COLORS = [
    'bg-blue-100 text-blue-600',
    'bg-purple-100 text-purple-600',
    'bg-amber-100 text-amber-600',
    'bg-emerald-100 text-emerald-600',
    'bg-rose-100 text-rose-600',
    'bg-indigo-100 text-indigo-600'
];

const Skeleton = ({ className }: { className?: string }) => (
    <div className={cn("animate-pulse bg-gray-200 rounded", className)} />
);

const AdminDashboard = () => {
    const { teachers, fetchTeachers, isLoading: isStoreLoading } = useAdminStore();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState<'All' | 'In Progress' | 'Completed' | 'Not Started'>('All');
    const [isLoading, setIsLoading] = React.useState(true);
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 5;

    React.useEffect(() => {
        const loadDocs = async () => {
            await fetchTeachers();
            setIsLoading(false);
        };
        loadDocs();
    }, [fetchTeachers]);

    // Reset to first page when searching or filtering
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const filteredTeachers = teachers.filter((teacher: any) => {
        const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.email.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (statusFilter === 'All') return true;

        const completedCount = teacher.scenarioProgress?.filter((s: any) => s.status === 'COMPLETED').length || 0;
        const inProgressCount = teacher.scenarioProgress?.filter((s: any) => s.status === 'IN_PROGRESS').length || 0;

        if (statusFilter === 'Completed') return completedCount === 4;
        if (statusFilter === 'In Progress') return inProgressCount > 0;
        if (statusFilter === 'Not Started') return completedCount === 0 && inProgressCount === 0;

        return true;
    });

    const totalFiltered = filteredTeachers.length;
    const totalPages = Math.ceil(totalFiltered / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTeachers = filteredTeachers.slice(startIndex, startIndex + itemsPerPage);

    const totalTeachers = teachers.length;
    const avgProgress = totalTeachers > 0
        ? Math.round(teachers.reduce((acc: number, t: any) => acc + (t.scenarioProgress?.filter((s: any) => s.status === 'COMPLETED').length || 0), 0) / (totalTeachers * 4) * 100)
        : 0;
    const activeTeachers = teachers.filter((t: any) => t.scenarioProgress?.some((s: any) => s.status === 'IN_PROGRESS')).length;

    // Helper function to get last activity date
    const getLastActivity = (teacher: any) => {
        const attempts = teacher.scenarioProgress || [];
        if (attempts.length === 0) return null;
        
        const dates = attempts
            .map((a: any) => a.updated_at ? new Date(a.updated_at) : a.created_at ? new Date(a.created_at) : null)
            .filter((d: Date | null) => d !== null) as Date[];
        
        if (dates.length === 0) return null;
        
        const latest = new Date(Math.max(...dates.map(d => d.getTime())));
        return latest;
    };

    // Helper function to format relative time
    const formatRelativeTime = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    return (
        <div className="p-4 sm:p-6 md:p-10 space-y-10 bg-[#F9FAFB] min-h-full font-sans">
            {/* Header section - Refined alignment */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-1.5 text-center md:text-left">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
                    <p className="text-gray-500 font-medium text-lg">Manage teachers and view performance analytics.</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none gap-2.5 h-12 px-8 border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300 transition-all font-bold shadow-sm">
                        <Download className="w-5 h-5" />
                        Export Data
                    </Button>
                    <Button className="flex-1 md:flex-none gap-2.5 h-12 px-8 shadow-lg shadow-blue-100/50 hover:shadow-blue-200/50 transition-all font-bold">
                        <UserPlus className="w-5 h-5" />
                        Add Teacher
                    </Button>
                </div>
            </div>

            {/* Summary Stats Section - More compact & premium */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading || isStoreLoading ? (
                    [1, 2, 3].map(i => (
                        <Card key={i} className="border-none shadow-sm"><CardContent className="p-8 flex items-center gap-6"><Skeleton className="w-14 h-14 rounded-2xl" /><div className="space-y-3"><Skeleton className="w-24 h-4" /><Skeleton className="w-16 h-8" /></div></CardContent></Card>
                    ))
                ) : (
                    [
                        { label: 'Total Teachers', value: totalTeachers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50/50' },
                        { label: 'Avg. Progress', value: `${avgProgress}%`, icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50/50' },
                        { label: 'Active Now', value: activeTeachers, icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50/50' },
                    ].map((stat, idx) => (
                        <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-all duration-300 group">
                            <CardContent className="p-8 flex items-center gap-7">
                                <div className={cn("p-4 rounded-[22px] shadow-sm transition-transform duration-300 group-hover:scale-110", stat.bg)}>
                                    <stat.icon className={cn("w-7 h-7", stat.color)} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.15em]">{stat.label}</p>
                                    <p className="text-4xl font-black text-gray-900">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <Card className="border-gray-200/60 shadow-md shadow-gray-200/20 overflow-hidden bg-white rounded-3xl">
                <div className="p-8 border-b border-gray-100 lg:flex lg:items-center lg:justify-between gap-6 space-y-4 lg:space-y-0">
                    <div className="relative w-full max-w-xl group">
                        <Input
                            placeholder="Search teachers by name or email..."
                            className="pl-12 h-14 text-base rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all shadow-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            leftIcon={<Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors ml-1" />}
                        />
                    </div>

                    <div className="flex items-center gap-1.5 p-1.5 bg-gray-50/80 rounded-2xl border border-gray-100/50 w-fit">
                        {(['All', 'In Progress', 'Completed', 'Not Started'] as const).map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setStatusFilter(filter)}
                                className={cn(
                                    "px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300",
                                    statusFilter === filter
                                        ? "bg-white text-blue-600 shadow-md shadow-gray-200/50 ring-1 ring-gray-100"
                                        : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                                )}>
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <CardContent className="p-0">
                    {isLoading || isStoreLoading ? (
                        <div className="p-10 space-y-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-6"><Skeleton className="w-14 h-14 rounded-full" /><div className="flex-1 space-y-3"><Skeleton className="w-64 h-5" /><Skeleton className="w-40 h-4" /></div><Skeleton className="w-48 h-12 rounded-2xl" /></div>
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto hidden md:block">
                                <table className="w-full text-left border-collapse min-w-[900px]">
                                    <thead className="bg-[#F9FAFB] border-b border-gray-200">
                                        <tr>
                                            <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em] w-[25%]" scope="col">Teacher</th>
                                            <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em] w-[35%]" scope="col">Progress & Status</th>
                                            <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em] w-[25%]" scope="col">AI Evaluation Summary</th>
                                            <th className="px-10 py-6 text-xs font-black text-gray-400 uppercase tracking-[0.2em] w-[15%] text-right" scope="col">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {paginatedTeachers.map((teacher: any, idx: number) => {
                                            const completedCount = teacher.scenarioProgress?.filter((s: any) => s.status === 'COMPLETED').length || 0;
                                            const progress = (completedCount / 4) * 100;
                                            const lastActivity = getLastActivity(teacher);

                                            return (
                                                <tr key={teacher.id} className="hover:bg-gray-50/50 transition-all duration-200 group">
                                                    <td className="px-10 py-8">
                                                        <div className="flex items-center gap-5">
                                                            <div className={cn(
                                                                "h-14 w-14 rounded-full flex items-center justify-center font-black text-xl shadow-md ring-4 ring-white transition-transform duration-300 group-hover:scale-105",
                                                                AVATAR_COLORS[(startIndex + idx) % AVATAR_COLORS.length]
                                                            )}>
                                                                {teacher.name.charAt(0)}
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-lg leading-tight">{teacher.name}</div>
                                                                <div className="text-sm text-gray-500 font-medium">{teacher.email}</div>
                                                                {lastActivity && (
                                                                    <div className="text-xs text-gray-400 mt-0.5">
                                                                        Last active: {formatRelativeTime(lastActivity)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-8">
                                                        <div className="flex flex-col max-w-sm">
                                                            <div className="flex items-end justify-between mb-3">
                                                                <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.1em]">Training Progress</span>
                                                                <span className="text-2xl font-black text-gray-900 leading-none">{Math.round(progress)}%</span>
                                                            </div>
                                                            <div className="w-full h-3 bg-gray-100/80 rounded-full overflow-hidden shadow-inner border border-gray-200/20">
                                                                <div
                                                                    className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(37,99,235,0.4)]"
                                                                    style={{ width: `${progress}%` }}
                                                                />
                                                            </div>
                                                            <div className="flex gap-3.5 mt-5 items-center">
                                                                {[1, 2, 3, 4].map((sid) => {
                                                                    const scenario = teacher.scenarioProgress?.find((s: any) => s.scenarioId === sid.toString());
                                                                    const status = scenario?.status || 'NOT_STARTED';
                                                                    return (
                                                                        <div
                                                                            key={sid}
                                                                            className={cn(
                                                                                "w-3.5 h-3.5 rounded-full transition-all duration-300 ring-4 ring-white shadow-sm",
                                                                                status === 'COMPLETED' ? 'bg-green-500 shadow-green-100/50' :
                                                                                    status === 'IN_PROGRESS' ? 'bg-blue-500 animate-pulse shadow-blue-100/50' :
                                                                                        'bg-gray-200'
                                                                            )}
                                                                            title={`Scenario ${sid}: ${status}`}
                                                                        />
                                                                    );
                                                                })}
                                                                <span className="text-[11px] font-black text-gray-400 ml-1.5 uppercase tracking-[0.05em]">Scenarios</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-8">
                                                        <div className="max-w-xs">
                                                            {teacher.evaluation ? (
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded border border-blue-100">LLM Analysis</div>
                                                                    </div>
                                                                    <p className="text-xs text-gray-600 line-clamp-3 font-medium leading-relaxed bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                                                                        {teacher.evaluation.llmSummary}
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <div className="text-xs text-gray-400 font-bold italic flex items-center gap-2 bg-gray-50/30 p-3 rounded-xl border border-dashed border-gray-200">
                                                                    <Activity className="w-3.5 h-3.5 opacity-50" />
                                                                    Analysis pending completion...
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-8 text-right">
                                                        <Link to={`/admin/teacher/${teacher.id}`} className="inline-block">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-11 px-6 gap-3 border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all rounded-2xl shadow-sm hover:shadow-md"
                                                                aria-label={`View details for ${teacher.name}`}
                                                            >
                                                                <Eye className="w-5 h-5" />
                                                                <span className="font-bold text-base">Details</span>
                                                            </Button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="md:hidden divide-y divide-gray-100">
                                {paginatedTeachers.map((teacher: any, idx: number) => {
                                    const completedCount = teacher.scenarioProgress?.filter((s: any) => s.status === 'COMPLETED').length || 0;
                                    const progress = (completedCount / 4) * 100;
                                    return (
                                        <div key={teacher.id} className="p-8 space-y-7">
                                            <div className="flex items-center gap-5">
                                                <div className={cn(
                                                    "h-16 w-16 rounded-full flex items-center justify-center font-black text-2xl shadow-md ring-4 ring-white",
                                                    AVATAR_COLORS[(startIndex + idx) % AVATAR_COLORS.length]
                                                )}>
                                                    {teacher.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="font-black text-gray-900 text-xl">{teacher.name}</div>
                                                    <div className="text-sm text-gray-500 font-medium">{teacher.email}</div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-xs font-black text-gray-400 uppercase tracking-[0.1em]">Training Progress</span>
                                                    <span className="text-2xl font-black text-gray-900">{Math.round(progress)}%</span>
                                                </div>
                                                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                                    <div
                                                        className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                                <div className="flex gap-4 pt-2">
                                                    {[1, 2, 3, 4].map((sid) => {
                                                        const scenario = teacher.scenarioProgress?.find((s: any) => s.scenarioId === sid.toString());
                                                        const status = scenario?.status || 'NOT_STARTED';
                                                        return (
                                                            <div
                                                                key={sid}
                                                                className={cn(
                                                                    "w-4 h-4 rounded-full ring-4 ring-white shadow-sm",
                                                                    status === 'COMPLETED' ? 'bg-green-500' :
                                                                        status === 'IN_PROGRESS' ? 'bg-blue-500 animate-pulse' :
                                                                            'bg-gray-200'
                                                                )}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {teacher.evaluation && (
                                                <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50">
                                                    <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest block mb-2">Summarized Insight</span>
                                                    <p className="text-sm text-gray-700 font-medium italic">"{teacher.evaluation.llmSummary.substring(0, 100)}..."</p>
                                                </div>
                                            )}

                                            <Link to={`/admin/teacher/${teacher.id}`} className="block">
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-center gap-3 h-14 border-gray-200 text-gray-700 font-bold rounded-2xl text-lg shadow-sm"
                                                >
                                                    <Eye className="w-6 h-6" />
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {totalFiltered === 0 && !isLoading && !isStoreLoading && (
                        <div className="py-32 text-center px-10">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-[32px] bg-gray-50 text-gray-300 mb-8 border border-gray-100">
                                <Search className="w-12 h-12" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">No teachers found</h3>
                            <p className="text-gray-500 mt-3 max-w-sm mx-auto text-lg leading-relaxed">We couldn't find any results matching your search or filters. Try adjusting your criteria.</p>
                            <Button
                                variant="ghost"
                                className="mt-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-8 h-12 rounded-xl text-lg font-bold"
                                onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}
                            >
                                Clear All Search & Filters
                            </Button>
                        </div>
                    )}
                </CardContent>

                {/* Pagination Controls - Pixel Perfect Alignment */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 p-10 border-t border-gray-100 bg-[#FBFBFC]">
                    <div className="flex items-center">
                        <span className="text-base font-bold text-gray-500">
                            Showing <span className="text-gray-900 mx-0.5">{totalFiltered > 0 ? startIndex + 1 : 0}</span> to <span className="text-gray-900 mx-0.5">{Math.min(startIndex + itemsPerPage, totalFiltered)}</span> of <span className="text-gray-900 mx-0.5">{totalFiltered}</span> teachers
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl px-6 h-12 border-gray-200 text-gray-600 hover:bg-white hover:text-blue-600 hover:border-blue-200 transition-all font-bold shadow-sm disabled:opacity-25"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1 || isLoading || isStoreLoading}
                        >
                            Previous
                        </Button>
                        <div className="flex items-center gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    className={cn(
                                        "w-12 h-12 rounded-xl text-base font-black transition-all duration-300 border flex items-center justify-center",
                                        currentPage === page
                                            ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100 ring-2 ring-blue-50"
                                            : "text-gray-500 border-gray-200 bg-white hover:border-gray-300 hover:text-gray-700 hover:shadow-sm"
                                    )}
                                    onClick={() => setCurrentPage(page)}
                                    disabled={isLoading || isStoreLoading}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl px-6 h-12 border-gray-200 text-gray-600 hover:bg-white hover:text-blue-600 hover:border-blue-200 transition-all font-bold shadow-sm disabled:opacity-25"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0 || isLoading || isStoreLoading}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AdminDashboard;
