import React, { useState, useEffect } from 'react'
import { Award, Calendar, MapPin, Star, Trophy, Medal, Target, Trash2, AlertTriangle, X, ZoomIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const StudentAchievements = () => {
  const { user } = useAuth()
  const [achievements, setAchievements] = useState([])
  const [filter, setFilter] = useState('all')
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedAchievement, setSelectedAchievement] = useState(null)
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')

  const categories = ['All', 'Academic', 'Sports', 'Cultural', 'Technical', 'Leadership', 'Community Service', 'Certificate']

  // Fetch verified certificates from new API endpoint
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch('/api/v1/certificates/my-certificates', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const result = await response.json()
          const certificates = result.data.map(cert => ({
            id: cert._id,
            title: cert.title,
            category: cert.category,
            date: new Date(cert.createdAt).toISOString().split('T')[0],
            points: cert.points,
            status: cert.status,
            description: cert.description,
            imageUrl: cert.imageUrl ? `http://localhost:8000${cert.imageUrl}` : null,
            icon: <Award className="w-6 h-6" />
          }))
          
          // Only show real certificates from database
          setAchievements(certificates)
        } else {
          console.error('Failed to fetch certificates')
        }
      } catch (error) {
        console.error('Error fetching certificates:', error)
      }
    }
    
    fetchAchievements()
  }, [])

  const filteredAchievements = achievements.filter(achievement => 
    filter === 'all' || achievement.category.toLowerCase() === filter
  )

  const totalPoints = achievements
    .filter(a => a.status === 'Verified')
    .reduce((sum, a) => sum + a.points, 0)

  // Delete achievement function
  const handleDeleteAchievement = async (achievementId) => {
    try {
      setDeleteLoading(achievementId)
      console.log('Deleting achievement with ID:', achievementId)
      
      const response = await fetch(`/api/v1/certificates/${achievementId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log('Delete response status:', response.status)
      const data = await response.json()
      console.log('Delete response data:', data)
      
      if (data.success) {
        setAchievements(prev => prev.filter(achievement => achievement.id !== achievementId))
        setShowDeleteModal(false)
        setSelectedAchievement(null)
        alert('Achievement deleted successfully!')
      } else {
        alert(data.message || 'Failed to delete achievement')
      }
    } catch (error) {
      console.error('Error deleting achievement:', error)
      alert('Network error occurred')
    } finally {
      setDeleteLoading(null)
    }
  }

  const openDeleteModal = (achievement) => {
    setSelectedAchievement(achievement)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setSelectedAchievement(null)
  }

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl)
    setShowImageModal(true)
  }

  const closeImageModal = () => {
    setShowImageModal(false)
    setSelectedImage('')
  }


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Achievements</h1>
          <p className="text-gray-600">Track your accomplishments and build your portfolio</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Achievements</p>
                <p className="text-2xl font-bold text-gray-900">{achievements.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Star className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Achievement Points</p>
                <p className="text-2xl font-bold text-gray-900">{totalPoints}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-gray-900">
                  {achievements.filter(a => a.status === 'Verified').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {achievements.filter(a => a.status === 'Pending').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setFilter(category.toLowerCase())}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === category.toLowerCase()
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map(achievement => (
            <div key={achievement.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Image/Icon Section */}
                <div className="flex justify-center mb-4">
                  {achievement.imageUrl ? (
                    <div className="relative group cursor-pointer" onClick={() => openImageModal(achievement.imageUrl)}>
                      <img 
                        src={achievement.imageUrl} 
                        alt={achievement.title}
                        className="w-20 h-20 object-cover rounded-lg border hover:opacity-90 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                        <ZoomIn className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-blue-600 bg-blue-50 p-4 rounded-lg">
                      {achievement.icon}
                    </div>
                  )}
                </div>
                
                {/* Content Section */}
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
                  
                  {/* Status and Points */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      achievement.status === 'Verified' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {achievement.status}
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {achievement.status === 'Verified' ? achievement.points : 0} points
                    </span>
                  </div>
                  
                  {/* Date and Category */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {achievement.date}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {achievement.category}
                    </span>
                  </div>

                  {/* Delete Button - Only show for user-uploaded certificates that can be deleted */}
                  {typeof achievement.id === 'string' && achievement.id.length > 10 && achievement.status !== 'Verified' && (
                    <div className="flex justify-center">
                      <button
                        onClick={() => openDeleteModal(achievement)}
                        disabled={deleteLoading === achievement.id}
                        className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        {deleteLoading === achievement.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements found</h3>
            <p className="text-gray-600">No achievements match your current filter.</p>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedAchievement && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Achievement</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to delete "{selectedAchievement.title}"? This action cannot be undone.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={closeDeleteModal}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    disabled={deleteLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteAchievement(selectedAchievement.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
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
                alt="Achievement Certificate Full Size"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentAchievements
