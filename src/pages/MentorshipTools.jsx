import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  MessageCircle, 
  TrendingUp, 
  Award, 
  BookOpen,
  Calendar,
  Star,
  Send,
  Filter,
  Download,
  Eye,
  Edit3,
  Target,
  UserCheck,
  Heart
} from 'lucide-react'
import Button from '../components/Button'
import Card, { CardHeader, CardTitle, CardContent } from '../components/Card'
import Toast from '../components/Toast'
import apiService from '../services/api'

const MentorshipTools = () => {
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showProfile, setShowProfile] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [filters, setFilters] = useState({
    department: '',
    semester: '',
    search: ''
  })
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    fetchStudents()
  }, [filters.department, filters.semester])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.department) params.append('department', filters.department)
      if (filters.semester) params.append('semester', filters.semester)
      
      const response = await apiService.get(`/api/faculty/students?${params.toString()}`)
      setStudents(response.data || [])
    } catch (error) {
      console.error('Error fetching students:', error)
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewProfile = async (student) => {
    try {
      // Fetch student's certificates and achievements
      const certificatesResponse = await apiService.get(`/faculty/certificates?studentId=${student._id}`)
      const certificates = certificatesResponse.data || []
      
      setSelectedStudent({
        ...student,
        certificates: certificates,
        totalPoints: certificates
          .filter(cert => cert.status === 'Verified')
          .reduce((sum, cert) => sum + (cert.points || 0), 0)
      })
      setShowProfile(true)
    } catch (error) {
      console.error('Error fetching student profile:', error)
    }
  }

  const handleSendFeedback = async () => {
    try {
      // This would typically send feedback to the student
      console.log('Sending feedback to student:', selectedStudent._id, feedback)
      setFeedback('')
      // You can implement a feedback system here
    } catch (error) {
      console.error('Error sending feedback:', error)
    }
  }

  const filteredStudents = students.filter(student =>
    student.fullName?.toLowerCase().includes(filters.search.toLowerCase()) ||
    student.studentId?.toLowerCase().includes(filters.search.toLowerCase()) ||
    student.email?.toLowerCase().includes(filters.search.toLowerCase())
  )

  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical']
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Mentorship Tools
              </h1>
              <p className="text-gray-600 text-lg">Manage student profiles, provide feedback, and track progress</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div></div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              icon={<Download className="w-4 h-4" />}
              className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-purple-700 hover:from-purple-100 hover:to-pink-100"
            >
              Export Student Data
            </Button>
            <Button 
              variant="outline" 
              icon={<MessageCircle className="w-4 h-4" />}
              className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-purple-700 hover:from-purple-100 hover:to-pink-100"
            >
              Bulk Message
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card variant="elevated">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Filter Students
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                />
              </div>

              <select
                value={filters.department}
                onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              <select
                value={filters.semester}
                onChange={(e) => setFilters(prev => ({ ...prev, semester: e.target.value }))}
                className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              >
                <option value="">All Semesters</option>
                {semesters.map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>

              <Button 
                variant="outline" 
                onClick={() => setFilters({ department: '', semester: '', search: '' })}
                className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-purple-700 hover:from-purple-100 hover:to-pink-100"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <Card variant="elevated" className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-4 animate-pulse">
                  <UserCheck className="w-8 h-8 text-purple-600" />
                </div>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-4"></div>
                <p className="text-gray-600">Loading students...</p>
              </CardContent>
            </Card>
          ) : filteredStudents.length === 0 ? (
            <Card variant="elevated" className="col-span-full">
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
                <p className="text-gray-500">No students found matching your criteria</p>
              </CardContent>
            </Card>
          ) : (
            filteredStudents.map((student) => (
              <Card key={student._id} variant="glass" className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold text-lg">
                        {student.fullName?.charAt(0) || 'S'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Eye className="w-4 h-4" />}
                        onClick={() => handleViewProfile(student)}
                        className="text-purple-600 hover:bg-purple-50"
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<MessageCircle className="w-4 h-4" />}
                        className="text-pink-600 hover:bg-pink-50"
                      >
                        Message
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{student.fullName}</h3>
                    <p className="text-sm text-purple-600 font-mono bg-purple-50 px-2 py-1 rounded-md inline-block">{student.studentId}</p>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {student.department}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                        Semester {student.semester}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-purple-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">Performance</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[1,2,3,4,5].map((star) => (
                            <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="font-bold text-purple-600">4.2/5</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Student Profile Modal */}
        {showProfile && selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card variant="elevated" className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Student Profile
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowProfile(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Student Info */}
                  <div className="lg:col-span-1">
                    <Card variant="glass" className="bg-gradient-to-br from-purple-25 to-pink-25">
                      <CardContent className="p-6">
                        <div className="text-center mb-6">
                          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-2xl font-bold text-purple-600">
                              {selectedStudent.fullName?.charAt(0)}
                            </span>
                          </div>
                          <h4 className="font-bold text-gray-900 text-lg">{selectedStudent.fullName}</h4>
                          <p className="text-purple-600 font-mono bg-purple-50 px-3 py-1 rounded-full inline-block mt-2">{selectedStudent.studentId}</p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-purple-700 mb-1 block">Department</label>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                              {selectedStudent.department}
                            </span>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-purple-700 mb-1 block">Semester</label>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
                              Semester {selectedStudent.semester}
                            </span>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-purple-700 mb-1 block">Email</label>
                            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{selectedStudent.email}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-purple-700 mb-1 block">Points Earned</label>
                            <div className="flex items-center space-x-2">
                              <Award className="w-5 h-5 text-yellow-500" />
                              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {selectedStudent.totalPoints || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <div className="mt-6 space-y-3">
                      <Button 
                        variant="primary" 
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700" 
                        icon={<MessageCircle className="w-4 h-4" />}
                      >
                        Send Message
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full border-purple-200 text-purple-700 hover:bg-purple-50" 
                        icon={<Calendar className="w-4 h-4" />}
                      >
                        Schedule Meeting
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full border-pink-200 text-pink-700 hover:bg-pink-50" 
                        icon={<Target className="w-4 h-4" />}
                      >
                        Set Goals
                      </Button>
                    </div>
                  </div>

                  {/* Achievements & Certificates */}
                  <div className="lg:col-span-2">
                    <div className="space-y-6">
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4">
                        <Card variant="glass" className="bg-gradient-to-br from-blue-50 to-indigo-50">
                          <CardContent className="p-4 text-center">
                            <div className="flex items-center justify-center mb-2">
                              <BookOpen className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="text-2xl font-bold text-blue-600">
                              {selectedStudent.certificates?.length || 0}
                            </div>
                            <div className="text-sm text-blue-600 font-medium">Total Certificates</div>
                          </CardContent>
                        </Card>
                        <Card variant="glass" className="bg-gradient-to-br from-green-50 to-emerald-50">
                          <CardContent className="p-4 text-center">
                            <div className="flex items-center justify-center mb-2">
                              <Award className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="text-2xl font-bold text-green-600">
                              {selectedStudent.certificates?.filter(cert => cert.status === 'Verified').length || 0}
                            </div>
                            <div className="text-sm text-green-600 font-medium">Verified</div>
                          </CardContent>
                        </Card>
                        <Card variant="glass" className="bg-gradient-to-br from-purple-50 to-pink-50">
                          <CardContent className="p-4 text-center">
                            <div className="flex items-center justify-center mb-2">
                              <Star className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              {selectedStudent.totalPoints || 0}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Recent Certificates */}
                      <Card variant="glass">
                        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                          <CardTitle className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                              <Award className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              Recent Certificates
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {selectedStudent.certificates?.slice(0, 5).map((cert) => (
                              <div key={cert._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-25 to-pink-25 rounded-xl border border-purple-100 hover:shadow-md transition-all duration-200">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                                    <Award className="w-5 h-5 text-purple-600" />
                                  </div>
                                  <div>
                                    <h6 className="font-semibold text-gray-900">{cert.title}</h6>
                                    <p className="text-sm text-purple-600">{cert.category}</p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(cert.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                                  cert.status === 'Verified' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800' :
                                  cert.status === 'Rejected' ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800' :
                                  'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800'
                                }`}>
                                  {cert.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Feedback Section */}
                      <Card variant="glass">
                        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                          <CardTitle className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                              <MessageCircle className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              Send Feedback
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <textarea
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                              placeholder="Write your feedback or suggestions for the student..."
                              className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                              rows="4"
                            />
                            <div className="flex gap-3">
                              <Button
                                variant="primary"
                                icon={<Send className="w-4 h-4" />}
                                onClick={handleSendFeedback}
                                disabled={!feedback.trim()}
                                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                              >
                                Send Feedback
                              </Button>
                              <Button 
                                variant="outline"
                                className="border-purple-200 text-purple-700 hover:bg-purple-50"
                              >
                                Save as Draft
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  )
}

export default MentorshipTools
