import { useState } from 'react';
import { User, Calendar, Book, Star, ChevronRight, Shield, Award } from 'lucide-react';
import { cn } from '../utils/cn';
import { Card } from '../components/common/Card';
import Button from '../components/common/Button';

// Mock data
const STUDENT = {
    name: "Alex Johnson",
    grade: "Grade 3",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
};

const DIARY_ENTRIES = [
    {
        id: 1,
        date: "Today, Oct 24",
        subject: "Public Speaking",
        topic: "The Zoo Trip",
        status: "Completed",
        feedback: "Great eye contact! Try to speak a bit louder next time.",
        score: 92
    },
    {
        id: 2,
        date: "Yesterday, Oct 23",
        subject: "Creative Writing",
        topic: "My Favorite Hero",
        status: "Reviewed",
        feedback: "Excellent vocabulary usage. Structure was perfect.",
        score: 95
    },
    {
        id: 3,
        date: "Oct 20",
        subject: "Social Skills",
        topic: "Sharing with Friends",
        status: "Completed",
        feedback: "Very empathetic responses.",
        score: 88
    }
];

const StudentDiary = () => {
    const [activeTab, setActiveTab] = useState<'parent' | 'internal'>('parent');

    return (
        <div className="h-screen w-full bg-[#F0F6FF] flex flex-col overflow-hidden font-sans text-slate-800">
            {/* Header */}
            <header className="h-16 bg-white border-b border-blue-100 px-6 flex items-center justify-between shrink-0 z-10 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        B
                    </div>
                    <span className="text-xl font-bold tracking-tight text-blue-900">bambinos.live</span>
                </div>

                <div className="flex items-center gap-6">
                    {/* Role Toggler for Demo Purpose */}
                    <div className="bg-blue-50 p-1 rounded-lg flex text-xs font-semibold">
                        <button
                            onClick={() => setActiveTab('parent')}
                            className={cn(
                                "px-3 py-1.5 rounded-md transition-all",
                                activeTab === 'parent' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            Parent View
                        </button>
                        <button
                            onClick={() => setActiveTab('internal')}
                            className={cn(
                                "px-3 py-1.5 rounded-md transition-all",
                                activeTab === 'internal' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            Internal View
                        </button>
                    </div>

                    <div className="h-6 w-px bg-slate-200"></div>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-bold text-slate-900">{STUDENT.name}</div>
                            <div className="text-xs text-slate-500">{STUDENT.grade}</div>
                        </div>
                        <div className="relative group cursor-pointer">
                            <img
                                src={STUDENT.avatar}
                                alt="Profile"
                                className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover"
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - No Scroll Container */}
            <main className="flex-1 flex gap-6 p-6 overflow-hidden max-w-7xl mx-auto w-full">

                {/* Left Panel: Summary & Stats */}
                <div className="w-1/3 flex flex-col gap-6 h-full">
                    {/* Welcome Card */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shrink-0 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold mb-1">Hello, {STUDENT.name.split(' ')[0]}!</h2>
                            <p className="text-blue-100 text-sm mb-4 opacity-90">Ready for your next adventure?</p>

                            <div className="flex gap-4 mt-6">
                                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex-1 border border-white/10">
                                    <div className="text-2xl font-bold">12</div>
                                    <div className="text-[10px] uppercase tracking-wider opacity-70">Classes</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex-1 border border-white/10">
                                    <div className="text-2xl font-bold">4.8</div>
                                    <div className="text-[10px] uppercase tracking-wider opacity-70">Avg Score</div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Circles */}
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl"></div>
                    </div>

                    {/* Next Class / Action */}
                    <Card className="flex-1 border-none shadow-md bg-white flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                        <div className="p-6 flex flex-col h-full">
                            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-amber-500" />
                                Next Session
                            </h3>
                            <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
                                <div className="text-amber-900 font-bold text-lg">Public Speaking Masterclass</div>
                                <div className="text-amber-700 text-sm mt-1">Tomorrow • 4:00 PM</div>
                            </div>

                            <div className="mt-auto">
                                <Button className="w-full justify-between group">
                                    Join Preparation Room
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Panel: Diary & Progress */}
                <div className="w-2/3 h-full flex flex-col bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between shrink-0">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Learning Diary</h2>
                            <p className="text-slate-500 text-sm">Track your progress and feedback</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="text-slate-500">Filter</Button>
                            <Button variant="outline" size="sm">Download Report</Button>
                        </div>
                    </div>

                    {/* List Container - Scrollable internally if absolutely needed, but kept minimal */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {DIARY_ENTRIES.map((entry) => (
                            <div key={entry.id} className="group p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-default flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                        {entry.subject.includes("Speaking") ? <User className="w-6 h-6" /> :
                                            entry.subject.includes("Writing") ? <Book className="w-6 h-6" /> : <Star className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-0.5">{entry.subject}</div>
                                        <div className="font-bold text-slate-800">{entry.topic}</div>
                                        {activeTab === 'parent' && (
                                            <p className="text-sm text-slate-500 mt-1 line-clamp-1">{entry.feedback}</p>
                                        )}
                                        {activeTab === 'internal' && (
                                            <div className="flex gap-2 mt-1">
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Synced: LMS</span>
                                                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">Trainer: Sarah M.</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="text-right shrink-0">
                                    <div className="text-2xl font-bold text-slate-900">{entry.score}</div>
                                    <div className="text-xs text-slate-400 font-medium">{entry.date}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer / Stats Strip */}
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                        <div className="flex gap-6">
                            <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-blue-400" /> Secure Record</span>
                            <span className="flex items-center gap-2"><Award className="w-4 h-4 text-amber-400" /> Certificate Eligible</span>
                        </div>
                        <div>
                            Last updated: Just now
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default StudentDiary;
