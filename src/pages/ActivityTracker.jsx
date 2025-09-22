import React, { useState } from 'react'
import { Filter, Plus, RotateCcw, Download, Save } from 'lucide-react'
import StatsCard from '../components/StatsCard'
import Button from '../components/Button'
import { useTasks } from '../hooks/useTasks'

const ActivityTracker = () => {
  const { tasks, loading, error, createTask } = useTasks()
  const [newTask, setNewTask] = useState({
    title: '',
    category: '',
    organizer: '',
    date: '',
    hours: ''
  })

  // Fallback static data if no tasks from backend
  const staticActivities = [
    { title: 'Concrete Mix Workshop', category: 'Workshop', organizer: 'NIT Srinagar', status: 'Verified', hours: '08', year: '2025' },
    { title: 'Smart City Hackathon', category: 'Hackathon', organizer: 'JK Gov', status: 'Verified', hours: '24', year: '2024' },
    { title: 'Bridge Load Simulation', category: 'MOOC', organizer: 'Coursera', status: 'Pending', hours: '16', year: '2024' },
    { title: 'Community Volunteering Camp', category: 'Volunteering', organizer: 'NGO', status: 'Verified', hours: '12', year: '2024' },
    { title: 'Department Seminar Series', category: 'Seminar', organizer: 'Civil Dept', status: 'Rejected', hours: '04', year: '2023' }
  ]

  const activities = tasks.length > 0 ? tasks : staticActivities

  const reminders = [
    { task: 'Upload MOOC certificate', due: 'Dec Oct 31' },
    { task: 'Confirm NGO letter', due: 'Due Oct 18' },
    { task: 'Add seminar slides', due: 'Due Nov 02' }
  ]

  const handleNewTaskChange = (e) => {
    const { name, value } = e.target
    setNewTask(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitTask = async (e) => {
    e.preventDefault()
    try {
      await createTask({
        title: newTask.title,
        description: `${newTask.category} organized by ${newTask.organizer}`,
        category: newTask.category,
        organizer: newTask.organizer,
        hours: parseInt(newTask.hours),
        date: newTask.date
      })
      setNewTask({ title: '', category: '', organizer: '', date: '', hours: '' })
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Activity Tracker</h1>
        <div className="flex space-x-3">
          <Button variant="orange" icon={<Filter className="w-4 h-4" />}>
            Filters
          </Button>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            Add Activity
          </Button>
        </div>
      </div>

      {/* Student Info */}
      <div className="flex space-x-4 text-sm">
        <span className="bg-gray-100 px-3 py-1 rounded-full">Student: Simran Kaur</span>
        <span className="bg-gray-100 px-3 py-1 rounded-full">Semester: 5</span>
        <span className="bg-gray-100 px-3 py-1 rounded-full">Category: All</span>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Status: Verified</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Total Points" 
          value="28" 
          subtitle="across 6 categories"
          color="orange"
        />
        <StatsCard 
          title="Pending Review" 
          value="6" 
          subtitle="awaiting approval"
          color="orange"
        />
        <StatsCard 
          title="Completion Rate" 
          value="68%" 
          subtitle="this semester"
          color="orange"
        />
      </div>

      {/* Category Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['Overview', 'MOOCs', 'Workshops', 'Seminars', 'Sports', 'Volunteering'].map((tab) => (
              <button
                key={tab}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  tab === 'Overview' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* My Activities Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">My Activities</h3>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" icon={<RotateCcw className="w-4 h-4" />}>
              Refine
            </Button>
            <Button variant="orange" size="sm" icon={<Download className="w-4 h-4" />}>
              Export
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-orange-500">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Organizer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Year</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activities.map((activity, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.organizer}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activity.status === 'Verified' 
                        ? 'bg-green-100 text-green-700' 
                        : activity.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.hours}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Add Form */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Add</h3>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmitTask}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  type="text"
                  name="title"
                  value={newTask.title}
                  onChange={handleNewTaskChange}
                  placeholder="Activity Title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <select 
                  name="category"
                  value={newTask.category}
                  onChange={handleNewTaskChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-orange-500 text-white"
                  required
                >
                  <option value="">Activity Type</option>
                  <option value="Workshop">Workshop</option>
                  <option value="MOOC">MOOC</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Volunteering">Volunteering</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  type="text"
                  name="organizer"
                  value={newTask.organizer}
                  onChange={handleNewTaskChange}
                  placeholder="Organizer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <input
                  type="date"
                  name="date"
                  value={newTask.date}
                  onChange={handleNewTaskChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  type="number"
                  name="hours"
                  value={newTask.hours}
                  onChange={handleNewTaskChange}
                  placeholder="Hours"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="primary" icon={<Save className="w-4 h-4" />} type="button">
                Save Draft
              </Button>
              <Button variant="orange" type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>
        </div>

        {/* Verification Status & Reminders */}
        <div className="space-y-6">
          {/* Verification Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Faculty Review</span>
                <span className="text-sm font-medium text-blue-600">In Progress</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Pending</span>
                <span className="text-gray-600">1 Required</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Revisions</span>
                <span className="text-sm font-medium text-yellow-600">1 Required</span>
              </div>
            </div>
          </div>

          {/* Reminders */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reminders</h3>
            <div className="space-y-3">
              {reminders.map((reminder, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-900">{reminder.task}</div>
                  <div className="text-xs text-gray-500">{reminder.due}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityTracker
