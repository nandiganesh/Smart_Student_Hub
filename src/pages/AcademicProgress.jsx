import React, { useState, useEffect } from 'react'
import { BookOpen, TrendingUp, Calendar, Award, BarChart3, GraduationCap, AlertCircle, RefreshCw } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const AcademicProgress = () => {
  const { user } = useAuth()
  const [academicData, setAcademicData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAcademicData()
  }, [])

  const fetchAcademicData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/student/marks', {
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
      'A+': 'text-green-600 bg-green-100',
      'A': 'text-green-600 bg-green-100',
      'A-': 'text-blue-600 bg-blue-100',
      'B+': 'text-yellow-600 bg-yellow-100',
      'B': 'text-orange-600 bg-orange-100',
      'B-': 'text-red-600 bg-red-100',
      'C+': 'text-purple-600 bg-purple-100',
      'C': 'text-gray-600 bg-gray-100',
      'D': 'text-red-600 bg-red-100',
      'F': 'text-red-800 bg-red-200'
    }
    return gradeColors[grade] || 'text-gray-600 bg-gray-100'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading academic progress...</p>
        </div>
      </div>
    )
  }

  const { student = {}, academicSummary = {}, semesters = [] } = academicData

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Progress</h1>
              <p className="text-gray-600">Track your grades, CGPA, and academic performance</p>
            </div>
            <button
              onClick={fetchAcademicData}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>Error loading data: {error}</span>
            </div>
          </div>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <GraduationCap className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Overall CGPA</p>
                <p className="text-2xl font-bold text-gray-900">{academicSummary.cgpa || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Average Percentage</p>
                <p className="text-2xl font-bold text-gray-900">{academicSummary.averagePercentage || 0}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Credits</p>
                <p className="text-2xl font-bold text-gray-900">{academicSummary.totalCredits || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Subjects Passed</p>
                <p className="text-2xl font-bold text-gray-900">{academicSummary.passedSubjects || 0}/{academicSummary.totalSubjects || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* No Data State */}
        {semesters.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Academic Records Found</h3>
            <p className="text-gray-600 mb-4">Your marks and grades will appear here once faculty members add them to the system.</p>
            <p className="text-sm text-gray-500">Contact your faculty if you believe this is an error.</p>
          </div>
        )}

        {/* Semester-wise Data */}
        {semesters.length > 0 && (
          <div className="space-y-8">
            {semesters.map((semesterData, index) => (
              <div key={index} className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Semester {semesterData.semester} - {semesterData.academicYear}
                    </h3>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">GPA: </span>
                        <span className="text-lg font-bold text-blue-600">{semesterData.gpa}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Credits: </span>
                        <span>{semesterData.totalCredits}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-4 font-medium text-gray-900">Subject</th>
                          <th className="text-left py-2 px-4 font-medium text-gray-900">Code</th>
                          <th className="text-left py-2 px-4 font-medium text-gray-900">Credits</th>
                          <th className="text-left py-2 px-4 font-medium text-gray-900">Marks</th>
                          <th className="text-left py-2 px-4 font-medium text-gray-900">Percentage</th>
                          <th className="text-left py-2 px-4 font-medium text-gray-900">Grade</th>
                          <th className="text-left py-2 px-4 font-medium text-gray-900">Grade Point</th>
                        </tr>
                      </thead>
                      <tbody>
                        {semesterData.subjects.map((subject, subIndex) => (
                          <tr key={subIndex} className="border-b border-gray-100">
                            <td className="py-3 px-4 text-gray-900">{subject.subject.name}</td>
                            <td className="py-3 px-4 text-gray-600">{subject.subject.code}</td>
                            <td className="py-3 px-4 text-gray-600">{subject.credits}</td>
                            <td className="py-3 px-4 text-gray-600">{subject.marksObtained}/{subject.maxMarks}</td>
                            <td className="py-3 px-4 text-gray-600">{subject.percentage}%</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(subject.grade)}`}>
                                {subject.grade}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600">{subject.gradePoint}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CGPA Trend */}
        {semesters.length > 0 && (
          <div className="bg-white rounded-lg shadow mt-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Semester-wise GPA Trend</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {semesters.map((semester, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        Semester {semester.semester}
                      </span>
                      <span className="text-lg font-bold text-gray-900">{semester.gpa}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {semester.academicYear} • {semester.totalCredits} Credits
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AcademicProgress
