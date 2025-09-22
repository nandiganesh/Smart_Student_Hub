import React, { useState } from 'react'
import { Filter, Download, Check, X, Edit, Eye, Clock, CheckCircle, AlertCircle, TrendingUp, Users } from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import Toast from '../components/Toast'

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

const FacultyApproval = () => {
  const [toast, setToast] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [isProcessing, setIsProcessing] = useState({})

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }

  const pendingApprovals = [
    {
      student: 'Arjun Sharma',
      department: 'CSE',
      activity: 'MOOC - Python Basics',
      category: 'Technical',
      date: '2025-08-12',
      evidence: '2 files',
      priority: 'high',
      avatar: 'AS',
      id: 1
    },
    {
      student: 'Najma Bhat',
      department: 'ECE',
      activity: 'Hackathon - J&K Innovate',
      category: 'Competition',
      date: '2025-08-10',
      evidence: '1 link',
      priority: 'medium',
      avatar: 'NB',
      id: 2
    },
    {
      student: 'Rehan Khan',
      department: 'IT',
      activity: 'Internship - KrishTech',
      category: 'Professional',
      date: '2025-08-08',
      evidence: 'Offer letter',
      priority: 'low',
      avatar: 'RK',
      id: 3
    }
  ]

  const handleApproval = async (id, action) => {
    setIsProcessing(prev => ({ ...prev, [id]: action }))
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(prev => ({ ...prev, [id]: false }))
      const actionText = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'sent back for changes'
      showToast(`Certificate ${actionText} successfully`, action === 'approve' ? 'success' : action === 'reject' ? 'error' : 'warning')
    }, 1500)
  }

  const departmentTrends = [
    { dept: 'CSE', change: '+8% MoM', color: 'text-green-600' },
    { dept: 'ECE', change: '+6% MoM', color: 'text-green-600' },
    { dept: 'Civil', change: '+5% MoM', color: 'text-green-600' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Faculty Approval Panel
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Review and approve student certificates and achievements
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="primary" size="lg" icon={<Filter className="w-5 h-5" />}>
              Advanced Filters
            </Button>
            <Button variant="outline" size="lg" icon={<Download className="w-5 h-5" />}>
              Export Report
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card variant="glass" className="animate-slideIn">
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-900">Active Filters:</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                  Department: All
                </span>
                <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                  Category: All
                </span>
                <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                  Date: Last 30 days
                </span>
                <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  Priority: High first
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card variant="elevated" className="animate-fadeIn">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-green-600" />
                <span>Pending Approvals ({pendingApprovals.length})</span>
              </div>
              <div className="text-sm text-gray-500">
                {pendingApprovals.filter(item => item.priority === 'high').length} high priority
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingApprovals.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
                <p className="text-gray-600">No pending approvals at the moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingApprovals.map((item, index) => (
                  <Card key={item.id} variant="bordered" className="hover:shadow-md transition-all duration-200">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">
                            {item.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">{item.student}</h4>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {item.department}
                              </span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                item.priority === 'high' ? 'bg-red-100 text-red-700' :
                                item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {item.priority} priority
                              </span>
                            </div>
                            <p className="text-gray-900 font-medium mb-1">{item.activity}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Category: {item.category}</span>
                              <span>•</span>
                              <span>Submitted: {item.date}</span>
                              <span>•</span>
                              <span>Evidence: {item.evidence}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            icon={<Eye className="w-4 h-4" />}
                          >
                            Review
                          </Button>
                          <Button 
                            variant="primary" 
                            size="sm" 
                            icon={<Check className="w-4 h-4" />}
                            onClick={() => handleApproval(item.id, 'approve')}
                            loading={isProcessing[item.id] === 'approve'}
                            disabled={!!isProcessing[item.id]}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            icon={<X className="w-4 h-4" />}
                            onClick={() => handleApproval(item.id, 'reject')}
                            loading={isProcessing[item.id] === 'reject'}
                            disabled={!!isProcessing[item.id]}
                          >
                            Reject
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            icon={<Edit className="w-4 h-4" />}
                            onClick={() => handleApproval(item.id, 'changes')}
                            loading={isProcessing[item.id] === 'changes'}
                            disabled={!!isProcessing[item.id]}
                          >
                            Changes
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-sm text-green-700 flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span><strong>Tip:</strong> Click "Review" to view detailed evidence and student portfolio before making decisions.</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Student Activity Heatmap */}
          <Card variant="elevated" className="animate-fadeIn">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <span>Student Activity Heatmap</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 rounded-xl h-64 flex items-center justify-center text-white shadow-lg">
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-80" />
                  <div className="text-xl font-bold mb-2">Activity Visualization</div>
                  <div className="text-sm opacity-90">Interactive heatmap coming soon</div>
                </div>
              </div>
              <div className="flex justify-center mt-6 space-x-8">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
                  <span className="text-sm font-medium text-gray-700">High Activity</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
                  <span className="text-sm font-medium text-gray-700">Medium Activity</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
                  <span className="text-sm font-medium text-gray-700">Low Activity</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Participation Trends by Department */}
          <Card variant="elevated" className="animate-fadeIn">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-green-600" />
                <span>Department Participation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Department Cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {departmentTrends.map((dept, index) => (
                  <Card key={index} variant="gradient" className="text-white text-center">
                    <div className="p-4">
                      <div className="text-lg font-bold">{dept.dept}</div>
                      <div className="text-sm opacity-90">{dept.change}</div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Chart Placeholder */}
              <div className="bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 rounded-xl h-32 flex items-center justify-center text-white shadow-lg">
                <div className="text-center">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-80" />
                  <div className="text-lg font-bold">Trend Analytics</div>
                  <div className="text-sm opacity-90">Interactive charts coming soon</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default FacultyApproval
