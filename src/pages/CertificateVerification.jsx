import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Filter, Search, Calendar, User, Award, FileText, X, ZoomIn, Shield, Sparkles, Clock } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Toast from '../components/Toast';

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

const CertificateVerification = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'Pending',
    category: '',
    department: '',
    search: ''
  });
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [verificationData, setVerificationData] = useState({
    points: '',
    remarks: ''
  });
  const [rejectionReason, setRejectionReason] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const categories = ['Academic', 'Sports', 'Cultural', 'Technical', 'Leadership', 'Community Service'];
  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Information Technology'];

  useEffect(() => {
    fetchCertificates();
  }, [filters]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.department) queryParams.append('department', filters.department);

      const response = await fetch(`/api/faculty/certificates?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        let filteredCerts = data.data;
        
        // Apply search filter on frontend
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredCerts = filteredCerts.filter(cert => 
            cert.title.toLowerCase().includes(searchTerm) ||
            cert.userId.fullName.toLowerCase().includes(searchTerm) ||
            cert.userId.studentId.toLowerCase().includes(searchTerm)
          );
        }
        
        setCertificates(filteredCerts);
      } else {
        setError(data.message || 'Failed to fetch certificates');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (certificateId) => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/faculty/certificates/${certificateId}/verify`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verificationData)
      });

      const data = await response.json();
      
      if (data.success) {
        setCertificates(prev => prev.filter(cert => cert._id !== certificateId));
        setShowModal(false);
        setSelectedCertificate(null);
        setVerificationData({ points: '', remarks: '' });
        alert('Certificate verified successfully!');
      } else {
        setError(data.message || 'Failed to verify certificate');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error verifying certificate:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (certificateId) => {
    try {
      setActionLoading(true);
      console.log('Rejecting certificate:', certificateId, 'with reason:', rejectionReason);
      
      const response = await fetch(`/api/faculty/certificates/${certificateId}/reject`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectionReason })
      });

      console.log('Reject response status:', response.status);
      const data = await response.json();
      console.log('Reject response data:', data);
      
      if (data.success) {
        setCertificates(prev => prev.filter(cert => cert._id !== certificateId));
        setShowModal(false);
        setSelectedCertificate(null);
        setRejectionReason('');
        alert('Certificate rejected successfully!');
      } else {
        setError(data.message || 'Failed to reject certificate');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error rejecting certificate:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (certificate) => {
    setSelectedCertificate(certificate);
    setShowModal(true);
    setVerificationData({ points: certificate.points || '', remarks: '' });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCertificate(null);
    setVerificationData({ points: '', remarks: '' });
    setRejectionReason('');
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage('');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳' },
      'Verified': { bg: 'bg-green-100', text: 'text-green-800', icon: '✅' },
      'Rejected': { bg: 'bg-red-100', text: 'text-red-800', icon: '❌' }
    };
    
    const config = statusConfig[status] || statusConfig['Pending'];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <span className="mr-1">{config.icon}</span>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Certificate Verification
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Review and verify student certificate submissions with advanced verification tools
          </p>
        </div>

        {error && (
          <Card variant="elevated" className="border-l-4 border-red-500">
            <CardContent className="py-4">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-500 mr-3" />
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card variant="glass" className="animate-slideIn">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-lg flex items-center justify-center">
                <Filter className="h-4 w-4 text-teal-600" />
              </div>
              <CardTitle className="text-teal-700">Advanced Filters</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="Pending">Pending</option>
                  <option value="Verified">Verified</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                <select
                  value={filters.department}
                  onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by title, student name..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Certificates List */}
      <Card variant="elevated" className="animate-slideIn overflow-hidden">
        <CardHeader>
          <CardTitle className="text-teal-700">
            Certificates ({certificates.length})
          </CardTitle>
        </CardHeader>

        {certificates.length === 0 ? (
          <CardContent className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-2xl mb-4">
              <Award className="w-8 h-8 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No certificates found</h3>
            <p className="text-gray-500">No certificates match your current filters.</p>
          </CardContent>
        ) : (
          <div className="divide-y divide-gray-200">
            {certificates.map((certificate) => (
              <div key={certificate._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{certificate.title}</h4>
                      {getStatusBadge(certificate.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{certificate.userId.fullName} ({certificate.userId.studentId})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        <span>{certificate.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(certificate.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {certificate.description && (
                      <p className="text-gray-700 mb-4">{certificate.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => openModal(certificate)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-teal-700">Certificate Review</CardTitle>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedCertificate.title}</h4>
                  <p className="text-sm text-gray-600">by {selectedCertificate.userId.fullName}</p>
                </div>

                {selectedCertificate.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <p className="text-gray-700">{selectedCertificate.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <p className="text-gray-700">{selectedCertificate.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Points</label>
                    <p className="text-gray-700">{selectedCertificate.points || 0}</p>
                  </div>
                </div>

                {selectedCertificate.imageUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Image</label>
                    <div className="relative group cursor-pointer" onClick={() => openImageModal(`http://localhost:8000${selectedCertificate.imageUrl}`)}>
                      <img
                        src={`http://localhost:8000${selectedCertificate.imageUrl}`}
                        alt="Certificate"
                        className="max-w-full h-auto rounded-lg border border-gray-300 hover:opacity-90 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Click to view full size</p>
                  </div>
                )}

                {/* Points Criteria Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-900 mb-3">Points Awarding Criteria</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Certificate (Basic):</span>
                        <span className="font-medium text-blue-900">30-50 points</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Certificate (Advanced):</span>
                        <span className="font-medium text-blue-900">60-80 points</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Competition Winner:</span>
                        <span className="font-medium text-blue-900">80-100 points</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Workshop/Seminar:</span>
                        <span className="font-medium text-blue-900">20-40 points</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Leadership Role:</span>
                        <span className="font-medium text-blue-900">50-70 points</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Community Service:</span>
                        <span className="font-medium text-blue-900">30-60 points</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Points to Award *</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={verificationData.points}
                      onChange={(e) => setVerificationData(prev => ({ ...prev, points: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter points (0-100)"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Refer to criteria above for guidance</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Remarks (Optional)</label>
                    <input
                      type="text"
                      value={verificationData.remarks}
                      onChange={(e) => setVerificationData(prev => ({ ...prev, remarks: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add verification remarks"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason (if rejecting)</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide reason for rejection"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReject(selectedCertificate._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    disabled={actionLoading || !rejectionReason.trim()}
                  >
                    {actionLoading ? 'Processing...' : 'Reject'}
                  </button>
                  <button
                    onClick={() => handleVerify(selectedCertificate._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Processing...' : 'Verify'}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Full Size Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2 z-10"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={selectedImage}
              alt="Certificate Full Size"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateVerification;
