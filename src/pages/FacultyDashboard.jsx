import React, { useState, useEffect } from 'react'
import { BookOpen, Users, CheckCircle, Clock, FileText, Award, TrendingUp, Activity, Bell, Calendar } from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import StatsCard from '../components/StatsCard'
import { useAuth } from '../context/AuthContext'
import apiService from '../services/api'

// Card sub-components
const CardHeader = ({ children, className = "" }) => (
  <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
    {children}
  </div>
)

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
)

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
)

const FacultyDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingApprovals: 0,
    verifiedCertificates: 0,
    totalPoints: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFacultyStats()
  }, [])

  const fetchFacultyStats = async () => {
    try {
      setLoading(true)
      const result = await apiService.get('/api/faculty/dashboard-stats')
      setStats(result.data || {
        totalStudents: 0,
        pendingApprovals: 0,
        verifiedCertificates: 0,
        totalPoints: 0
      })
    } catch (error) {
      console.error('Error fetching faculty stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Verify Certificates',
      description: 'Review and approve student certificates',
      icon: CheckCircle,
      color: 'bg-green-500',
      path: '/student-verification'
    },
    {
      title: 'Student Management',
      description: 'Manage student records and profiles',
      icon: Users,
      color: 'bg-blue-500',
      path: '/mentorship-tools'
    },
    {
      title: 'Analytics & Reports',
      description: 'View performance analytics and reports',
      icon: FileText,
      color: 'bg-purple-500',
      path: '/faculty-analytics'
    },
    {
      title: 'Academic Records',
      description: 'Access and update academic information',
      icon: BookOpen,
      color: 'bg-orange-500',
      path: '/academic-progress'
    }
  ]

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      message: "New certificate submitted by John Doe for verification",
      time: "2 minutes ago",
      status: "pending",
      type: "certificate"
    },
    {
      id: 2,
      message: "Verified certificate for Sarah Smith - Technical Excellence Award",
      time: "1 hour ago",
      status: "success",
      type: "verification"
    },
    {
      id: 3,
      message: "Student portfolio updated by Mike Johnson",
      time: "3 hours ago",
      status: "info",
      type: "update"
    }
  ])

  const fetchRecentActivity = async () => {
    try {
      const result = await apiService.get('/api/faculty/recent-activity')
      setRecentActivity(result.data || [])
    } catch (error) {
      console.error('Error fetching recent activity:', error)
    }
  }

  useEffect(() => {
    fetchRecentActivity()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Welcome back, {user?.fullName || 'Faculty'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your students, verify achievements, and track academic progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Students" 
            value={loading ? "--" : stats.totalStudents.toString()} 
            subtitle="under supervision"
            color="blue"
            icon={<Users className="w-6 h-6" />}
            trend="up"
            trendValue="+5%"
            loading={loading}
          />
          <StatsCard 
            title="Pending Approvals" 
            value={loading ? "--" : stats.pendingApprovals.toString()} 
            subtitle="awaiting review"
            color="yellow"
            icon={<Clock className="w-6 h-6" />}
            trend={stats.pendingApprovals > 0 ? "up" : "neutral"}
            trendValue={stats.pendingApprovals > 0 ? "Action needed" : "All clear"}
            loading={loading}
          />
          <StatsCard 
            title="Verified Certificates" 
            value={loading ? "--" : stats.verifiedCertificates.toString()} 
            subtitle="this month"
            color="green"
            icon={<CheckCircle className="w-6 h-6" />}
            trend="up"
            trendValue="+12%"
            loading={loading}
          />
          <StatsCard 
            title="Points Awarded" 
            value={loading ? "--" : stats.totalPoints.toString()} 
            subtitle="total points given"
            color="purple"
            icon={<Award className="w-6 h-6" />}
            trend="up"
            trendValue="+8%"
            loading={loading}
          />
        </div>

        {/* Quick Actions */}
        <Card variant="elevated" className="animate-fadeIn">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Activity className="w-6 h-6 text-green-600" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Card
                    key={index}
                    variant="bordered"
                    className="group hover:shadow-large transition-all duration-300 cursor-pointer hover:scale-105 animate-slideIn"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => window.location.href = action.path}
                  >
                    <div className="p-6">
                      <div className={`w-14 h-14 ${action.color.replace('bg-', 'bg-gradient-to-br from-')} to-${action.color.split('-')[1]}-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">{action.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{action.description}</p>
                    </div>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card variant="elevated" className="animate-fadeIn">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-6 h-6 text-green-600" />
                <span>Recent Activity</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Last 24 hours</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No recent activity</h3>
                <p className="text-gray-600">Activity will appear here as students submit certificates</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-relaxed">{activity.message}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <p className="text-xs text-gray-500">{activity.time}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          activity.status === 'success' ? 'bg-green-100 text-green-700' :
                          activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {activity.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-8 text-center">
              <Button variant="outline" size="lg">
                <Activity className="w-4 h-4 mr-2" />
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default FacultyDashboard
