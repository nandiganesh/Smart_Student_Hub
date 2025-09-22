import React, { useState, useEffect } from 'react'
import { 
  Bell, 
  Plus, 
  Send, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Info,
  Megaphone,
  Filter,
  Search
} from 'lucide-react'
import Button from '../components/Button'
import apiService from '../services/api'

const NotificationsAnnouncements = () => {
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [filterType, setFilterType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    priority: 'medium',
    targetAudience: 'all',
    scheduledFor: '',
    expiresAt: ''
  })

  const notificationTypes = [
    { value: 'info', label: 'Information', icon: Info, color: 'blue' },
    { value: 'warning', label: 'Warning', icon: AlertCircle, color: 'yellow' },
    { value: 'success', label: 'Success', icon: CheckCircle, color: 'green' },
    { value: 'announcement', label: 'Announcement', icon: Megaphone, color: 'purple' }
  ]

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ]

  const audiences = [
    { value: 'all', label: 'All Users' },
    { value: 'students', label: 'Students Only' },
    { value: 'faculty', label: 'Faculty Only' },
    { value: 'admin', label: 'Admin Only' },
    { value: 'department', label: 'Specific Department' }
  ]

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await apiService.get('/admin/notifications')
      
      // Mock data for demonstration
      setNotifications([
        {
          id: 1,
          title: 'System Maintenance Scheduled',
          message: 'The system will be under maintenance on Sunday, 10th September from 2:00 AM to 4:00 AM.',
          type: 'warning',
          priority: 'high',
          targetAudience: 'all',
          status: 'active',
          createdAt: '2024-09-08T10:00:00Z',
          scheduledFor: '2024-09-10T02:00:00Z',
          expiresAt: '2024-09-10T04:00:00Z',
          views: 1247,
          author: 'Admin'
        },
        {
          id: 2,
          title: 'New Certificate Verification Process',
          message: 'We have updated our certificate verification process. Please review the new guidelines.',
          type: 'info',
          priority: 'medium',
          targetAudience: 'faculty',
          status: 'active',
          createdAt: '2024-09-07T14:30:00Z',
          views: 89,
          author: 'Admin'
        },
        {
          id: 3,
          title: 'Semester Results Published',
          message: 'The results for the current semester have been published. Students can now view their grades.',
          type: 'success',
          priority: 'high',
          targetAudience: 'students',
          status: 'active',
          createdAt: '2024-09-06T16:00:00Z',
          views: 2156,
          author: 'Admin'
        }
      ])
      
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNotification = async () => {
    try {
      await apiService.post('/admin/notifications', newNotification)
      setShowCreateModal(false)
      setNewNotification({
        title: '',
        message: '',
        type: 'info',
        priority: 'medium',
        targetAudience: 'all',
        scheduledFor: '',
        expiresAt: ''
      })
      fetchNotifications()
    } catch (error) {
      console.error('Error creating notification:', error)
    }
  }

  const handleDeleteNotification = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await apiService.delete(`/admin/notifications/${id}`)
        fetchNotifications()
      } catch (error) {
        console.error('Error deleting notification:', error)
      }
    }
  }

  const getTypeIcon = (type) => {
    const typeConfig = notificationTypes.find(t => t.value === type)
    if (typeConfig) {
      const Icon = typeConfig.icon
      return <Icon className="w-4 h-4" />
    }
    return <Info className="w-4 h-4" />
  }

  const getTypeColor = (type) => {
    const typeConfig = notificationTypes.find(t => t.value === type)
    return typeConfig ? typeConfig.color : 'blue'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'gray',
      medium: 'blue',
      high: 'orange',
      urgent: 'red'
    }
    return colors[priority] || 'gray'
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === 'all' || notification.type === filterType
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

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
          <h1 className="text-2xl font-bold text-gray-900">Notifications & Announcements</h1>
          <p className="text-gray-600 mt-1">Manage system-wide notifications and announcements</p>
        </div>
        <Button 
          variant="primary" 
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowCreateModal(true)}
        >
          Create Notification
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Types</option>
              {notificationTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map(notification => (
          <div key={notification.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-1 rounded-full bg-${getTypeColor(notification.type)}-100`}>
                    <div className={`text-${getTypeColor(notification.type)}-600`}>
                      {getTypeIcon(notification.type)}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getPriorityColor(notification.priority)}-100 text-${getPriorityColor(notification.priority)}-800`}>
                    {notification.priority}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{notification.message}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{notification.targetAudience}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{notification.views} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Eye className="w-4 h-4" />}
                  onClick={() => setSelectedNotification(notification)}
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Edit className="w-4 h-4" />}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={() => handleDeleteNotification(notification.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create New Notification</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter notification title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter notification message"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newNotification.type}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {notificationTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newNotification.priority}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>{priority.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                <select
                  value={newNotification.targetAudience}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, targetAudience: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {audiences.map(audience => (
                    <option key={audience.value} value={audience.value}>{audience.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Schedule For (Optional)</label>
                  <input
                    type="datetime-local"
                    value={newNotification.scheduledFor}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, scheduledFor: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expires At (Optional)</label>
                  <input
                    type="datetime-local"
                    value={newNotification.expiresAt}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, expiresAt: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={<Send className="w-4 h-4" />}
                onClick={handleCreateNotification}
              >
                Create & Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationsAnnouncements
