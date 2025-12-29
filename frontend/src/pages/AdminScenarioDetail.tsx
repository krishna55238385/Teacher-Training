import { useParams } from 'react-router-dom';
import { useAdminStore } from '../store/useAdminStore';
import { Play, Download, Maximize2, CheckCircle2, AlertCircle, Share2, Star } from 'lucide-react';
import { cn } from '../utils/cn';
import Button from '../components/common/Button';
import { motion } from 'framer-motion';

// Mock detailed data to match the UI image
const MOCK_SCENARIO_DETAILS = {
    interviewStatus: 'Passed',
    score: 7.0,
    percentile: 70,
    videoDuration: '0:06 / 6:01',
    strengths: [
        { id: 1, text: "Exceptional Professional Presentation: The candidate demonstrated exemplary professional readiness with neat attire, neutral background, excellent grooming.", points: 3 },
        { id: 2, text: "Versatile Teaching Experience: With experience in both online and offline teaching modalities (10/10), the candidate shows adaptability.", points: 4 },
        { id: 3, text: "Strong Language Proficiency: Fluent English communication and bilingual capability (English and Hindi) earned a perfect 10/10.", points: 3 }
    ],
    improvements: [
        { id: 1, text: "Grammar Accuracy: With 6 grammatical errors including incorrect pronoun usage ('I my hobbies are'), missing articles.", points: 3 },
        { id: 2, text: "Pronunciation Clarity: Medium mother-tongue influence affecting vowel sounds ('bad' as 'bed') and consonants.", points: 2 },
        { id: 3, text: "Response Brevity: The speaking topic response lasted only 37 seconds, incurring a -3 point penalty.", points: 3 }
    ],
    skills: [
        { name: "Grammar & Sentence Structure", score: 5.0, total: 10, weight: "30%", description: "The user made 5 grammatical errors across the introduction...", color: "bg-amber-400" },
        { name: "Years of Teaching Experience (Ages 4-18)", score: 8.0, total: 10, weight: "10%", description: "The user stated, 'I have two years of teaching experience.'", color: "bg-emerald-400" },
        { name: "Mode of Teaching (Offline/Online/Both)", score: 10.0, total: 10, weight: "5%", description: "The user clearly stated, 'It was both online and offline.'", color: "bg-emerald-500" },
        { name: "Highest Academic Qualification", score: 8, total: 10, weight: "10%", description: "The user stated their highest academic qualification is a postgraduate degree.", color: "bg-emerald-400" },
        { name: "Language Skills", score: 10, total: 10, weight: "5%", description: "The user demonstrated fluent English throughout the conversation.", color: "bg-emerald-500" },
        { name: "Pronunciation", score: 6.5, total: 10, weight: "25%", description: "The speaker demonstrates generally clear pronunciation but a consistent medium MTI.", color: "bg-amber-400" },
        { name: "Professional Presentation & Setup", score: 9.5, total: 10, weight: "15%", description: "The candidate demonstrated excellent professional readiness.", color: "bg-emerald-500" }
    ]
};

