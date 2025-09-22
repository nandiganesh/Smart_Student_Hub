import React, { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  Users,
  Award,
  FileText,
  PieChart,
  Filter,
  RefreshCw,
  Activity
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from 'recharts'
import Button from '../components/Button'
import Card from '../components/Card'
import StatsCard from '../components/StatsCard'
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

const FacultyAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalStudents: 0,
      totalCertificates: 0,
      verifiedCertificates: 0,
      totalPoints: 0
    },
    departmentStats: [],
    categoryStats: [],
    monthlyTrends: [],
    topPerformers: []
  })
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [selectedDepartment, setSelectedDepartment] = useState('')

  useEffect(() => {
    fetchAnalyticsData()
  }, [dateRange, selectedDepartment])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      
      // Fetch students
      const studentsResponse = await apiService.get('/faculty/students')
      const students = studentsResponse.data || []
      
      // Fetch all certificates
      const certificatesResponse = await apiService.get('/faculty/certificates')
      const allCertificates = certificatesResponse.data || []
      
      // Fetch verified certificates
      const verifiedResponse = await apiService.get('/faculty/certificates?status=Verified')
      const verifiedCertificates = verifiedResponse.data || []
      
      // Calculate overview stats
      const overview = {
        totalStudents: students.length,
        totalCertificates: allCertificates.length,
        verifiedCertificates: verifiedCertificates.length,
        totalPoints: verifiedCertificates.reduce((sum, cert) => sum + (cert.points || 0), 0)
      }
      
      // Calculate department stats
      const departmentMap = new Map()
      students.forEach(student => {
        const dept = student.department || 'Unknown'
        if (!departmentMap.has(dept)) {
          departmentMap.set(dept, { name: dept, students: 0, certificates: 0, points: 0 })
        }
        departmentMap.get(dept).students++
      })
      
      verifiedCertificates.forEach(cert => {
        const dept = cert.userId?.department || 'Unknown'
        if (departmentMap.has(dept)) {
          departmentMap.get(dept).certificates++
          departmentMap.get(dept).points += (cert.points || 0)
        }
      })
      
      const departmentStats = Array.from(departmentMap.values())
      
      // Calculate category stats
      const categoryMap = new Map()
      verifiedCertificates.forEach(cert => {
        const category = cert.category || 'Other'
        if (!categoryMap.has(category)) {
          categoryMap.set(category, { name: category, value: 0, points: 0 })
        }
        categoryMap.get(category).value++
        categoryMap.get(category).points += (cert.points || 0)
      })
      
      const categoryStats = Array.from(categoryMap.values())
      
      // Calculate monthly trends (last 6 months)
      const monthlyTrends = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        
        const monthCertificates = verifiedCertificates.filter(cert => {
          const certDate = new Date(cert.verifiedAt || cert.createdAt)
          return certDate >= monthStart && certDate <= monthEnd
        })
        
        monthlyTrends.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          certificates: monthCertificates.length,
          points: monthCertificates.reduce((sum, cert) => sum + (cert.points || 0), 0)
        })
      }
      
      // Calculate top performers
      const studentMap = new Map()
      verifiedCertificates.forEach(cert => {
        const studentId = cert.userId?._id
        const studentName = cert.userId?.fullName
        if (studentId && studentName) {
          if (!studentMap.has(studentId)) {
            studentMap.set(studentId, { 
              name: studentName, 
              certificates: 0, 
              points: 0,
              department: cert.userId?.department 
            })
          }
          studentMap.get(studentId).certificates++
          studentMap.get(studentId).points += (cert.points || 0)
        }
      })
      
      const topPerformers = Array.from(studentMap.values())
        .sort((a, b) => b.points - a.points)
        .slice(0, 10)
      
      setAnalyticsData({
        overview,
        departmentStats,
        categoryStats,
        monthlyTrends,
        topPerformers
      })
      
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = async (format) => {
    try {
      // This would generate and download a report
      console.log(`Exporting ${format} report...`)
      // Implementation for PDF/Excel export would go here
    } catch (error) {
      console.error('Error exporting report:', error)
    }
  }

  const COLORS = ['#f97316', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Analytics & Reports
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Comprehensive insights and accreditation reports for data-driven decisions
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              variant="outline" 
              size="lg"
              icon={<Download className="w-5 h-5" />}
              onClick={() => exportReport('pdf')}
            >
              Export PDF
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              icon={<Download className="w-5 h-5" />}
              onClick={() => exportReport('excel')}
            >
              Export Excel
            </Button>
            <Button 
              variant="primary" 
              size="lg"
              icon={<RefreshCw className="w-5 h-5" />}
              onClick={fetchAnalyticsData}
            >
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card variant="glass" className="animate-slideIn">
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="Electrical">Electrical</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button variant="primary" size="lg" className="w-full" icon={<Filter className="w-4 h-4" />}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
          <StatsCard
            title="Total Students"
            value={analyticsData.overview.totalStudents}
            icon={<Users className="w-6 h-6" />}
            trend="up"
            trendValue="+5.2%"
            color="blue"
          />
          <StatsCard
            title="Total Certificates"
            value={analyticsData.overview.totalCertificates}
            icon={<FileText className="w-6 h-6" />}
            trend="up"
            trendValue="+12.3%"
            color="green"
          />
          <StatsCard
            title="Verified Certificates"
            value={analyticsData.overview.verifiedCertificates}
            icon={<Award className="w-6 h-6" />}
            subtitle={`${analyticsData.overview.totalCertificates > 0 
              ? Math.round((analyticsData.overview.verifiedCertificates / analyticsData.overview.totalCertificates) * 100)
              : 0}% verification rate`}
            color="green"
          />
          <StatsCard
            title="Total Points Awarded"
            value={analyticsData.overview.totalPoints}
            icon={<BarChart3 className="w-6 h-6" />}
            trend="up"
            trendValue="+8.1%"
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Department Performance */}
          <Card variant="elevated" className="animate-fadeIn">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <BarChart3 className="w-6 h-6 text-green-600" />
                <span>Department Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.departmentStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="certificates" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card variant="elevated" className="animate-fadeIn">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <PieChart className="w-6 h-6 text-green-600" />
                <span>Certificate Categories</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={analyticsData.categoryStats}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {analyticsData.categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card variant="elevated" className="animate-fadeIn">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <span>Monthly Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="certificates" stroke="#10b981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card variant="elevated" className="animate-fadeIn">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Award className="w-6 h-6 text-green-600" />
                <span>Top Performing Students</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analyticsData.topPerformers.slice(0, 8).map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.department}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{student.points} pts</p>
                      <p className="text-sm text-gray-600">{student.certificates} certs</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Accreditation Reports */}
        <Card variant="elevated" className="animate-fadeIn">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-green-600" />
              <span>Accreditation Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Button 
                variant="outline" 
                size="lg"
                className="h-24 flex-col gap-3 hover:shadow-lg transition-all duration-200"
                onClick={() => exportReport('naac')}
              >
                <FileText className="w-8 h-8 text-green-600" />
                <span className="font-semibold">NAAC Report</span>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="h-24 flex-col gap-3 hover:shadow-lg transition-all duration-200"
                onClick={() => exportReport('aicte')}
              >
                <FileText className="w-8 h-8 text-green-600" />
                <span className="font-semibold">AICTE Report</span>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="h-24 flex-col gap-3 hover:shadow-lg transition-all duration-200"
                onClick={() => exportReport('nirf')}
              >
                <FileText className="w-8 h-8 text-green-600" />
                <span className="font-semibold">NIRF Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default FacultyAnalytics
