import React from 'react'
import { Filter, Download, BarChart } from 'lucide-react'
import StatsCard from '../components/StatsCard'
import Button from '../components/Button'

const DepartmentParticipation = () => {
  const departmentSummary = [
    { dept: 'CSE', participants: 312, verified: 258, pending: 42, rate: '3.5%' },
    { dept: 'ECE', participants: 274, verified: 201, pending: 60, rate: '4.3%' },
    { dept: 'Mechanical', participants: 189, verified: 141, pending: 34, rate: '5.2%' },
    { dept: 'Civil', participants: 165, verified: 118, pending: 31, rate: '2.1%' },
    { dept: 'IT', participants: 234, verified: 178, pending: 31, rate: '3.9%' },
    { dept: 'Management', participants: 203, verified: 154, pending: 27, rate: '2.8%' }
  ]

  const recentActivity = [
    { student: 'Arjun Sharma', department: 'CSE', activity: 'MOOC', status: 'Verified', updated: '2d ago' },
    { student: 'Najma Bhat', department: 'ECE', activity: 'Hackathon', status: 'Pending', updated: '1d ago' },
    { student: 'Rehan Khan', department: 'IT', activity: 'Internship', status: 'Verified', updated: '3h ago' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Department Participation</h1>
        <div className="flex space-x-3">
          <Button variant="orange" icon={<Filter className="w-4 h-4" />}>
            Filters
          </Button>
          <Button variant="primary" icon={<Download className="w-4 h-4" />}>
            NAAC-ready Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 text-sm">
        <span className="bg-gray-100 px-3 py-1 rounded-full">Academic Year: 2024-25</span>
        <span className="bg-gray-100 px-3 py-1 rounded-full">Semester: Odd</span>
        <span className="bg-gray-100 px-3 py-1 rounded-full">Category: All</span>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Verified only</span>
        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">Exclude Rejected</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Participants" 
          value="2,184" 
          subtitle="across all departments"
          color="orange"
        />
        <StatsCard 
          title="Avg per Dept" 
          value="182" 
          subtitle="participation rate"
          color="orange"
        />
        <StatsCard 
          title="Verified" 
          value="72%" 
          subtitle="completion rate"
          color="orange"
        />
        <StatsCard 
          title="Leading Ranking" 
          value="16.5" 
          subtitle="avg activities"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Participation by Department Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Participation by Department</h3>
          <div className="bg-orange-500 rounded-lg h-64 flex items-center justify-center text-white">
            <div className="text-center">
              <BarChart className="w-12 h-12 mx-auto mb-2" />
              <p>Bar chart placeholder</p>
            </div>
          </div>
          <div className="flex justify-center mt-4 space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Participants</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Verified</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Pending</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            This chart shows total, verified, and pending participation per department.
          </p>
        </div>

        {/* Department-wise Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department-wise Summary</h3>
          <div className="bg-orange-500 text-white p-3 rounded-lg mb-4">
            <div className="flex justify-between text-sm font-medium">
              <span>Department</span>
              <span>Participants</span>
              <span>Verified</span>
              <span>Pending</span>
              <span>Rejection Rate</span>
            </div>
          </div>
          <div className="space-y-3">
            {departmentSummary.map((dept, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-xs font-medium">
                    {dept.dept.charAt(0)}
                  </div>
                  <span className="font-medium">{dept.dept}</span>
                </div>
                <span>{dept.participants}</span>
                <span>{dept.verified}</span>
                <span>{dept.pending}</span>
                <span>{dept.rate}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-xs text-gray-500">
            <span>CSV</span>
            <span>XLSX</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-orange-500">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Updated</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentActivity.map((activity, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-900">{activity.student}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.activity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activity.status === 'Verified' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DepartmentParticipation
