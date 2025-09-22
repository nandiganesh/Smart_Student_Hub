import React, { useState, useEffect } from 'react'
import { Filter, Share, FileText, Award, Calendar } from 'lucide-react'
import StatsCard from '../components/StatsCard'
import Button from '../components/Button'
import ProjectsSection from '../components/ProjectsSection'
import { useAuth } from '../context/AuthContext'

const Portfolio = () => {
  const { user } = useAuth()
  const [portfolioData, setPortfolioData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch user's portfolio data
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:8000/api/dashboard/${user._id}/dashboard`, {
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
        setPortfolioData(result.data)
      } catch (err) {
        console.error('Error fetching portfolio data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (user?._id) {
      fetchPortfolioData()
    }
  }, [user])

  // Default skills if none in database
  const defaultSkills = [
    { name: 'Programming', level: 'Intermediate', color: 'bg-orange-500' },
    { name: 'Problem Solving', level: 'Advanced', color: 'bg-orange-500' },
    { name: 'Communication', level: 'Intermediate', color: 'bg-orange-500' },
    { name: 'Teamwork', level: 'Advanced', color: 'bg-orange-500' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Student Portfolio</h1>
        <div className="flex space-x-3">
          <Button variant="orange" icon={<Filter className="w-4 h-4" />}>
            Filters
          </Button>
          <Button variant="primary" icon={<Share className="w-4 h-4" />}>
            Share Profile
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-2 text-gray-600">Loading portfolio...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading portfolio: {error}</p>
        </div>
      )}

      {/* Student Info */}
      {!loading && !error && (
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            Student: {user?.name || 'Unknown'}
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            Department: {user?.department || 'Not specified'}
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            Student ID: {user?.studentId || 'Not specified'}
          </span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Verified only</span>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Profile */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'S'}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{user?.name || 'Student'}</h3>
                <p className="text-sm text-gray-500">
                  {user?.department || 'Department'} • {user?.studentId || 'Student ID'}
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <StatsCard 
                title="Total Activities" 
                value={portfolioData?.stats?.totalActivities || 0}
                subtitle="across categories"
                color="orange"
              />
              <StatsCard 
                title="Verified" 
                value={portfolioData?.stats?.verifiedActivities || 0}
                subtitle={`${portfolioData?.stats?.totalCredits || 0} credits`}
                color="orange"
              />
              <StatsCard 
                title="Certificates" 
                value={portfolioData?.stats?.totalCertificates || 0}
                subtitle="submitted"
                color="orange"
              />
              <StatsCard 
                title="Pending" 
                value={portfolioData?.stats?.pendingActivities || 0}
                subtitle="under review"
                color="orange"
              />
            </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-2 mb-4">
            <Button variant="primary" size="sm">Highlights</Button>
            <Button variant="orange" size="sm">All Activities</Button>
            <Button variant="outline" size="sm">Documents</Button>
          </div>
        </div>

          {/* Activity Timeline */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-orange-500">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Organizer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {portfolioData?.activities?.length > 0 ? (
                    portfolioData.activities.map((activity, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {activity.title || activity.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {activity.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {activity.organizer || activity.issuingOrganization || 'N/A'}
                        </td>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {activity.dateIssued ? new Date(activity.dateIssued).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No activities found. Upload certificates to get started!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Featured Projects */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Projects</h3>
            <div className="space-y-4">
              {portfolioData?.activities?.filter(activity => activity.category === 'Project')?.length > 0 ? (
                portfolioData.activities
                  .filter(activity => activity.category === 'Project')
                  .slice(0, 3)
                  .map((project, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <FileText className="w-8 h-8 text-gray-400" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{project.title || project.name}</div>
                        <div className="text-sm text-gray-500">
                          {project.category} • {project.dateIssued ? new Date(project.dateIssued).getFullYear() : 'N/A'}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'Verified' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No projects uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent Certificates */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Certificates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {portfolioData?.activities?.slice(0, 3)?.map((certificate, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <Award className="w-8 h-8 text-orange-600" />
                </div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {certificate.title || certificate.name}
                </div>
                <div className="text-xs text-gray-500">
                  {certificate.category}
                </div>
                <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                  certificate.status === 'Verified' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {certificate.status}
                </span>
              </div>
            )) || (
              <div className="col-span-3 text-center py-8 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No certificates uploaded yet</p>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Upload certificates and proofs to strengthen your profile.
          </p>
        </div>
      )}
    </div>
  )
}

export default Portfolio
