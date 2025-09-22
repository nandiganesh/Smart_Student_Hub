import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'

// Import pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import LoginChoice from './pages/LoginChoice'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import ActivityTracker from './pages/ActivityTracker'
import Portfolio from './pages/Portfolio'
import DepartmentParticipation from './pages/DepartmentParticipation'
import Reports from './pages/Reports'
import UploadCertificate from './pages/UploadAchievement'
import FacultyApproval from './pages/FacultyApproval'
import StudentAchievements from './pages/StudentAchievements'
import AcademicProgress from './pages/AcademicProgress'
import MarksManagement from './pages/MarksManagement'
import CertificateVerification from './pages/CertificateVerification'
import StudentDashboard from './pages/StudentDashboard'
import Projects from './pages/Projects'
import ProjectVerification from './pages/ProjectVerification'
import Unauthorized from './pages/Unauthorized'
import FacultyDashboard from './pages/FacultyDashboard'
import StudentVerificationPanel from './pages/StudentVerificationPanel'
import MentorshipTools from './pages/MentorshipTools'
import FacultyAnalytics from './pages/FacultyAnalytics'
import AdminDashboard from './pages/AdminDashboard'
import UserManagement from './pages/UserManagement'
import ApprovalOversight from './pages/ApprovalOversight'
import InstitutionalReports from './pages/InstitutionalReports'
import IntegrationSettings from './pages/IntegrationSettings'
import NotificationsAnnouncements from './pages/NotificationsAnnouncements'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login-choice" element={<LoginChoice />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
            <Route path="/student-dashboard" element={<ProtectedRoute allowedRoles={['student']}><Layout><Dashboard /></Layout></ProtectedRoute>} />
            <Route path="/activity-tracker" element={<ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}><Layout><ActivityTracker /></Layout></ProtectedRoute>} />
            <Route path="/portfolio" element={<ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}><Layout><Portfolio /></Layout></ProtectedRoute>} />
            <Route path="/achievements" element={<ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}><Layout><StudentAchievements /></Layout></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}><Layout><Projects /></Layout></ProtectedRoute>} />
            <Route path="/upload" element={<ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}><Layout><UploadCertificate /></Layout></ProtectedRoute>} />
            <Route path="/department-participation" element={<ProtectedRoute allowedRoles={['faculty', 'admin']}><Layout><DepartmentParticipation /></Layout></ProtectedRoute>} />
            <Route path="/reports-analytics" element={<ProtectedRoute allowedRoles={['faculty', 'admin']}><Layout><Reports /></Layout></ProtectedRoute>} />
            <Route path="/upload-achievement" element={<ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}><Layout><UploadCertificate /></Layout></ProtectedRoute>} />
            <Route path="/faculty-approval" element={<ProtectedRoute allowedRoles={['faculty', 'admin']}><Layout><FacultyApproval /></Layout></ProtectedRoute>} />
            <Route path="/marks-management" element={<ProtectedRoute allowedRoles={['faculty']}><Layout><MarksManagement /></Layout></ProtectedRoute>} />
            <Route path="/certificate-verification" element={<ProtectedRoute allowedRoles={['faculty', 'admin']}><Layout><CertificateVerification /></Layout></ProtectedRoute>} />
            <Route path="/project-verification" element={<ProtectedRoute allowedRoles={['faculty', 'admin']}><Layout><ProjectVerification /></Layout></ProtectedRoute>} />
            <Route path="/student-achievements" element={<ProtectedRoute allowedRoles={['student', 'admin']}><Layout><StudentAchievements /></Layout></ProtectedRoute>} />
            <Route path="/academic-progress" element={<ProtectedRoute allowedRoles={['student', 'admin']}><Layout><AcademicProgress /></Layout></ProtectedRoute>} />
            
            {/* Faculty Routes */}
            <Route path="/faculty-dashboard" element={<ProtectedRoute allowedRoles={['faculty', 'admin']}><Layout><FacultyDashboard /></Layout></ProtectedRoute>} />
            <Route path="/student-verification" element={<ProtectedRoute allowedRoles={['faculty', 'admin']}><Layout><StudentVerificationPanel /></Layout></ProtectedRoute>} />
            <Route path="/mentorship-tools" element={<ProtectedRoute allowedRoles={['faculty', 'admin']}><Layout><MentorshipTools /></Layout></ProtectedRoute>} />
            <Route path="/faculty-analytics" element={<ProtectedRoute allowedRoles={['faculty', 'admin']}><Layout><FacultyAnalytics /></Layout></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
            <Route path="/admin/approvals" element={<ProtectedRoute allowedRoles={['admin']}><ApprovalOversight /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><InstitutionalReports /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><IntegrationSettings /></ProtectedRoute>} />
            <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={['admin']}><NotificationsAnnouncements /></ProtectedRoute>} />
            
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
