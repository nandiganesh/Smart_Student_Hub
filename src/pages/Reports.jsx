import React, { useState } from 'react'
import { Download, Share, RotateCcw, FileText, BarChart3, TrendingUp, Users, Activity, Filter, Eye, CheckCircle, Clock } from 'lucide-react'
import StatsCard from '../components/StatsCard'
import Button from '../components/Button'
import Card from '../components/Card'

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

const Reports = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isGenerating, setIsGenerating] = useState(false)

  const topContributors = [
    { name: 'Aarav Sharma', department: 'CSE', verified: '92%', totalHours: 128, activities: 36, avatar: 'AS' },
    { name: 'Simran Kaur', department: 'Civil', verified: '88%', totalHours: 114, activities: 32, avatar: 'SK' },
    { name: 'Faizan Ali', department: 'ECE', verified: '85%', totalHours: 108, activities: 29, avatar: 'FA' }
  ]

  const categories = ['All', 'MOOCs', 'Workshops', 'Seminars', 'Sports', 'Volunteering']
  const departments = [
    { name: 'Civil', participation: 85, students: 120, activities: 340 },
    { name: 'CSE', participation: 92, students: 150, activities: 425 },
    { name: 'EE', participation: 78, students: 100, activities: 280 },
    { name: 'ME', participation: 81, students: 110, activities: 310 },
    { name: 'ECE', participation: 88, students: 130, activities: 380 }
  ]

  const reports = [
    { name: 'Semester Summary', scope: 'All Departments', owner: 'Admin', status: 'Ready', action: 'Export' },
    { name: 'Category Breakdown', scope: 'AY 2024-25', owner: 'Admin', status: 'Queued', action: 'Preview' },
    { name: 'Department Participation', scope: 'Civil & CSE', owner: 'Admin', status: 'Ready', action: 'Export' }
  ]

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    // Simulate report generation
    setTimeout(() => setIsGenerating(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Reports & Analytics
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Comprehensive insights and analytics for student activities
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="primary" size="lg" icon={<Download className="w-5 h-5" />}>
              Export Summary
            </Button>
            <Button variant="outline" size="lg" icon={<Share className="w-5 h-5" />}>
              Share Report
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card variant="glass" className="animate-slideIn">
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Filters:</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  Department: All
                </span>
                <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  Semester: All
                </span>
                <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  Category: {selectedCategory}
                </span>
                <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  Period: AY 2024-25
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard 
            title="Total Activities" 
            value="1,284" 
            subtitle="logged activities"
            color="blue"
            icon={<Activity className="w-6 h-6" />}
            trend="up"
            trendValue="+12%"
            loading={false}
          />
          <StatsCard 
            title="Verification Rate" 
            value="74%" 
            subtitle="approved submissions"
            color="green"
            icon={<CheckCircle className="w-6 h-6" />}
            trend="up"
            trendValue="+8%"
            loading={false}
          />
          <StatsCard 
            title="Avg Hours" 
            value="18.6" 
            subtitle="per student"
            color="purple"
            icon={<TrendingUp className="w-6 h-6" />}
            trend="up"
            trendValue="+5%"
            loading={false}
          />
        </div>

        {/* Category Breakdown */}
        <Card variant="elevated" className="animate-fadeIn">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <span>Activity Category Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 mb-8">
              {categories.map((category) => (
                <button 
                  key={category} 
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Department-wise Participation */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Department-wise Participation</span>
                </h4>
                <div className="space-y-4">
                  {departments.map((dept) => (
                    <div key={dept.name} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">{dept.name}</span>
                        <span className="text-sm font-medium text-blue-600">{dept.participation}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${dept.participation}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{dept.students} students</span>
                        <span>{dept.activities} activities</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Contributors */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Top Contributors</span>
                </h4>
                
                <div className="space-y-4">
                  {topContributors.map((contributor, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                            {contributor.avatar}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{contributor.name}</div>
                            <div className="text-sm text-gray-500">{contributor.department} Department</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">{contributor.verified}</div>
                          <div className="text-xs text-gray-500">Verified</div>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center bg-gray-50 rounded-lg py-2">
                          <div className="font-semibold text-gray-900">{contributor.totalHours}</div>
                          <div className="text-gray-500">Hours</div>
                        </div>
                        <div className="text-center bg-gray-50 rounded-lg py-2">
                          <div className="font-semibold text-gray-900">{contributor.activities}</div>
                          <div className="text-gray-500">Activities</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Button variant="outline" size="sm" icon={<RotateCcw className="w-4 h-4" />}>
                    Refresh Data
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card variant="elevated" className="animate-fadeIn">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <span>Generated Reports</span>
              </CardTitle>
              <Button 
                variant="primary" 
                onClick={handleGenerateReport}
                loading={isGenerating}
                disabled={isGenerating}
              >
                Generate New Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Report Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Scope</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reports.map((report, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{report.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {report.scope}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{report.owner}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {report.status === 'Ready' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-yellow-600" />
                          )}
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                            report.status === 'Ready' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {report.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" icon={<Eye className="w-4 h-4" />}>
                            Preview
                          </Button>
                          {report.status === 'Ready' && (
                            <Button variant="primary" size="sm" icon={<Download className="w-4 h-4" />}>
                              {report.action}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-700 flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span><strong>Note:</strong> All reports are automatically formatted for NAAC compliance and institutional accreditation requirements.</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Reports
