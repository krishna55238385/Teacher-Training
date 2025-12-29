
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LayoutDashboard, Users, LogOut, GraduationCap, Menu, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import Button from '../common/Button';
import React from 'react';

const DashboardLayout = () => {
    const { user, logout } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = user?.role === 'ADMIN' ? [
        { label: 'Overview', icon: LayoutDashboard, href: '/admin/dashboard' },
        { label: 'Teachers', icon: Users, href: '/admin/teachers' },
    ] : [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
            {/* Top Navigation - Luxury Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        {/* Logo and Desktop Nav */}
                        <div className="flex items-center gap-10">
                            <div className="flex-shrink-0 flex items-center">
                                <Link to="/" className="flex items-center space-x-3 group">
                                    <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-2 rounded-xl shadow-lg shadow-primary-200 group-hover:scale-105 transition-transform duration-300">
                                        <GraduationCap className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 tracking-tight">Bambinos Teacher Training</span>
                                </Link>
                            </div>
                            <div className="hidden md:flex space-x-2">
                                {navItems.map((item) => {
                                    const isActive = location.pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            className={cn(
                                                "inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300",
                                                isActive
                                                    ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
                                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                            )}
                                        >
                                            <item.icon className={cn("h-4 w-4 mr-2", isActive ? "text-blue-600" : "text-gray-400")} />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* User Menu & Mobile Toggle */}
                        <div className="flex items-center">
                            <div className="hidden md:flex md:items-center space-x-6">
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900 leading-tight">{user?.name || 'User'}</p>
                                    <p className="text-[10px] font-medium text-blue-600 uppercase tracking-widest">{user?.role === 'ADMIN' ? 'Administrator' : 'Teacher'}</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-100 to-white p-0.5 shadow-sm ring-1 ring-gray-100">
                                    <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-blue-700 font-bold">
                                        {user?.name?.[0] || 'U'}
                                    </div>
                                </div>

                                <div className="h-8 w-px bg-gray-100"></div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-2"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Mobile menu button */}
                            <div className="flex items-center md:hidden">
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                                >
                                    {isMobileMenuOpen ? (
                                        <X className="block h-6 w-6" />
                                    ) : (
                                        <Menu className="block h-6 w-6" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200">
                        <div className="pt-2 pb-3 space-y-1">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        to={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors",
                                            isActive
                                                ? "bg-primary-50 border-primary-500 text-primary-700"
                                                : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                                        )}
                                    >
                                        <div className="flex items-center">
                                            <item.icon className="h-5 w-5 mr-3" />
                                            {item.label}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                        <div className="pt-4 pb-4 border-t border-gray-200">
                            <div className="flex items-center px-4">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                                        {user?.name?.[0] || 'U'}
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800">{user?.name}</div>
                                    <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                                </div>
                            </div>
                            <div className="mt-3 space-y-1">
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                                >
                                    <div className="flex items-center">
                                        <LogOut className="h-5 w-5 mr-3" />
                                        Sign out
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full mx-auto overflow-hidden bg-gray-50 h-[calc(100vh-4rem)]">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
