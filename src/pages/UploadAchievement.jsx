import React, { useState } from 'react'
import { Upload, FileText, Award, Calendar, Plus, Image, X, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import Toast from '../components/Toast'
import { useAuth } from '../context/AuthContext'

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

const UploadCertificate = () => {
  const { user } = useAuth()
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Academic',
    image: null
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }

  const achievements = [
    { title: 'Best Project Award', category: 'Academic', date: '2024-03-15', status: 'Verified' },
    { title: 'Hackathon Winner', category: 'Competition', date: '2024-02-20', status: 'Pending' },
    { title: 'Research Publication', category: 'Research', date: '2024-01-10', status: 'Verified' }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }))
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.image) {
      showToast('Please select an image', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('image', formData.image)

      const response = await fetch('http://localhost:8000/api/v1/certificates/upload', {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend
      })

      if (response.ok) {
        showToast('Certificate uploaded successfully! It will be reviewed by faculty.', 'success')
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: 'Certificate',
          image: null
        })
        setImagePreview(null)
        setShowUploadForm(false)
      } else {
        const error = await response.json()
        showToast('Upload failed: ' + (error.message || 'Unknown error'), 'error')
      }
    } catch (error) {
      console.error('Upload error:', error)
      showToast('Upload failed: ' + error.message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }))
    setImagePreview(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Upload Certificate
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Upload your certificates and build your digital portfolio
          </p>
          <Button 
            variant="primary" 
            size="lg"
            icon={<Plus className="w-5 h-5" />}
            onClick={() => setShowUploadForm(true)}
            className="animate-pulse-subtle"
          >
            Add New Achievement
          </Button>
        </div>

        {/* Student Info */}
        <Card variant="glass" className="animate-slideIn">
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-lg font-semibold text-gray-900">
                  Logged in as: {user?.email || 'Student'}
                </span>
                <p className="text-gray-600 mt-1">
                  All achievements will be linked to your profile and reviewed by faculty
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Form */}
        {showUploadForm && (
          <Card variant="elevated" className="animate-slideIn">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center space-x-3">
                  <Upload className="w-6 h-6 text-blue-600" />
                  <span>Add New Certificate</span>
                </CardTitle>
                <button 
                  onClick={() => setShowUploadForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Certificate Title</label>
                  <input 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    required
                    placeholder="Enter certificate title"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Certificate Description</label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    required
                    rows={4} 
                    placeholder="Describe your certificate in detail"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  >
                    <option value="Certificate">Certificate</option>
                    <option value="Academic">Academic</option>
                    <option value="Sports">Sports</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Technical">Technical</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Community Service">Community Service</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Upload Certificate Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200">
                    {!imagePreview ? (
                      <div>
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Image className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-lg font-medium text-gray-700 mb-2">Upload an image of your certificate</p>
                        <p className="text-sm text-gray-500 mb-6">PNG, JPG, GIF up to 10MB</p>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageChange} 
                          className="hidden"
                          id="image-upload"
                        />
                        <label 
                          htmlFor="image-upload"
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                          <Upload className="w-5 h-5 mr-2" />
                          Choose File
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Certificate preview" 
                          className="max-w-full h-64 object-cover rounded-xl mx-auto shadow-lg"
                        />
                        <button 
                          type="button" 
                          onClick={removeImage} 
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <p className="text-sm font-medium text-gray-700 mt-4">{formData.image?.name}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowUploadForm(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={!formData.title || !formData.description || isSubmitting}
                    loading={isSubmitting}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Certificate
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Existing Achievements */}
        <Card variant="elevated" className="animate-fadeIn">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <span>Your Certificates</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {achievements.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No certificates uploaded yet</h3>
                <p className="text-gray-600">Upload your first certificate to get started!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {achievements.map((achievement, index) => (
                      <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{achievement.title}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {achievement.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{achievement.date}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {achievement.status === 'Verified' ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : achievement.status === 'Pending' ? (
                              <Clock className="w-4 h-4 text-yellow-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                              achievement.status === 'Verified' 
                                ? 'bg-green-100 text-green-700' 
                                : achievement.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {achievement.status}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
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

export default UploadCertificate
