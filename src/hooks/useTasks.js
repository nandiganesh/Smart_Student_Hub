import { useState, useEffect } from 'react'
import apiService from '../services/api'

export const useTasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiService.getTasks()
      setTasks(response.data || [])
    } catch (error) {
      setError(error.message)
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData) => {
    try {
      const response = await apiService.createTask(taskData)
      setTasks(prev => [...prev, response.data])
      return response.data
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const updateTask = async (id, taskData) => {
    try {
      const response = await apiService.updateTask(id, taskData)
      setTasks(prev => prev.map(task => 
        task._id === id ? response.data : task
      ))
      return response.data
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const deleteTask = async (id) => {
    try {
      await apiService.deleteTask(id)
      setTasks(prev => prev.filter(task => task._id !== id))
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    clearError: () => setError(null)
  }
}
