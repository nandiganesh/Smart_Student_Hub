import React, { useState, useEffect } from 'react'
import { TrendingUp, Users, Award, Clock, Plus, FileText, CheckCircle, AlertCircle, BarChart, Filter, Download, Upload, Share2, User, Edit } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import StatsCard from '../components/StatsCard'
import Button from '../components/Button'
import { useTasks } from '../hooks/useTasks'
import { useUserPoints } from '../hooks/useUserPoints'
import { useAuth } from '../context/AuthContext'
import { downloadPortfolio } from '../utils/portfolioDownload'

const Dashboard = () => {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [downloadMessage, setDownloadMessage] = useState('')

  // Fetch student dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:8000/api/dashboard/${user._id}/dashboard`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        setDashboardData(result.data)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (user?._id) {
      fetchDashboardData()
    }
  }, [user])
  
  // Calculate stats with fallbacks
  const totalActivities = dashboardData?.stats?.totalActivities || 0
  const verifiedActivities = dashboardData?.stats?.verifiedActivities || 0
  const pendingActivities = dashboardData?.stats?.pending || 0
  const totalCredits = dashboardData?.stats?.credits || 0

  // Handle portfolio download
  const handleDownloadPortfolio = async () => {
    if (!user?._id) {
      setDownloadMessage('User not authenticated')
      return
    }

    setDownloadLoading(true)
    setDownloadMessage('')
    
    try {
      const result = await downloadPortfolio(user._id)
      setDownloadMessage(result.message)
      
      // Clear message after 3 seconds
      setTimeout(() => setDownloadMessage(''), 3000)
    } catch (error) {
      setDownloadMessage('Failed to download portfolio')
      setTimeout(() => setDownloadMessage(''), 3000)
    } finally {
      setDownloadLoading(false)
    }
  }

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      'Verified': 'bg-green-100 text-green-700',
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Rejected': 'bg-red-100 text-red-700'
    }
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[status] || styles['Pending']}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <div className="flex space-x-3">
          <Button 
            variant="green" 
            icon={<Download className="w-4 h-4" />}
            onClick={handleDownloadPortfolio}
            disabled={downloadLoading}
            className="text-sm sm:text-base"
          >
            <span className="hidden sm:inline">{downloadLoading ? 'Generating...' : 'Download Portfolio'}</span>
            <span className="sm:hidden">Portfolio</span>
          </Button>
        </div>
      </div>

      {/* Download Message */}
      {downloadMessage && (
        <div className={`p-3 rounded-lg text-sm ${
          downloadMessage.includes('success') || downloadMessage.includes('downloaded')
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {downloadMessage}
        </div>
      )}

      {/* Welcome Message */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
          Welcome, {dashboardData?.user?.name || user?.fullName || 'Student'}! 👋
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Here's your academic progress and achievements overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        {loading ? (
          <div className="col-span-2 lg:col-span-4 text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">Loading dashboard data...</div>
        ) : error ? (
          <div className="col-span-2 lg:col-span-4 bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base">
            Error loading data: {error}
          </div>
        ) : (
          <>
            <StatsCard
              title="Total Activities"
              value={totalActivities.toString()}
              icon={<TrendingUp className="w-6 h-6" />}
              color="blue"
            />
            <StatsCard
              title="Verified Activities"
              value={verifiedActivities.toString()}
              icon={<CheckCircle className="w-6 h-6" />}
              color="green"
            />
            <StatsCard
              title="Pending Review"
              value={pendingActivities.toString()}
              icon={<Clock className="w-6 h-6" />}
              color="orange"
            />
            <StatsCard
              title="Total Credits"
              value={totalCredits.toString()}
              icon={<Award className="w-6 h-6" />}
              color="purple"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Academic Progress Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Academic Progress Snapshot</h3>
          <div className="h-48 sm:h-64">
            {dashboardData?.academicProgress?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardData.academicProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semester" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="cgpa" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    name="CGPA"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Attendance %"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="bg-orange-500 rounded-lg h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <BarChart className="w-12 h-12 mx-auto mb-2" />
                  <p>Academic progress chart</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile & Quick Actions */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Student Profile</h3>
          
          {/* Profile Info */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
              {dashboardData?.student?.photoUrl ? (
                <img 
                  src={dashboardData.student.photoUrl} 
                  alt="Profile" 
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-white text-sm sm:text-lg font-medium">
                  {dashboardData?.user?.name?.charAt(0) || user?.fullName?.charAt(0) || 'S'}
                </span>
              )}
            </div>
            <h4 className="text-sm sm:text-base font-medium text-gray-900">{dashboardData?.user?.name || user?.fullName}</h4>
            <p className="text-xs sm:text-sm text-gray-500">{dashboardData?.user?.department || user?.department}</p>
            <div className="mt-1 sm:mt-2 text-xs text-gray-600">
              <p>Roll No: {dashboardData?.student?.rollNo || user?.studentId}</p>
              <p>Batch: {dashboardData?.student?.batch || '2021-2025'}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2 sm:space-y-3">
            <button className="w-full flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 text-left hover:bg-gray-50 rounded-lg">
              <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <div>
                <div className="text-sm sm:text-base font-medium">Upload Certificate</div>
                <div className="text-xs sm:text-sm text-gray-500">Add new achievement</div>
              </div>
            </button>
            <button 
              onClick={handleDownloadPortfolio}
              disabled={downloadLoading}
              className="w-full flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 text-left hover:bg-gray-50 rounded-lg"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <div>
                <div className="text-sm sm:text-base font-medium">
                  {downloadLoading ? 'Generating...' : 'Download Portfolio'}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Get PDF portfolio</div>
              </div>
            </button>
            <button className="w-full flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 text-left hover:bg-gray-50 rounded-lg">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <div>
                <div className="text-sm sm:text-base font-medium">Share Profile</div>
                <div className="text-xs sm:text-sm text-gray-500">Get profile link</div>
              </div>
            </button>
        </div>
        <p className="text-xs text-gray-500 mt-3 sm:mt-4">Quick actions to manage your profile.</p>
      </div>
    </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 space-y-2 sm:space-y-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Activities</h3>
          <button className="text-orange-600 hover:text-orange-700 text-sm font-medium text-left sm:text-right">
            View all
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">Loading activities...</div>
        ) : dashboardData?.activities?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-900 text-xs sm:text-sm">Activity</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-900 text-xs sm:text-sm hidden sm:table-cell">Category</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-900 text-xs sm:text-sm hidden md:table-cell">Date</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-900 text-xs sm:text-sm hidden lg:table-cell">Points</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-medium text-gray-900 text-xs sm:text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.activities.slice(0, 5).map((activity, index) => (
                  <tr key={activity._id || index} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <div className="text-sm sm:text-base font-medium">{activity.title}</div>
                      <div className="text-xs sm:text-sm text-gray-500">{activity.organizer}</div>
                      <div className="text-xs text-gray-500 sm:hidden mt-1">
                        {activity.category} • {new Date(activity.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm hidden sm:table-cell">{activity.category}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm hidden md:table-cell">
                      {new Date(activity.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 text-xs sm:text-sm hidden lg:table-cell">{activity.points || 0}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      {getStatusBadge(activity.verificationStatus)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <FileText className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm sm:text-base">No activities found</p>
            <p className="text-xs sm:text-sm">Upload your first certificate to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
