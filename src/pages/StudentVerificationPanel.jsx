import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock,
  User,
  Calendar,
  Award,
  FileText,
  Download,
  MoreVertical,
  Layers,
  Shield,
  Sparkles
} from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import Toast from '../components/Toast'
import BulkVerificationModal from '../components/BulkVerificationModal'
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

const StudentVerificationPanel = () => {
  const [certificates, setCertificates] = useState([])
  const [filteredCertificates, setFilteredCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCertificate, setSelectedCertificate] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [filters, setFilters] = useState({
    status: 'Pending',
    category: '',
    department: '',
    search: ''
  })
  const [verificationData, setVerificationData] = useState({
    points: '',
    remarks: ''
  })
  const [rejectionReason, setRejectionReason] = useState('')
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }

  useEffect(() => {
    fetchCertificates()
  }, [filters.status, filters.department, filters.category])

  useEffect(() => {
    filterCertificates()
  }, [certificates, filters.search])

  const fetchCertificates = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.department) params.append('department', filters.department)
      if (filters.category) params.append('category', filters.category)
      
      const response = await apiService.get(`/faculty/certificates?${params.toString()}`)
      setCertificates(response.data || [])
    } catch (error) {
      console.error('Error fetching certificates:', error)
      setCertificates([])
    } finally {
      setLoading(false)
    }
  }

  const filterCertificates = () => {
    if (!filters.search) {
      setFilteredCertificates(certificates)
      return
    }

    const filtered = certificates.filter(cert =>
      cert.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
      cert.userId?.fullName?.toLowerCase().includes(filters.search.toLowerCase()) ||
      cert.userId?.studentId?.toLowerCase().includes(filters.search.toLowerCase()) ||
      cert.category?.toLowerCase().includes(filters.search.toLowerCase())
    )
    setFilteredCertificates(filtered)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate)
    setShowModal(true)
    setVerificationData({ points: certificate.points || '', remarks: '' })
    setRejectionReason('')
  }

  const handleVerify = async () => {
    try {
      await apiService.request(`/faculty/certificates/${selectedCertificate._id}/verify`, {
        method: 'PUT',
        body: {
          points: parseInt(verificationData.points) || 10,
          remarks: verificationData.remarks
        }
      })
      
      setShowModal(false)
      fetchCertificates()
      setVerificationData({ points: '', remarks: '' })
    } catch (error) {
      console.error('Error verifying certificate:', error)
    }
  }

  const handleReject = async () => {
    try {
      await apiService.request(`/faculty/certificates/${selectedCertificate._id}/reject`, {
        method: 'PUT',
        body: { reason: rejectionReason }
      })
      
      setShowModal(false)
      fetchCertificates()
      setRejectionReason('')
    } catch (error) {
      console.error('Error rejecting certificate:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified': return 'text-green-600 bg-green-50'
      case 'Rejected': return 'text-red-600 bg-red-50'
      default: return 'text-yellow-600 bg-yellow-50'
    }
  }

  const categories = ['Technical', 'Sports', 'Cultural', 'Academic', 'Leadership', 'Community Service']
  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical']

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Student Verification Panel
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Review and verify student certificate submissions with advanced filtering and bulk operations
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              variant="primary" 
              size="lg"
              icon={<Layers className="w-5 h-5" />}
              onClick={() => setShowBulkModal(true)}
              disabled={filteredCertificates.length === 0}
            >
              Bulk Actions
            </Button>
            <Button variant="outline" size="lg" icon={<Download className="w-5 h-5" />}>
              Export Data
            </Button>
            <Button variant="outline" size="lg" icon={<Filter className="w-5 h-5" />}>
              Advanced Filters
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card variant="glass" className="animate-slideIn">
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search certificates..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Verified">Verified</option>
                <option value="Rejected">Rejected</option>
              </select>

              {/* Category Filter */}
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Department Filter */}
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              {/* Clear Filters */}
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setFilters({ status: 'Pending', category: '', department: '', search: '' })}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <Card variant="elevated" className="animate-fadeIn">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <p className="text-gray-700 font-medium">
                  Showing <span className="text-purple-600 font-bold">{filteredCertificates.length}</span> of <span className="text-purple-600 font-bold">{certificates.length}</span> certificates
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Pending: {certificates.filter(c => c.status === 'Pending').length}</span>
                  <div className="w-3 h-3 bg-green-400 rounded-full ml-4"></div>
                  <span className="text-sm text-gray-600">Verified: {certificates.filter(c => c.status === 'Verified').length}</span>
                  <div className="w-3 h-3 bg-red-400 rounded-full ml-4"></div>
                  <span className="text-sm text-gray-600">Rejected: {certificates.filter(c => c.status === 'Rejected').length}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option>Latest First</option>
                  <option>Oldest First</option>
                  <option>Priority</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificates Table */}
        <Card variant="elevated" className="animate-slideIn overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
            </div>
          ) : filteredCertificates.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl mb-4">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No certificates found</h3>
              <p className="text-gray-500">No certificates match your current filter criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-50 to-indigo-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">
                      Certificate
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredCertificates.map((certificate, index) => (
                    <tr key={certificate._id} className="hover:bg-gradient-to-r hover:from-purple-25 hover:to-indigo-25 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                            <User className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {certificate.userId?.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {certificate.userId?.studentId} • {certificate.userId?.department}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{certificate.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">{certificate.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800">
                          <Award className="w-3 h-3 mr-1" />
                          {certificate.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(certificate.status)}`}>
                          {certificate.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                          {certificate.status === 'Verified' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {certificate.status === 'Rejected' && <XCircle className="w-3 h-3 mr-1" />}
                          {certificate.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                          {new Date(certificate.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<Eye className="w-4 h-4" />}
                            onClick={() => handleViewCertificate(certificate)}
                          >
                            Review
                          </Button>
                          {certificate.status === 'Pending' && (
                            <Button
                              variant="primary"
                              size="sm"
                              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                              icon={<CheckCircle className="w-4 h-4" />}
                              onClick={() => {
                                setSelectedCertificate(certificate)
                                setVerificationData({ points: '10', remarks: 'Quick approval' })
                                handleVerify()
                              }}
                            >
                              Quick Verify
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
        </Card>

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>

      {/* Certificate Review Modal */}
      {showModal && selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card variant="elevated" className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Certificate Review</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Certificate Details */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Student Name</label>
                    <p className="text-gray-900">{selectedCertificate.userId?.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Student ID</label>
                    <p className="text-gray-900">{selectedCertificate.userId?.studentId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Department</label>
                    <p className="text-gray-900">{selectedCertificate.userId?.department}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <p className="text-gray-900">{selectedCertificate.category}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Certificate Title</label>
                  <p className="text-gray-900">{selectedCertificate.title}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="text-gray-900">{selectedCertificate.description}</p>
                </div>

                {selectedCertificate.certificateImage && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Certificate Image</label>
                    <img
                      src={selectedCertificate.certificateImage}
                      alt="Certificate"
                      className="mt-2 max-w-full h-auto rounded-lg border"
                    />
                  </div>
                )}
              </div>

              {/* Verification Form */}
              {selectedCertificate.status === 'Pending' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Points to Award
                      </label>
                      <input
                        type="number"
                        value={verificationData.points}
                        onChange={(e) => setVerificationData(prev => ({ ...prev, points: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter points (1-100)"
                        min="1"
                        max="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rejection Reason
                      </label>
                      <input
                        type="text"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Enter rejection reason"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Remarks (Optional)
                    </label>
                    <textarea
                      value={verificationData.remarks}
                      onChange={(e) => setVerificationData(prev => ({ ...prev, remarks: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows="3"
                      placeholder="Add any remarks or feedback"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="primary"
                      icon={<CheckCircle className="w-4 h-4" />}
                      onClick={handleVerify}
                      disabled={!verificationData.points}
                    >
                      Verify Certificate
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      icon={<XCircle className="w-4 h-4" />}
                      onClick={handleReject}
                      disabled={!rejectionReason}
                    >
                      Reject Certificate
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Bulk Verification Modal */}
      <BulkVerificationModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        certificates={filteredCertificates.filter(cert => cert.status === 'Pending')}
        onComplete={() => {
          fetchCertificates()
          setShowBulkModal(false)
          showToast('Bulk verification completed successfully!')
        }}
      />
    </div>
  )
}

export default StudentVerificationPanel
