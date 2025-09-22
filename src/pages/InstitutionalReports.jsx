import React, { useState, useEffect } from 'react'
import { 
  Download, 
  Calendar, 
  Filter, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award,
  Building,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Button from '../components/Button'
import apiService from '../services/api'

const InstitutionalReports = () => {
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState({
    summary: {
      totalStudents: 0,
      totalFaculty: 0,
      totalCertificates: 0,
      verificationRate: 0,
      avgProcessingTime: 0,
      accreditationScore: 0
    },
    departmentStats: [],
    monthlyTrends: [],
    categoryBreakdown: [],
    facultyPerformance: []
  })
  const [selectedDateRange, setSelectedDateRange] = useState('last_month')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedReportType, setSelectedReportType] = useState('comprehensive')

  const reportTypes = [
    { value: 'comprehensive', label: 'Comprehensive Report', icon: FileText },
    { value: 'naac', label: 'NAAC Compliance', icon: Award },
    { value: 'aicte', label: 'AICTE Report', icon: Building },
    { value: 'nirf', label: 'NIRF Ranking', icon: TrendingUp },
    { value: 'department', label: 'Department Analysis', icon: Users },
    { value: 'faculty', label: 'Faculty Performance', icon: BarChart3 }
  ]

  const dateRanges = [
    { value: 'last_week', label: 'Last Week' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'last_quarter', label: 'Last Quarter' },
    { value: 'last_semester', label: 'Last Semester' },
    { value: 'last_year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ]

  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'cse', label: 'Computer Science' },
    { value: 'ece', label: 'Electronics & Communication' },
    { value: 'me', label: 'Mechanical Engineering' },
    { value: 'ce', label: 'Civil Engineering' },
    { value: 'it', label: 'Information Technology' }
  ]

  useEffect(() => {
    fetchReportData()
  }, [selectedDateRange, selectedDepartment, selectedReportType])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      
      const response = await apiService.get('/admin/reports', {
        params: {
          type: selectedReportType,
          dateRange: selectedDateRange,
          department: selectedDepartment
        }
      })
      
      // Mock data for demonstration
      setReportData({
        summary: {
          totalStudents: 2847,
          totalFaculty: 156,
          totalCertificates: 1923,
          verificationRate: 87.3,
          avgProcessingTime: 3.2,
          accreditationScore: 8.7
        },
        departmentStats: [
          { department: 'Computer Science', students: 892, certificates: 634, verificationRate: 89.2, avgGrade: 8.4 },
          { department: 'Electronics & Communication', students: 743, certificates: 521, verificationRate: 85.7, avgGrade: 8.1 },
          { department: 'Mechanical Engineering', students: 654, certificates: 398, verificationRate: 84.3, avgGrade: 7.9 },
          { department: 'Civil Engineering', students: 558, certificates: 370, verificationRate: 88.1, avgGrade: 8.2 }
        ],
        monthlyTrends: [
          { month: 'Jan', certificates: 145, verifications: 127, rejections: 18 },
          { month: 'Feb', certificates: 167, verifications: 142, rejections: 25 },
          { month: 'Mar', certificates: 189, verifications: 165, rejections: 24 },
          { month: 'Apr', certificates: 203, verifications: 178, rejections: 25 },
          { month: 'May', certificates: 234, verifications: 201, rejections: 33 },
          { month: 'Jun', certificates: 198, verifications: 172, rejections: 26 }
        ],
        categoryBreakdown: [
          { category: 'Technical Certifications', count: 567, percentage: 29.5 },
          { category: 'Internships', count: 423, percentage: 22.0 },
          { category: 'Projects', count: 389, percentage: 20.2 },
          { category: 'Competitions', count: 312, percentage: 16.2 },
          { category: 'Workshops', count: 232, percentage: 12.1 }
        ],
        facultyPerformance: [
          { name: 'Dr. Priya Sharma', department: 'CSE', verifications: 89, avgTime: 2.1, rating: 9.2 },
          { name: 'Prof. Rajesh Kumar', department: 'ECE', verifications: 76, avgTime: 2.8, rating: 8.9 },
          { name: 'Dr. Meera Patel', department: 'ME', verifications: 67, avgTime: 3.2, rating: 8.7 },
          { name: 'Prof. Arjun Singh', department: 'CE', verifications: 54, avgTime: 2.9, rating: 8.5 }
        ]
      })
      
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportReport = async (format) => {
    try {
      const response = await apiService.get('/admin/reports/export', {
        params: {
          format,
          type: selectedReportType,
          dateRange: selectedDateRange,
          department: selectedDepartment
        },
        responseType: 'blob'
      })
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `institutional_report_${selectedReportType}_${Date.now()}.${format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
    } catch (error) {
      console.error('Error exporting report:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Institutional Reports</h1>
          <p className="text-gray-600 mt-1">Generate comprehensive reports for accreditation and compliance</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            icon={<Download className="w-4 h-4" />}
            onClick={() => handleExportReport('pdf')}
          >
            Export PDF
          </Button>
          <Button 
            variant="outline" 
            icon={<Download className="w-4 h-4" />}
            onClick={() => handleExportReport('xlsx')}
          >
            Export Excel
          </Button>
          <Button 
            variant="primary" 
            icon={<FileText className="w-4 h-4" />}
          >
            Generate Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select 
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {reportTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select 
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {dateRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select 
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {departments.map(dept => (
                <option key={dept.value} value={dept.value}>{dept.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.summary.totalStudents.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Faculty</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.summary.totalFaculty}</p>
            </div>
            <Building className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Certificates</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.summary.totalCertificates.toLocaleString()}</p>
            </div>
            <Award className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verification Rate</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.summary.verificationRate}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Processing Time</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.summary.avgProcessingTime} days</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Accreditation Score</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.summary.accreditationScore}/10</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Statistics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Department Performance</h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Department</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-600">Students</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-600">Certificates</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-600">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.departmentStats.map((dept, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 text-sm font-medium text-gray-900">{dept.department}</td>
                      <td className="py-3 text-sm text-gray-600 text-right">{dept.students}</td>
                      <td className="py-3 text-sm text-gray-600 text-right">{dept.certificates}</td>
                      <td className="py-3 text-sm text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          dept.verificationRate >= 85 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {dept.verificationRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Monthly Trends Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {reportData.monthlyTrends.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 w-12">{month.month}</span>
                  <div className="flex-1 mx-4">
                    <div className="flex space-x-1">
                      <div 
                        className="bg-green-500 h-4 rounded"
                        style={{ width: `${(month.verifications / month.certificates) * 100}%` }}
                      ></div>
                      <div 
                        className="bg-red-500 h-4 rounded"
                        style={{ width: `${(month.rejections / month.certificates) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-16 text-right">{month.certificates}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4 space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Rejected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Certificate Categories</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {reportData.categoryBreakdown.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">{category.category}</span>
                      <span className="text-sm text-gray-600">{category.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 ml-4 w-12 text-right">
                    {category.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Faculty Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Faculty Performance</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {reportData.facultyPerformance.map((faculty, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{faculty.name}</h4>
                    <p className="text-sm text-gray-600">{faculty.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{faculty.verifications} verifications</p>
                    <p className="text-xs text-gray-600">{faculty.avgTime} days avg</p>
                  </div>
                  <div className="ml-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {faculty.rating}/10
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="h-20 flex-col gap-2"
            onClick={() => handleExportReport('pdf')}
          >
            <FileText className="w-6 h-6" />
            PDF Report
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col gap-2"
            onClick={() => handleExportReport('xlsx')}
          >
            <BarChart3 className="w-6 h-6" />
            Excel Data
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col gap-2"
            onClick={() => handleExportReport('csv')}
          >
            <Download className="w-6 h-6" />
            CSV Export
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex-col gap-2"
            onClick={() => handleExportReport('json')}
          >
            <FileText className="w-6 h-6" />
            JSON Data
          </Button>
        </div>
      </div>
    </div>
  )
}

export default InstitutionalReports
