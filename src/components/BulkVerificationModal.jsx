import React, { useState, useEffect } from 'react'
import { 
  X, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileText,
  Users,
  Award,
  Download
} from 'lucide-react'
import Button from './Button'
import apiService from '../services/api'

const BulkVerificationModal = ({ isOpen, onClose, certificates = [], onComplete }) => {
  const [selectedCertificates, setSelectedCertificates] = useState([])
  const [bulkAction, setBulkAction] = useState('verify')
  const [bulkPoints, setBulkPoints] = useState(10)
  const [bulkRemarks, setBulkRemarks] = useState('')
  const [bulkReason, setBulkReason] = useState('')
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setSelectedCertificates([])
      setBulkAction('verify')
      setBulkPoints(10)
      setBulkRemarks('')
      setBulkReason('')
      setProgress(0)
    }
  }, [isOpen])

  const handleSelectAll = () => {
    if (selectedCertificates.length === certificates.length) {
      setSelectedCertificates([])
    } else {
      setSelectedCertificates(certificates.map(cert => cert._id))
    }
  }

  const handleSelectCertificate = (certId) => {
    setSelectedCertificates(prev => 
      prev.includes(certId) 
        ? prev.filter(id => id !== certId)
        : [...prev, certId]
    )
  }

  const handleBulkProcess = async () => {
    if (selectedCertificates.length === 0) return

    setProcessing(true)
    setProgress(0)

    try {
      const total = selectedCertificates.length
      let completed = 0

      for (const certId of selectedCertificates) {
        try {
          if (bulkAction === 'verify') {
            await apiService.verifyCertificate(certId, {
              points: bulkPoints,
              remarks: bulkRemarks || 'Bulk verification'
            })
          } else {
            await apiService.rejectCertificate(certId, {
              reason: bulkReason || 'Bulk rejection'
            })
          }
          
          completed++
          setProgress((completed / total) * 100)
          
          // Small delay to show progress
          await new Promise(resolve => setTimeout(resolve, 200))
        } catch (error) {
          console.error(`Error processing certificate ${certId}:`, error)
        }
      }

      // Call completion callback
      if (onComplete) {
        onComplete()
      }

      // Close modal after completion
      setTimeout(() => {
        onClose()
        setProcessing(false)
      }, 1000)

    } catch (error) {
      console.error('Error in bulk processing:', error)
      setProcessing(false)
    }
  }

  const exportSelectedData = () => {
    const selectedData = certificates.filter(cert => 
      selectedCertificates.includes(cert._id)
    )
    
    const csvContent = [
      ['Student Name', 'Student ID', 'Certificate Title', 'Category', 'Status', 'Submitted Date'],
      ...selectedData.map(cert => [
        cert.userId?.fullName || '',
        cert.userId?.studentId || '',
        cert.title || '',
        cert.category || '',
        cert.status || '',
        new Date(cert.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bulk_certificates_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Bulk Certificate Processing</h3>
              <p className="text-gray-600 mt-1">
                Process multiple certificates at once ({certificates.length} available)
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={processing}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          {processing && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Processing certificates...</span>
                <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left Column - Action Settings */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bulk Action
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setBulkAction('verify')}
                    disabled={processing}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      bulkAction === 'verify'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-sm font-medium">Verify</div>
                  </button>
                  <button
                    onClick={() => setBulkAction('reject')}
                    disabled={processing}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      bulkAction === 'reject'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <XCircle className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-sm font-medium">Reject</div>
                  </button>
                </div>
              </div>

              {bulkAction === 'verify' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Points to Award
                    </label>
                    <input
                      type="number"
                      value={bulkPoints}
                      onChange={(e) => setBulkPoints(parseInt(e.target.value) || 0)}
                      disabled={processing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      min="1"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Remarks (Optional)
                    </label>
                    <textarea
                      value={bulkRemarks}
                      onChange={(e) => setBulkRemarks(e.target.value)}
                      disabled={processing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows="3"
                      placeholder="Add remarks for all selected certificates"
                    />
                  </div>
                </>
              )}

              {bulkAction === 'reject' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rejection Reason
                  </label>
                  <textarea
                    value={bulkReason}
                    onChange={(e) => setBulkReason(e.target.value)}
                    disabled={processing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="3"
                    placeholder="Provide reason for rejection"
                    required
                  />
                </div>
              )}
            </div>

            {/* Right Column - Statistics */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Selection Summary</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Total Certificates</span>
                  </div>
                  <span className="font-medium">{certificates.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-600">Selected</span>
                  </div>
                  <span className="font-medium text-orange-600">{selectedCertificates.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Unique Students</span>
                  </div>
                  <span className="font-medium">
                    {new Set(certificates.filter(cert => selectedCertificates.includes(cert._id))
                      .map(cert => cert.userId?._id)).size}
                  </span>
                </div>
                {bulkAction === 'verify' && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Total Points</span>
                    </div>
                    <span className="font-medium text-green-600">
                      {selectedCertificates.length * bulkPoints}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Certificate Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Select Certificates</h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportSelectedData}
                  disabled={selectedCertificates.length === 0 || processing}
                  icon={<Download className="w-4 h-4" />}
                >
                  Export Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  disabled={processing}
                >
                  {selectedCertificates.length === certificates.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
              {certificates.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No certificates available for bulk processing
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {certificates.map((cert) => (
                    <div key={cert._id} className="p-3 hover:bg-gray-50">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCertificates.includes(cert._id)}
                          onChange={() => handleSelectCertificate(cert._id)}
                          disabled={processing}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-gray-900 truncate">
                              {cert.title}
                            </h5>
                            <span className="text-xs text-gray-500 ml-2">
                              {cert.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {cert.userId?.fullName} • {cert.userId?.studentId}
                          </p>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={processing}
            >
              Cancel
            </Button>
            
            <div className="flex gap-3">
              {selectedCertificates.length > 0 && !processing && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <AlertTriangle className="w-4 h-4" />
                  {selectedCertificates.length} certificate(s) will be {bulkAction === 'verify' ? 'verified' : 'rejected'}
                </div>
              )}
              
              <Button
                variant="primary"
                onClick={handleBulkProcess}
                disabled={
                  selectedCertificates.length === 0 || 
                  processing ||
                  (bulkAction === 'reject' && !bulkReason.trim())
                }
                icon={bulkAction === 'verify' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              >
                {processing 
                  ? `Processing... (${Math.round(progress)}%)`
                  : `${bulkAction === 'verify' ? 'Verify' : 'Reject'} Selected (${selectedCertificates.length})`
                }
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BulkVerificationModal
