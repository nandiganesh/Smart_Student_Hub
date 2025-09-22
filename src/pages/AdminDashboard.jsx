import React, { useState, useEffect } from 'react'
import { 
  Users, 
  GraduationCap, 
  FileCheck, 
  Clock, 
  TrendingUp, 
  Award, 
  BarChart3,
  Download,
  Bell,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  Building,
  BookOpen
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { useAuth } from '../context/AuthContext'
import apiService from '../services/api'
import StatsCard from '../components/StatsCard'
import Button from '../components/Button'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalStudents: 0,
      totalFaculty: 0,
      pendingApprovals: 0,
      verifiedRecords: 0,
      accreditationScore: 0
    },
    departmentStats: [],
    achievementTrends: [],
    facultyPerformance: [],
    recentActivity: [],
    systemHealth: {
      uptime: '99.9%',
      activeUsers: 0,
      systemLoad: 'Normal'
    }
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    fetchDashboardData()
  }, [timeRange])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch real data from API endpoints
      try {
        const [overviewRes, departmentRes, trendsRes, facultyRes, activityRes] = await Promise.allSettled([
          apiService.get('/admin/overview'),
          apiService.get('/admin/departments'),
          apiService.get('/admin/trends'),
          apiService.get('/admin/faculty-performance'),
          apiService.get('/admin/recent-activity')
        ])

        const realData = {
          overview: overviewRes.status === 'fulfilled' ? overviewRes.value : {
            totalStudents: 0,
            totalFaculty: 0,
            pendingApprovals: 0,
            verifiedRecords: 0,
            accreditationScore: 0
          },
          departmentStats: departmentRes.status === 'fulfilled' ? departmentRes.value : [],
          achievementTrends: trendsRes.status === 'fulfilled' ? trendsRes.value : [],
          facultyPerformance: facultyRes.status === 'fulfilled' ? facultyRes.value : [],
          recentActivity: activityRes.status === 'fulfilled' ? activityRes.value : [],
          systemHealth: {
            uptime: '99.9%',
            activeUsers: 0,
            systemLoad: 'Normal'
          }
        }
        
        setDashboardData(realData)
      } catch (apiError) {
        console.error('API Error:', apiError)
        // Set empty data structure for error state
        setDashboardData({
          overview: {
            totalStudents: 0,
            totalFaculty: 0,
            pendingApprovals: 0,
            verifiedRecords: 0,
            accreditationScore: 0
          },
          departmentStats: [],
          achievementTrends: [],
          facultyPerformance: [],
          recentActivity: [],
          systemHealth: {
            uptime: '99.9%',
            activeUsers: 0,
            systemLoad: 'Normal'
          }
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#f97316', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.fullName} • System Administrator</p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>
            Export Report
          </Button>
          <Button icon={<Bell className="w-4 h-4" />}>
            Notifications
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatsCard
          title="Total Students"
          value={dashboardData.overview.totalStudents.toLocaleString()}
          icon={<GraduationCap className="w-6 h-6" />}
          trend="+12.5%"
          trendUp={true}
        />
        <StatsCard
          title="Total Faculty"
          value={dashboardData.overview.totalFaculty}
          icon={<Users className="w-6 h-6" />}
          trend="+3.2%"
          trendUp={true}
        />
        <StatsCard
          title="Pending Approvals"
          value={dashboardData.overview.pendingApprovals}
          icon={<Clock className="w-6 h-6" />}
          trend="Needs attention"
          trendUp={false}
        />
        <StatsCard
          title="Verified Records"
          value={dashboardData.overview.verifiedRecords.toLocaleString()}
          icon={<FileCheck className="w-6 h-6" />}
          trend="+18.7%"
          trendUp={true}
        />
        <StatsCard
          title="Accreditation Score"
          value={`${dashboardData.overview.accreditationScore}%`}
          icon={<Award className="w-6 h-6" />}
          trend="+2.3%"
          trendUp={true}
        />
      </div>

      {/* System Health & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
            <Shield className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Uptime</span>
              <span className="font-semibold text-green-600">{dashboardData.systemHealth.uptime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active Users</span>
              <span className="font-semibold">{dashboardData.systemHealth.activeUsers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">System Load</span>
              <span className="font-semibold text-green-600">{dashboardData.systemHealth.systemLoad}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" icon={<Users className="w-4 h-4" />}>
              Add Faculty Member
            </Button>
            <Button variant="outline" className="w-full justify-start" icon={<GraduationCap className="w-4 h-4" />}>
              Import Students
            </Button>
            <Button variant="outline" className="w-full justify-start" icon={<FileCheck className="w-4 h-4" />}>
              Review Approvals
            </Button>
            <Button variant="outline" className="w-full justify-start" icon={<BarChart3 className="w-4 h-4" />}>
              Generate Report
            </Button>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
            <Bell className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Pending Approvals</p>
                <p className="text-xs text-yellow-600">23 certificates awaiting review</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">System Update</p>
                <p className="text-xs text-green-600">All systems operational</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.departmentStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="achievements" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Achievement Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievement Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.achievementTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="achievements" stroke="#f97316" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Faculty Performance & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faculty Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Faculty Performance</h3>
          <div className="space-y-3">
            {dashboardData.facultyPerformance.map((faculty, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{faculty.name}</h4>
                  <p className="text-sm text-gray-600">{faculty.department} • {faculty.verified} verified</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-600">{faculty.efficiency}%</div>
                  <div className="text-xs text-gray-500">{faculty.pending} pending</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {dashboardData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'approval' ? 'bg-green-100' :
                  activity.type === 'user' ? 'bg-blue-100' :
                  activity.type === 'system' ? 'bg-gray-100' :
                  activity.type === 'report' ? 'bg-purple-100' : 'bg-yellow-100'
                }`}>
                  {activity.type === 'approval' && <CheckCircle className="w-4 h-4 text-green-600" />}
                  {activity.type === 'user' && <Users className="w-4 h-4 text-blue-600" />}
                  {activity.type === 'system' && <Settings className="w-4 h-4 text-gray-600" />}
                  {activity.type === 'report' && <BarChart3 className="w-4 h-4 text-purple-600" />}
                  {activity.type === 'alert' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Students</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Faculty</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Achievements</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Total Points</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Avg per Student</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.departmentStats.map((dept, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{dept.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{dept.students}</td>
                  <td className="py-3 px-4">{dept.faculty}</td>
                  <td className="py-3 px-4">{dept.achievements}</td>
                  <td className="py-3 px-4">{dept.points.toLocaleString()}</td>
                  <td className="py-3 px-4">{Math.round(dept.points / dept.students)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
