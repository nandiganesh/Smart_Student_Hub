import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, BookOpen, Calendar, Award, Clock, GraduationCap, Target, Star } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import apiService from '../services/api'
import Button from '../components/Button'
import StatsCard from '../components/StatsCard'
import Card, { CardHeader, CardTitle, CardContent } from '../components/Card'
import Toast from '../components/Toast'

const AcademicProgress = () => {
  const { user } = useAuth()
  const [academicData, setAcademicData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }

  useEffect(() => {
    fetchAcademicData()
  }, [])

  const fetchAcademicData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('http://localhost:8000/api/student/marks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch academic data')
      }

      const result = await response.json()
      
      if (result.success) {
        setAcademicData(result.data)
      } else {
        throw new Error(result.message || 'Failed to fetch academic data')
      }
    } catch (err) {
      console.error('Error fetching academic data:', err)
      setError(err.message)
      // Set empty data structure for error state
      setAcademicData({
        student: { name: user?.fullName || 'Student' },
        academicSummary: { cgpa: 0, totalCredits: 0, totalSubjects: 0, passedSubjects: 0, failedSubjects: 0, averagePercentage: 0 },
        semesters: []
      })
    } finally {
      setLoading(false)
    }
  }

  const getGradeColor = (grade) => {
    const gradeColors = {
      'A+': 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
      'A': 'bg-gradient-to-r from-green-400 to-green-500 text-white',
      'A-': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
      'B+': 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white',
      'B': 'bg-gradient-to-r from-orange-400 to-orange-500 text-white',
      'B-': 'bg-gradient-to-r from-red-400 to-red-500 text-white',
      'C+': 'bg-gradient-to-r from-purple-400 to-purple-500 text-white',
      'C': 'bg-gradient-to-r from-gray-400 to-gray-500 text-white',
      'D': 'bg-gradient-to-r from-red-500 to-red-600 text-white',
      'F': 'bg-gradient-to-r from-red-600 to-red-700 text-white'
    }
    return gradeColors[grade] || 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center">
        <Card variant="elevated" className="text-center max-w-md">
          <CardContent className="py-12">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center animate-pulse">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-indigo-200 border-t-transparent rounded-2xl animate-spin"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  Loading Academic Progress
                </h3>
                <p className="text-gray-600">Fetching your academic data...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { student = {}, academicSummary = {}, semesters = [] } = academicData

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Academic Progress
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Track your grades, CGPA, and academic performance with detailed semester breakdowns
          </p>
          <div className="flex justify-center items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</span>
            </div>
            <Button
              onClick={fetchAcademicData}
              variant="primary"
              size="lg"
              icon={<BarChart3 className="w-5 h-5" />}
            >
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card variant="elevated" className="border-l-4 border-red-500 animate-slideIn">
            <CardContent className="py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900">Error Loading Data</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slideIn">
          <StatsCard 
            title="Overall CGPA" 
            value={academicSummary.cgpa || "0.00"}
            subtitle="Current performance"
            color="indigo"
            icon={<Target className="w-6 h-6" />}
            trend="up"
            trendValue="+0.2"
          />
          
          <StatsCard 
            title="Average Percentage" 
            value={`${academicSummary.averagePercentage || 0}%`}
            subtitle="All subjects"
            color="blue"
            icon={<TrendingUp className="w-6 h-6" />}
            trend="up"
            trendValue="+3.5%"
          />
          
          <StatsCard 
            title="Total Credits" 
            value={academicSummary.totalCredits || 0}
            subtitle="Earned credits"
            color="green"
            icon={<BookOpen className="w-6 h-6" />}
          />
          
          <StatsCard 
            title="Success Rate" 
            value={`${academicSummary.totalSubjects ? Math.round((academicSummary.passedSubjects / academicSummary.totalSubjects) * 100) : 0}%`}
            subtitle={`${academicSummary.passedSubjects || 0}/${academicSummary.totalSubjects || 0} subjects`}
            color="orange"
            icon={<Award className="w-6 h-6" />}
            trend={academicSummary.passedSubjects === academicSummary.totalSubjects ? "up" : "down"}
            trendValue="100%"
          />
        </div>

        {/* No Data State */}
        {semesters.length === 0 && !loading && (
          <Card variant="elevated" className="text-center py-16 animate-fadeIn">
            <CardContent>
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-12 h-12 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">
                  No Academic Records Found
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Your marks and grades will appear here once faculty members add them to the system.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Contact your faculty if you believe this is an error.</p>
                  <Button variant="outline" size="sm">
                    Contact Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Semester-wise Data */}
        {semesters.length > 0 && (
          <div className="space-y-8">
            {semesters.map((semesterData, index) => (
              <Card key={index} variant="elevated" className="overflow-hidden animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {semesterData.semester}
                        </div>
                        <div>
                          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                            Semester {semesterData.semester}
                          </span>
                          <p className="text-sm text-gray-500 font-normal">{semesterData.academicYear}</p>
                        </div>
                      </CardTitle>
                    </div>
                    <div className="flex items-center space-x-8">
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">GPA</div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                          {semesterData.gpa || '0.00'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Credits</div>
                        <div className="text-xl font-semibold text-gray-900">{semesterData.totalCredits || 0}</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b-2 border-indigo-100">
                          <th className="text-left py-4 px-6 font-semibold text-indigo-700">Subject</th>
                          <th className="text-left py-4 px-6 font-semibold text-indigo-700">Code</th>
                          <th className="text-left py-4 px-6 font-semibold text-indigo-700">Credits</th>
                          <th className="text-left py-4 px-6 font-semibold text-indigo-700">Marks</th>
                          <th className="text-left py-4 px-6 font-semibold text-indigo-700">Percentage</th>
                          <th className="text-left py-4 px-6 font-semibold text-indigo-700">Grade</th>
                          <th className="text-left py-4 px-6 font-semibold text-indigo-700">Grade Point</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(semesterData.subjects || []).map((subject, subIndex) => (
                          <tr key={subIndex} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 transition-all duration-200">
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center">
                                  <BookOpen className="w-4 h-4 text-indigo-600" />
                                </div>
                                <div className="font-semibold text-gray-900">{subject.subject?.name || 'N/A'}</div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-gray-600 font-mono text-sm bg-gray-50 rounded-md px-2 py-1">
                                {subject.subject?.code || 'N/A'}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {subject.credits || 0} Credits
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="font-semibold text-lg">
                                <span className="text-indigo-600">{subject.marksObtained || 0}</span>
                                <span className="text-gray-400 text-sm">/{subject.maxMarks || 0}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-3">
                                <span className="font-bold text-lg text-gray-900">{subject.percentage || 0}%</span>
                                <div className="w-20 h-3 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 transition-all duration-700 rounded-full"
                                    style={{ width: `${Math.min(subject.percentage || 0, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-4 py-2 rounded-xl text-sm font-bold ${getGradeColor(subject.grade || 'N/A')}`}>
                                {subject.grade || 'N/A'}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span className="font-bold text-lg text-gray-900">{subject.gradePoint || 0}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CGPA Trend */}
        {semesters.length > 0 && (
          <Card variant="gradient" className="animate-fadeIn">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <span>Semester-wise GPA Trend</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {semesters.map((semester, index) => (
                  <div key={index} className="group">
                    <Card variant="bordered" className="hover:shadow-large transition-all duration-300 group-hover:scale-105">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                            {semester.semester}
                          </div>
                          <span className="font-medium text-gray-900">
                            Semester {semester.semester}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{semester.gpa || '0.00'}</div>
                          <div className="text-xs text-gray-500">GPA</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 space-y-1">
                        <div>{semester.academicYear || 'N/A'}</div>
                        <div className="flex items-center justify-between">
                          <span>{semester.totalCredits || 0} Credits</span>
                          <span className="text-blue-600 font-medium">{(semester.subjects || []).length} Subjects</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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

export default AcademicProgress
