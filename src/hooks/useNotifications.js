import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export const useNotifications = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  // Simulate real-time notifications
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      // Simulate new notifications based on user activity
      if (Math.random() > 0.95) { // 5% chance every 30 seconds
        addNotification(generateRandomNotification())
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [user])

  const generateRandomNotification = () => {
    const now = new Date()
    
    if (user?.role === 'faculty' || user?.role === 'admin') {
      const facultyNotifications = [
        {
          id: `notif_${Date.now()}`,
          type: 'certificate_pending',
          title: 'New Certificate Submission',
          message: `${getRandomStudentName()} submitted a certificate for verification`,
          timestamp: now,
          read: false
        },
        {
          id: `notif_${Date.now()}`,
          type: 'student_message',
          title: 'Student Message',
          message: `You have a new message from ${getRandomStudentName()}`,
          timestamp: now,
          read: false
        }
      ]
      return facultyNotifications[Math.floor(Math.random() * facultyNotifications.length)]
    } else {
      const studentNotifications = [
        {
          id: `notif_${Date.now()}`,
          type: 'certificate_verified',
          title: 'Certificate Verified',
          message: 'Your certificate has been verified and points awarded',
          timestamp: now,
          read: false
        },
        {
          id: `notif_${Date.now()}`,
          type: 'faculty_feedback',
          title: 'New Feedback',
          message: 'You received feedback from your faculty mentor',
          timestamp: now,
          read: false
        }
      ]
      return studentNotifications[Math.floor(Math.random() * studentNotifications.length)]
    }
  }

  const getRandomStudentName = () => {
    const names = ['Student A', 'Student B', 'Student C', 'Student D', 'Student E']
    return names[Math.floor(Math.random() * names.length)]
  }

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev])
    setUnreadCount(prev => prev + 1)
  }

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
    setUnreadCount(0)
  }

  const deleteNotification = (notificationId) => {
    const notification = notifications.find(n => n.id === notificationId)
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    )
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const clearAllNotifications = () => {
    setNotifications([])
    setUnreadCount(0)
  }

  // Simulate fetching notifications on mount
  useEffect(() => {
    if (user) {
      setLoading(true)
      // Simulate API call delay
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }, [user])

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    addNotification
  }
}
