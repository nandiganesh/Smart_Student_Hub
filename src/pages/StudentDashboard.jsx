import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Download, 
  Share2, 
  Star,
  Edit,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  User,
  Plus,
  BarChart
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import StatsCard from '../components/StatsCard';
import { downloadPortfolio } from '../utils/portfolioDownload';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState('');

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/dashboard/${user._id}/dashboard`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setDashboardData(result.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchDashboardData();
    }
  }, [user]);

  // Handle portfolio download
  const handleDownloadPortfolio = async () => {
    if (!user?._id) {
      setDownloadMessage('User not authenticated')
      return
    }

    setDownloadLoading(true)
    setDownloadMessage('')
    
    try {
      const result = await downloadPortfolio(user._id)
      setDownloadMessage(result.message)
      
      // Clear message after 3 seconds
      setTimeout(() => setDownloadMessage(''), 3000)
    } catch (error) {
      setDownloadMessage('Failed to download portfolio')
      setTimeout(() => setDownloadMessage(''), 3000)
    } finally {
      setDownloadLoading(false)
    }
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      'Verified': 'bg-green-100 text-green-700 border-green-200',
      'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Rejected': 'bg-red-100 text-red-700 border-red-200'
    };
    
    const icons = {
      'Verified': <CheckCircle className="w-3 h-3" />,
      'Pending': <Clock className="w-3 h-3" />,
      'Rejected': <XCircle className="w-3 h-3" />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status] || styles['Pending']}`}>
        {icons[status]}
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8 text-gray-500">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Error loading dashboard: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <div className="flex space-x-3">
          <Button 
            variant="green" 
            icon={<Download className="w-4 h-4" />}
            onClick={handleDownloadPortfolio}
            disabled={downloadLoading}
          >
            {downloadLoading ? 'Generating...' : 'Download Portfolio'}
          </Button>
        </div>
      </div>

      {/* Download Message */}
      {downloadMessage && (
        <div className={`p-3 rounded-lg text-sm ${
          downloadMessage.includes('success') || downloadMessage.includes('downloaded')
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {downloadMessage}
        </div>
      )}

      {/* Welcome Message */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Welcome, {dashboardData?.user?.name || 'Student'}! 👋
        </h2>
        <p className="text-gray-600 mt-1">Here's your academic progress and achievements overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          <div className="col-span-4 text-center py-8 text-gray-500">Loading dashboard data...</div>
        ) : error ? (
          <div className="col-span-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            Error loading data: {error}
          </div>
        ) : (
          <>
            <StatsCard
              title="Total Activities"
              value={dashboardData?.stats?.totalActivities?.toString() || '0'}
              icon={<TrendingUp className="w-6 h-6" />}
              color="blue"
            />
            <StatsCard
              title="Credits Earned"
              value={dashboardData?.stats?.credits?.toString() || '0'}
              icon={<Award className="w-6 h-6" />}
              color="green"
            />
            <StatsCard
              title="Verified Activities"
              value={dashboardData?.stats?.verifiedActivities?.toString() || '0'}
              icon={<CheckCircle className="w-6 h-6" />}
              color="purple"
            />
            <StatsCard
              title="Pending Approvals"
              value={dashboardData?.stats?.pending?.toString() || '0'}
              icon={<Clock className="w-6 h-6" />}
              color="orange"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Progress Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Progress Snapshot</h3>
          <div className="h-64">
            {dashboardData?.academicProgress?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardData.academicProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semester" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="cgpa" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    name="CGPA"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Attendance %"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="bg-orange-500 rounded-lg h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <BarChart className="w-12 h-12 mx-auto mb-2" />
                  <p>Academic progress chart</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile & Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Profile</h3>
          
          {/* Profile Info */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
              {dashboardData?.student?.photoUrl ? (
                <img 
                  src={dashboardData.student.photoUrl} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-white text-lg font-medium">
                  {dashboardData?.user?.name?.charAt(0) || 'S'}
                </span>
              )}
            </div>
            <h4 className="font-medium text-gray-900">{dashboardData?.user?.name}</h4>
            <p className="text-sm text-gray-500">{dashboardData?.user?.department}</p>
            <div className="mt-2 text-xs text-gray-600">
              <p>Roll No: {dashboardData?.student?.rollNo}</p>
              <p>Batch: {dashboardData?.student?.batch}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg">
              <Plus className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-medium">Upload Certificate</div>
                <div className="text-sm text-gray-500">Add new achievement</div>
              </div>
            </button>
            <button 
              onClick={handleDownloadPortfolio}
              disabled={downloadLoading}
              className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg"
            >
              <Download className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-medium">
                  {downloadLoading ? 'Generating...' : 'Download Portfolio'}
                </div>
                <div className="text-sm text-gray-500">Get PDF portfolio</div>
              </div>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg">
              <Share2 className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-medium">Share Profile</div>
                <div className="text-sm text-gray-500">Get profile link</div>
              </div>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4">Quick actions to manage your profile.</p>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-orange-500">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Organizer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Points</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData?.activities?.length > 0 ? (
                dashboardData.activities.map((activity, index) => (
                  <tr key={activity.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.organizer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(activity.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(activity.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activity.points || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No activities found. Start by uploading your first certificate!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
