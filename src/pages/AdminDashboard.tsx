import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminStore } from '../store/useAdminStore';
import { Card, CardContent, CardHeader } from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Search, Eye } from 'lucide-react';

const AdminDashboard = () => {
    const { teachers } = useAdminStore();
    const [searchTerm, setSearchTerm] = React.useState('');


    const filteredTeachers = teachers.filter(teacher => {
        const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-1">Manage teachers and view performance analytics.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Export Data</Button>
                    <Button>Add Teacher</Button>
                </div>
            </div>

            <Card>
                <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative w-full md:w-96">
                            <Input
                                placeholder="Search teachers by name or email..."
                                leftIcon={<Search className="h-4 w-4" />}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3">Teacher</th>
                                    <th className="px-6 py-3">Progress & Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredTeachers.map((teacher) => {
                                    const completedCount = teacher.scenarioProgress?.filter(s => s.status === 'COMPLETED').length || 0;
                                    const progress = (completedCount / 4) * 100;

                                    return (
                                        <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                                                        {teacher.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{teacher.name}</div>
                                                        <div className="text-xs text-gray-500">{teacher.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-2 min-w-[200px]">
                                                    <div className="flex items-center justify-between text-xs mb-1">
                                                        <span className="text-gray-500 font-medium">Progress</span>
                                                        <span className="text-gray-900 font-semibold">{Math.round(progress)}%</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                                                        <div
                                                            className="h-full bg-primary-600 rounded-full transition-all duration-500"
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {[1, 2, 3, 4].map((id) => {
                                                            const scenario = teacher.scenarioProgress?.find(s => s.scenarioId === id.toString());
                                                            const status = scenario?.status || 'NOT_STARTED';
                                                            return (
                                                                <div key={id} className={`w-3 h-3 rounded-full ${status === 'COMPLETED' ? 'bg-green-500' :
                                                                        status === 'IN_PROGRESS' ? 'bg-blue-500 animate-pulse' :
                                                                            'bg-gray-200'
                                                                    }`} title={`Scenario ${id}: ${status}`} />
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link to={`/admin/teacher/${teacher.id}`}>
                                                    <Button size="sm" variant="ghost">
                                                        View Details <Eye className="ml-2 h-3.5 w-3.5" />
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {filteredTeachers.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                No teachers found matching your search.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminDashboard;
