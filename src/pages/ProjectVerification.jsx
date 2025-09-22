import React, { useState, useEffect } from 'react'
import { Search, Filter, CheckCircle, XCircle, Eye, Calendar, User, ExternalLink, FolderOpen, Users, Clock, Award } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Card, { CardHeader, CardTitle, CardContent } from '../components/Card'
import Button from '../components/Button'
import Toast from '../components/Toast'

const ProjectVerification = () => {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    status: 'pending',
    department: 'all',
    search: ''
  })
  const [selectedProject, setSelectedProject] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchProjects()
  }, [filters])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        status: filters.status,
        ...(filters.department !== 'all' && { department: filters.department }),
        ...(filters.search && { search: filters.search })
      })

      const response = await fetch(`http://localhost:8000/api/projects/verification?${queryParams}`, {
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
      setProjects(result.data || [])
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyProject = async (projectId) => {
    try {
      setActionLoading(true)
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}/verify`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Refresh projects list
      await fetchProjects()
      setSelectedProject(null)
      setToast({ message: 'Project verified successfully!', type: 'success' })
    } catch (err) {
      console.error('Error verifying project:', err)
      setToast({ message: 'Failed to verify project. Please try again.', type: 'error' })
    } finally {
      setActionLoading(false)
    }
  }

  const handleRejectProject = async (projectId, reason) => {
    if (!reason.trim()) {
      alert('Please provide a rejection reason.')
      return
    }

    try {
      setActionLoading(true)
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}/reject`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Refresh projects list
      await fetchProjects()
      setSelectedProject(null)
      setToast({ message: 'Project rejected successfully!', type: 'success' })
    } catch (err) {
      console.error('Error rejecting project:', err)
      setToast({ message: 'Failed to reject project. Please try again.', type: 'error' })
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (project) => {
    if (project.verified) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </span>
      )
    } else if (project.rejectionReason) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      )
    }
  }

  if (user?.role === 'student') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center">
        <Card variant="elevated" className="max-w-md mx-4">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600">Only faculty and admin can access project verification.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Project Verification
              </h1>
              <p className="text-gray-600 mt-1">Review and verify student projects and leadership roles</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card variant="elevated" className="mb-6">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Filter className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Filter Projects
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="pending">Pending Review</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                  <option value="">All Projects</option>
                </select>
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Department</label>
                <select
                  value={filters.department}
                  onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="all">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                  <input
                    type="text"
                    placeholder="Search projects or students..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects List */}
        {loading ? (
          <Card variant="elevated" className="py-12">
            <CardContent className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600 font-medium">Loading projects...</span>
            </CardContent>
          </Card>
        ) : error ? (
          <Card variant="elevated" className="border-red-200">
            <CardContent className="bg-red-50 text-center p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-red-600 font-medium">Error: {error}</p>
            </CardContent>
          </Card>
        ) : projects.length === 0 ? (
          <Card variant="elevated">
            <CardContent className="text-center p-12">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-500">No projects match your current filters.</p>
            </CardContent>
          </Card>
        ) : (
          <Card variant="elevated">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Projects ({projects.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-blue-50 to-cyan-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                        Role & Duration
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {projects.map((project) => (
                      <tr key={project._id} className="hover:bg-gradient-to-r hover:from-blue-25 hover:to-cyan-25 transition-all duration-200">
                        <td className="px-6 py-5">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FolderOpen className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{project.title}</div>
                              {project.description && (
                                <div className="text-sm text-gray-500 truncate max-w-xs mt-1">
                                  {project.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white text-sm font-bold">
                                {project.studentId?.name?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {project.studentId?.name}
                              </div>
                              <div className="text-sm text-blue-600 font-medium">
                                {project.studentId?.department}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm font-semibold text-gray-900">{project.role}</div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            {project.duration}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {getStatusBadge(project)}
                        </td>
                        <td className="px-6 py-5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedProject(project)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            icon={<Eye className="w-4 h-4" />}
                          >
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Project Review Modal */}
        {selectedProject && (
          <ProjectReviewModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onVerify={handleVerifyProject}
            onReject={handleRejectProject}
            loading={actionLoading}
          />
        )}

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  )
}

// Project Review Modal Component
const ProjectReviewModal = ({ project, onClose, onVerify, onReject, loading }) => {
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)

  const handleReject = () => {
    onReject(project._id, rejectionReason)
    setRejectionReason('')
    setShowRejectForm(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card variant="elevated" className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Review Project
              </span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              icon={<XCircle className="w-5 h-5" />}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Project Details */}
          <Card variant="glass">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {project.title}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Student</label>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {project.studentId?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{project.studentId?.name}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Department</label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {project.studentId?.department}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Role</label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
                    <Award className="w-3 h-3 mr-1" />
                    {project.role}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Duration</label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                    <Clock className="w-3 h-3 mr-1" />
                    {project.duration}
                  </span>
                </div>
              </div>

              {project.description && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-blue-700 mb-2">Description</label>
                  <div className="bg-gradient-to-r from-blue-25 to-cyan-25 border border-blue-100 p-4 rounded-xl">
                    <p className="text-sm text-gray-900">{project.description}</p>
                  </div>
                </div>
              )}

              {project.link && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-blue-700 mb-2">Project Link</label>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 font-medium"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Project
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rejection Form */}
          {showRejectForm && (
            <Card variant="glass" className="border-red-200">
              <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50">
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                    Rejection Reason *
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                  placeholder="Please provide a detailed reason for rejection..."
                />
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          {!project.verified && !project.rejectionReason && (
            <div className="flex justify-end space-x-4 pt-6 border-t border-blue-100">
              {showRejectForm ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectForm(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleReject}
                    disabled={loading || !rejectionReason.trim()}
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                    icon={loading ? null : <XCircle className="w-4 h-4" />}
                  >
                    {loading ? 'Rejecting...' : 'Confirm Rejection'}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectForm(true)}
                    className="border-red-200 text-red-700 hover:bg-red-50"
                    icon={<XCircle className="w-4 h-4" />}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => onVerify(project._id)}
                    disabled={loading}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    icon={loading ? null : <CheckCircle className="w-4 h-4" />}
                  >
                    {loading ? 'Verifying...' : 'Verify Project'}
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ProjectVerification
