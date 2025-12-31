
import { Outlet, Link } from 'react-router-dom';
import Button from '../common/Button';
import { GraduationCap } from 'lucide-react';

const PublicLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Header */}
            <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="bg-primary-600 p-2 rounded-lg">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Bambinos Teacher Training</span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#how-it-works" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">How it Works</a>
                        <a href="#benefits" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Benefits</a>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <Link to="/login">
                            <Button>Get Started</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <GraduationCap className="h-6 w-6 text-primary-600" />
                        <span className="text-lg font-bold text-gray-900">Bambinos Teacher Training</span>
                    </div>
                    <p className="text-gray-500 text-sm">© 2024 Teacher Training Platform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
