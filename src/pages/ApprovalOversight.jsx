import React, { useState, useEffect } from 'react'
import { 
  FileCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  Filter,
  Calendar,
  User,
  Building,
  Search,
  Download,
  RefreshCw
} from 'lucide-react'
import Button from '../components/Button'
import apiService from '../services/api'

const ApprovalOversight = () => {
  const [approvals, setApprovals] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: 'pending',
    faculty: '',
    department: '',
    category: '',
    dateRange: '7d',
    search: ''
  })
  const [selectedApproval, setSelectedApproval] = useState(null)
  const [showOverrideModal, setShowOverrideModal] = useState(false)

  useEffect(() => {
    fetchApprovals()
  }, [filters])

  const fetchApprovals = async () => {
    try {
      setLoading(true)
      // Fetch real approval data from API
      const response = await apiService.get('/admin/approvals', {
        status: filters.status,
        faculty: filters.faculty,
        department: filters.department,
        category: filters.category,
        dateRange: filters.dateRange,
        search: filters.search
      })
      
      const realApprovals = response.data || []
      setApprovals(realApprovals)
    } catch (error) {
      console.error('Error fetching approvals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOverride = async (approvalId, action, reason) => {
    try {
      // Simulate API call for admin override
      setApprovals(prev => prev.map(approval => 
        approval._id === approvalId 
          ? { 
              ...approval, 
              status: action,
              reviewedAt: new Date().toISOString(),
              overrideReason: reason,
              overriddenBy: 'Admin'
            }
          : approval
      ))
      setShowOverrideModal(false)
      setSelectedApproval(null)
    } catch (error) {
      console.error('Error overriding approval:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'verified': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'verified': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      default: return <FileCheck className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const filteredApprovals = approvals.filter(approval => {
    if (filters.status && approval.status !== filters.status) return false
    if (filters.faculty && !approval.facultyName.toLowerCase().includes(filters.faculty.toLowerCase())) return false
    if (filters.department && approval.department !== filters.department) return false
    if (filters.category && approval.category !== filters.category) return false
    if (filters.search && !approval.certificateTitle.toLowerCase().includes(filters.search.toLowerCase()) && 
        !approval.studentName.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Approval Oversight</h1>
          <p className="text-gray-600">Monitor and manage certificate approvals across all departments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={<RefreshCw className="w-4 h-4" />} onClick={fetchApprovals}>
            Refresh
          </Button>
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-yellow-600">
                {approvals.filter(a => a.status === 'pending').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verified Today</p>
              <p className="text-2xl font-bold text-green-600">
                {approvals.filter(a => a.status === 'verified').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">
                {approvals.filter(a => a.status === 'rejected').length}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Processing Time</p>
              <p className="text-2xl font-bold text-blue-600">2.3 days</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search approvals..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={filters.department}
            onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electronics">Electronics</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Civil">Civil</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="Workshop">Workshop</option>
            <option value="Competition">Competition</option>
            <option value="Certification">Certification</option>
          </select>

          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>

          <Button variant="outline" onClick={() => setFilters({ status: '', faculty: '', department: '', category: '', dateRange: '7d', search: '' })}>
            Clear
          </Button>
        </div>
      </div>

      {/* Approvals Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Certificate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Faculty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waiting</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApprovals.map((approval) => (
                  <tr key={approval._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{approval.studentName}</div>
                        <div className="text-sm text-gray-500">{approval.studentId}</div>
                        <div className="text-xs text-gray-400">{approval.department}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{approval.certificateTitle}</div>
                        <div className="text-sm text-gray-500">{approval.category}</div>
                        {approval.points && (
                          <div className="text-xs text-orange-600">{approval.points} points</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{approval.facultyName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(approval.status)}`}>
                        {getStatusIcon(approval.status)}
                        <span className="ml-1 capitalize">{approval.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${getPriorityColor(approval.priority)}`}>
                        {approval.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${approval.daysWaiting > 2 ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                        {approval.daysWaiting} days
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Eye className="w-4 h-4" />}
                          onClick={() => setSelectedApproval(approval)}
                        >
                          View
                        </Button>
                        {approval.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-orange-600"
                            onClick={() => {
                              setSelectedApproval(approval)
                              setShowOverrideModal(true)
                            }}
                          >
                            Override
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Override Modal */}
      {showOverrideModal && selectedApproval && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Override</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">{selectedApproval.certificateTitle}</h4>
                <p className="text-sm text-gray-600">Student: {selectedApproval.studentName}</p>
                <p className="text-sm text-gray-600">Faculty: {selectedApproval.facultyName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Override Reason</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows="3"
                  placeholder="Provide reason for admin override..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                variant="primary"
                onClick={() => handleOverride(selectedApproval._id, 'verified', 'Admin override - approved')}
              >
                Approve
              </Button>
              <Button
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50"
                onClick={() => handleOverride(selectedApproval._id, 'rejected', 'Admin override - rejected')}
              >
                Reject
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowOverrideModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApprovalOversight
