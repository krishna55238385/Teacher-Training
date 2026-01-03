
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import TeacherDashboard from './pages/TeacherDashboard';
import ScenarioPage from './pages/ScenarioPage';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDetailPage from './pages/TeacherDetailPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import StudentDiary from './pages/StudentDiary';
import AdminScenarioDetail from './pages/AdminScenarioDetail';
import AdminOverallResult from './pages/AdminOverallResult';
import AdminAllAttempts from './pages/AdminAllAttempts';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Student Diary Route - Standalone for custom layout */}
        <Route path="/student-diary" element={<StudentDiary />} />


        {/* Protected Routes - Teacher */}
        <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<TeacherDashboard />} />
            <Route path="/dashboard/scenario/:id" element={<ScenarioPage />} />
          </Route>
        </Route>

        {/* Protected Routes - Admin */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/teacher/:id" element={<TeacherDetailPage />}>
              <Route index element={<Navigate to="scenario/summary" replace />} />
              <Route path="scenario/summary" element={<AdminOverallResult />} />
              <Route path="scenario/:scenarioId" element={<AdminScenarioDetail />} />
              <Route path="attempts" element={<AdminAllAttempts />} />
            </Route>
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
