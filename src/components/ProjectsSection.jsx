import React, { useState, useEffect } from 'react'
import { Plus, Filter, Search, FolderOpen } from 'lucide-react'
import ProjectCard from './ProjectCard'
import AddProjectModal from './AddProjectModal'
import { useAuth } from '../context/AuthContext'

const ProjectsSection = ({ studentId = null }) => {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [filter, setFilter] = useState('all') // all, verified, pending, rejected
  const [searchTerm, setSearchTerm] = useState('')

  // Use provided studentId or current user's ID
  const targetStudentId = studentId || user?._id

  useEffect(() => {
    if (targetStudentId) {
      fetchProjects()
    }
  }, [targetStudentId])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:8000/api/student/${targetStudentId}/projects`, {
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

  const handleAddProject = async (projectData) => {
    try {
      const response = await fetch(`http://localhost:8000/api/student/${targetStudentId}/projects`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setProjects(prev => [result.data, ...prev])
      setIsModalOpen(false)
    } catch (err) {
      console.error('Error adding project:', err)
      throw err
    }
  }

  const handleEditProject = async (projectData) => {
    try {
      const response = await fetch(`http://localhost:8000/api/projects/${editingProject._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setProjects(prev => prev.map(p => p._id === editingProject._id ? result.data : p))
      setEditingProject(null)
      setIsModalOpen(false)
    } catch (err) {
      console.error('Error updating project:', err)
      throw err
    }
  }

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return
    }

    try {
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setProjects(prev => prev.filter(p => p._id !== projectId))
    } catch (err) {
      console.error('Error deleting project:', err)
      alert('Failed to delete project. Please try again.')
    }
  }

  const openEditModal = (project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProject(null)
  }

  const filteredProjects = projects.filter(project => {
    // Filter by status
    if (filter === 'verified' && !project.verified) return false
    if (filter === 'pending' && (project.verified || project.rejectionReason)) return false
    if (filter === 'rejected' && !project.rejectionReason) return false

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        project.title.toLowerCase().includes(searchLower) ||
        project.role.toLowerCase().includes(searchLower) ||
        (project.description && project.description.toLowerCase().includes(searchLower))
      )
    }

    return true
  })

  const getFilterCounts = () => {
    return {
      all: projects.length,
      verified: projects.filter(p => p.verified).length,
      pending: projects.filter(p => !p.verified && !p.rejectionReason).length,
      rejected: projects.filter(p => p.rejectionReason).length
    }
  }

  const filterCounts = getFilterCounts()
  const canAddProjects = !studentId || user?._id === studentId || ['faculty', 'admin'].includes(user?.role)

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-2 text-gray-600">Loading projects...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error loading projects: {error}</p>
        <button
          onClick={fetchProjects}
          className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Projects & Leadership</h2>
          <p className="text-gray-600 mt-1">Showcase your projects and leadership experiences</p>
        </div>
        {canAddProjects && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All', count: filterCounts.all },
            { key: 'verified', label: 'Verified', count: filterCounts.verified },
            { key: 'pending', label: 'Pending', count: filterCounts.pending },
            { key: 'rejected', label: 'Rejected', count: filterCounts.rejected }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard
              key={project._id}
              project={project}
              onEdit={openEditModal}
              onDelete={handleDeleteProject}
              showActions={canAddProjects}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {projects.length === 0 ? 'No projects yet' : 'No projects match your filters'}
          </h3>
          <p className="text-gray-500 mb-6">
            {projects.length === 0 
              ? 'Start building your portfolio by adding your first project'
              : 'Try adjusting your search or filter criteria'
            }
          </p>
          {canAddProjects && projects.length === 0 && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Project
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Project Modal */}
      <AddProjectModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingProject ? handleEditProject : handleAddProject}
        editProject={editingProject}
      />
    </div>
  )
}

export default ProjectsSection
