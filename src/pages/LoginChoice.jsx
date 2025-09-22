import React from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Users, Shield } from 'lucide-react'
import Button from '../components/Button'

const LoginChoice = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Smart Student Hub</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Login Type</h1>
          <p className="text-gray-600 text-lg">Select your role to access the appropriate dashboard</p>
        </div>

        {/* Login Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Student Login */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Student Portal</h3>
            <p className="text-gray-600 mb-6">
              Access your achievements, academic progress, grades, and upload your accomplishments.
            </p>
            <ul className="text-sm text-gray-500 mb-8 space-y-2">
              <li>• View Academic Progress</li>
              <li>• Track Achievements</li>
              <li>• Upload Certificates</li>
              <li>• Monitor Attendance</li>
            </ul>
            <Link to="/login?type=student">
              <Button variant="primary" size="lg" className="w-full">
                Login as Student
              </Button>
            </Link>
          </div>

          {/* Faculty Login */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Faculty Portal</h3>
            <p className="text-gray-600 mb-6">
              Manage student activities, track department participation, and access comprehensive analytics.
            </p>
            <ul className="text-sm text-gray-500 mb-8 space-y-2">
              <li>• Student Management</li>
              <li>• Activity Tracking</li>
              <li>• Department Analytics</li>
              <li>• Reports & Insights</li>
            </ul>
            <Link to="/login?type=faculty">
              <Button variant="primary" size="lg" className="w-full">
                Login as Faculty
              </Button>
            </Link>
          </div>

          {/* Admin Login */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Admin Portal</h3>
            <p className="text-gray-600 mb-6">
              Complete system access with user management, analytics, and administrative controls.
            </p>
            <ul className="text-sm text-gray-500 mb-8 space-y-2">
              <li>• Full System Access</li>
              <li>• User Management</li>
              <li>• System Analytics</li>
              <li>• Administrative Controls</li>
            </ul>
            <Link to="/login?type=admin">
              <Button variant="primary" size="lg" className="w-full">
                Login as Admin
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up here
            </Link>
          </p>
          <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm mt-4 inline-block">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginChoice
