import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Activity, 
  User, 
  Users, 
  BarChart3, 
  Upload,
  Award,
  BookOpen,
  LogOut,
  Briefcase,
  TrendingUp,
  Menu,
  X,
  CheckCircle,
  FileCheck
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const location = useLocation()
  const { logout, user } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Define menu items based on user role
  const getMenuItems = () => {
    const studentItems = [
      { name: 'Student Dashboard', icon: LayoutDashboard, path: '/student-dashboard' },
      { name: 'Portfolio', icon: User, path: '/portfolio' },
      { name: 'My Achievements', icon: Award, path: '/achievements' },
      { name: 'Projects', icon: Briefcase, path: '/projects' },
      { name: 'Academic Progress', icon: TrendingUp, path: '/academic-progress' },
      { name: 'Upload Certificate', icon: Upload, path: '/upload' },
    ]

    const adminItems = [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { name: 'Activity Tracker', icon: Activity, path: '/activity-tracker' },
      { name: 'Department Participation', icon: Users, path: '/department-participation' },
      { name: 'Reports & Analytics', icon: BarChart3, path: '/reports-analytics' },
      { name: 'Upload Certificate', icon: Upload, path: '/upload-achievement' },
      { name: 'My Achievements', icon: Award, path: '/student-achievements' },
      { name: 'Academic Progress', icon: BookOpen, path: '/academic-progress' },
    ]

    const facultyItems = [
      { name: 'Faculty Dashboard', icon: LayoutDashboard, path: '/faculty-dashboard' },
      { name: 'Student Verification', icon: CheckCircle, path: '/student-verification' },
      { name: 'Mentorship Tools', icon: Users, path: '/mentorship-tools' },
      { name: 'Analytics & Reports', icon: BarChart3, path: '/faculty-analytics' },
      { name: 'Marks Management', icon: BookOpen, path: '/marks-management' },
      { name: 'Certificate Verification', icon: CheckCircle, path: '/certificate-verification' },
      { name: 'Project Verification', icon: CheckCircle, path: '/project-verification' },
    ]

    if (user?.role === 'student') {
      return studentItems
    } else if (user?.role === 'faculty') {
      return facultyItems
    } else {
      return adminItems
    }
  }

  const menuItems = getMenuItems()

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-3 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5 text-gray-600" />
        ) : (
          <Menu className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 sm:p-6">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">S</span>
            </div>
            <span className="text-base sm:text-lg font-semibold text-gray-900">Smart Student Hub</span>
          </div>
        </div>

        <nav className="mt-4 sm:mt-6">
          <div className="px-3">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 mb-1 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-orange-50 text-orange-700 border-r-2 border-orange-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                  <span className="text-xs sm:text-sm">{item.name}</span>
                </Link>
              )
            })}
            
            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2 mb-1 text-sm font-medium rounded-lg transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
              <span className="text-xs sm:text-sm">Logout</span>
            </button>
          </div>

          {/* Faculty Approval Section - only show for faculty/admin users */}
          {(user?.role === 'faculty' || user?.role === 'admin') && location.pathname.includes('faculty-approval') && (
            <div className="mt-6 sm:mt-8 px-3">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Faculty Panel
              </h3>
              <div className="text-xs sm:text-sm text-gray-500 px-3">
                Faculty approval features coming soon...
              </div>
            </div>
          )}
        </nav>
      </div>
    </>
  )
}

export default Sidebar
