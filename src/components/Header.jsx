import React from 'react'
import { Settings, User, LogOut } from 'lucide-react'
import Button from './Button'
import NotificationCenter from './NotificationCenter'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4">
        {/* Logo/Title - Only show on mobile when sidebar is hidden */}
        <div className="flex items-center space-x-2 ml-12 lg:hidden">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs sm:text-sm">S</span>
          </div>
          <span className="text-base font-semibold text-gray-900">Smart Student Hub</span>
        </div>

        {/* Spacer for desktop when logo is hidden */}
        <div className="hidden lg:block"></div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-4 ml-auto lg:ml-0">
          <NotificationCenter />
          
          <button className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors hidden sm:block">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          {/* Profile Dropdown */}
          <div className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 rounded-lg">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs sm:text-sm font-medium">
                {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="text-xs sm:text-sm hidden sm:block">
              <div className="font-medium text-gray-900">{user?.fullName || user?.username}</div>
              <div className="text-gray-500 capitalize">{user?.role || 'Student'}</div>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            icon={<LogOut className="w-3 h-3 sm:w-4 sm:h-4" />}
            onClick={handleLogout}
            className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
          >
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header