const AdminScenarioDetail = () => {
    const { id } = useParams();
    const { teachers } = useAdminStore();
    const teacher = teachers.find(t => t.id === id);

    if (!teacher) return <div>Teacher not found</div>;

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
                        <h2 className="text-xl font-bold text-gray-900">AI Round</h2>
                        <p className="text-sm text-gray-500">View AI round details</p>
                    </div>
                </div>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs font-semibold">Read Only</span>
            </motion.div>

            {/* Top Grid: Result Summary & Video */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Left: Overall Result Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-[#111827] rounded-xl p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[300px] shadow-2xl"
                >
                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-3xl translate-x-1/2 -translate-y-1/2 animate-pulse"></div>

                    <div className="flex justify-between items-start z-10">
                        <div>
                            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Interview Status</div>
                            <div className="text-emerald-400 font-bold text-xl flex items-center gap-2">
                                Passed <CheckCircle2 className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-2 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Qualified
                        </div>
                    </div>

                    <div className="z-10 mt-8">
                        <div className="flex items-end gap-3 mb-2">
                            <span className="text-6xl font-bold text-emerald-400">{MOCK_SCENARIO_DETAILS.score.toFixed(1)}</span>
                            <span className="text-2xl text-gray-400 mb-1.5">/10</span>
                            <span className="text-emerald-400 font-bold text-xl mb-1.5 ml-4">{MOCK_SCENARIO_DETAILS.percentile}%</span>
                            <span className="text-gray-400 text-sm mb-2">Overall Performance</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden mt-4">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "70%" }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                            ></motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Right: Video Recording */}
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
                            <h3 className="font-bold text-gray-900">Interview Recording</h3>
                            <p className="text-xs text-gray-500">Watch the complete AI interview recording</p>
                        </div>
                    </div>

                    <div className="bg-black rounded-lg overflow-hidden aspect-video relative group">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-white text-xs">
                            <span>{MOCK_SCENARIO_DETAILS.videoDuration}</span>
                            <div className="flex gap-3">
                                <Maximize2 className="w-4 h-4 cursor-pointer hover:text-gray-300" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-4 justify-end">
                        <Button size="sm" variant="outline" className="text-xs h-8">
                            <Share2 className="w-3.5 h-3.5 mr-1.5" /> Share
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs h-8">
                            <Download className="w-3.5 h-3.5 mr-1.5" /> Download
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Performance Analysis */}
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
                    <div className="bg-[#F0FDF4] border border-green-100 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-green-800 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-600" /> Key Strengths
                            </h4>
                            <span className="bg-green-200 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full">3 points</span>
                        </div>
                        <div className="space-y-4">
                            {MOCK_SCENARIO_DETAILS.strengths.map((item, idx) => (
                                <div key={item.id} className="flex gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-200 text-green-700 flex items-center justify-center text-xs font-bold">
                                        {idx + 1}
                                    </div>
                                    <p className="text-xs text-green-900 leading-relaxed font-medium">
                                        <span className="font-bold">{item.text.split(":")[0]}:</span>
                                        {item.text.split(":")[1]}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Improvements */}
                    <div className="bg-[#EFF6FF] border border-blue-100 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-blue-800 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-blue-600" /> Areas for Improvement
                            </h4>
                            <span className="bg-blue-200 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">3 points</span>
                        </div>
                        <div className="space-y-4">
                            {MOCK_SCENARIO_DETAILS.improvements.map((item, idx) => (
                                <div key={item.id} className="flex gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-xs font-bold">
                                        {idx + 1}
                                    </div>
                                    <p className="text-xs text-blue-900 leading-relaxed font-medium">
                                        <span className="font-bold">{item.text.split(":")[0]}:</span>
                                        {item.text.split(":")[1]}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Skills Report Card */}
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
                    {MOCK_SCENARIO_DETAILS.skills.map((skill, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + (index * 0.05) }}
                            whileHover={{ scale: 1.01 }}
                            className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{skill.name}</h4>
                                    <span className="text-[10px] uppercase font-bold text-gray-400 mt-1 block">Weight: {skill.weight}</span>
                                </div>
                                <div className={cn("text-lg font-bold px-2 py-1 rounded bg-gray-50",
                                    skill.score >= 8 ? "text-emerald-600" : skill.score >= 5 ? "text-amber-600" : "text-red-600"
                                )}>
                                    {skill.score}<span className="text-gray-400 text-xs font-normal">/10</span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(skill.score / 10) * 100}%` }}
                                    transition={{ duration: 1, delay: 0.6 + (index * 0.05) }}
                                    className={cn("h-full rounded-full", skill.color)}
                                ></motion.div>
                            </div>

                            <p className="text-xs text-gray-500 leading-relaxed">
                                {skill.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <div className="bg-purple-50 text-purple-700 text-xs p-4 rounded-xl text-center border border-purple-100 flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                AI Interview results are automatically populated from the interview system and cannot be edited here.
            </div>

        </div>
    );
};

export default AdminScenarioDetail;
