import React, { useState, useEffect } from 'react'
import { Plus, Search, Edit, Save, X, BookOpen, Users, GraduationCap, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const MarksManagement = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('subjects')
  const [subjects, setSubjects] = useState([])
  const [students, setStudents] = useState([])
  const [marks, setMarks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Subject form state
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    credits: 3,
    semester: 1,
    department: ''
  })

  // Marks form state
  const [marksForm, setMarksForm] = useState({
    studentId: '',
    subjectId: '',
    marksObtained: '',
    maxMarks: 100,
    examType: 'final',
    semester: 1,
    academicYear: '2024-2025',
    remarks: ''
  })

  const [filters, setFilters] = useState({
    department: '',
    semester: '',
    academicYear: '2024-2025'
  })

  useEffect(() => {
    fetchSubjects()
    fetchStudents()
    fetchMarks()
  }, [])

  const fetchSubjects = async () => {
    try {
      const response = await fetch('/api/faculty/subjects', {
        credentials: 'include'
      })
      const result = await response.json()
      if (result.success) {
        setSubjects(result.data)
      }
    } catch (err) {
      console.error('Error fetching subjects:', err)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/faculty/students', {
        credentials: 'include'
      })
      const result = await response.json()
      if (result.success) {
        setStudents(result.data)
      }
    } catch (err) {
      console.error('Error fetching students:', err)
    }
  }

  const fetchMarks = async () => {
    try {
      const response = await fetch('/api/faculty/marks', {
        credentials: 'include'
      })
      const result = await response.json()
      if (result.success) {
        setMarks(result.data)
      }
    } catch (err) {
      console.error('Error fetching marks:', err)
    }
  }

  const handleSubjectSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/faculty/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(subjectForm)
      })

      const result = await response.json()

      if (result.success) {
        setSuccess('Subject created successfully!')
        setSubjectForm({
          name: '',
          code: '',
          credits: 3,
          semester: 1,
          department: ''
        })
        fetchSubjects()
      } else {
        setError(result.message || 'Failed to create subject')
      }
    } catch (err) {
      setError('Error creating subject: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMarksSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/faculty/marks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(marksForm)
      })

      const result = await response.json()

      if (result.success) {
        setSuccess('Marks added successfully!')
        setMarksForm({
          studentId: '',
          subjectId: '',
          marksObtained: '',
          maxMarks: 100,
          examType: 'final',
          semester: 1,
          academicYear: '2024-2025',
          remarks: ''
        })
        fetchMarks()
      } else {
        setError(result.message || 'Failed to add marks')
      }
    } catch (err) {
      setError('Error adding marks: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marks Management</h1>
          <p className="text-gray-600">Manage subjects and assign marks to students</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>{success}</span>
              </div>
              <button onClick={clearMessages} className="text-green-500 hover:text-green-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>{error}</span>
              </div>
              <button onClick={clearMessages} className="text-red-500 hover:text-red-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('subjects')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'subjects'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <BookOpen className="w-5 h-5 inline mr-2" />
                Manage Subjects
              </button>
              <button
                onClick={() => setActiveTab('marks')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'marks'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <GraduationCap className="w-5 h-5 inline mr-2" />
                Assign Marks
              </button>
              <button
                onClick={() => setActiveTab('view')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'view'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users className="w-5 h-5 inline mr-2" />
                View Records
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Subjects Tab */}
            {activeTab === 'subjects' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Add Subject Form */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Subject</h3>
                    <form onSubmit={handleSubjectSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject Name
                        </label>
                        <input
                          type="text"
                          required
                          value={subjectForm.name}
                          onChange={(e) => setSubjectForm({...subjectForm, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Data Structures"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject Code
                        </label>
                        <input
                          type="text"
                          required
                          value={subjectForm.code}
                          onChange={(e) => setSubjectForm({...subjectForm, code: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., CS201"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Credits
                          </label>
                          <select
                            value={subjectForm.credits}
                            onChange={(e) => setSubjectForm({...subjectForm, credits: parseInt(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {[1,2,3,4,5,6].map(credit => (
                              <option key={credit} value={credit}>{credit}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Semester
                          </label>
                          <select
                            value={subjectForm.semester}
                            onChange={(e) => setSubjectForm({...subjectForm, semester: parseInt(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            {[1,2,3,4,5,6,7,8].map(sem => (
                              <option key={sem} value={sem}>{sem}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Department
                        </label>
                        <input
                          type="text"
                          required
                          value={subjectForm.department}
                          onChange={(e) => setSubjectForm({...subjectForm, department: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Computer Science"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        ) : (
                          <Plus className="w-5 h-5 mr-2" />
                        )}
                        Add Subject
                      </button>
                    </form>
                  </div>

                  {/* Subjects List */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Subjects</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {subjects.map((subject) => (
                        <div key={subject._id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{subject.name}</h4>
                              <p className="text-sm text-gray-600">{subject.code}</p>
                              <p className="text-xs text-gray-500">
                                {subject.credits} Credits • Semester {subject.semester} • {subject.department}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Marks Tab */}
            {activeTab === 'marks' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Assign Marks to Student</h3>
                <form onSubmit={handleMarksSubmit} className="max-w-2xl space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Student
                      </label>
                      <select
                        required
                        value={marksForm.studentId}
                        onChange={(e) => setMarksForm({...marksForm, studentId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Student</option>
                        {students.map((student) => (
                          <option key={student._id} value={student._id}>
                            {student.fullName} ({student.studentId})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <select
                        required
                        value={marksForm.subjectId}
                        onChange={(e) => setMarksForm({...marksForm, subjectId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Subject</option>
                        {subjects.map((subject) => (
                          <option key={subject._id} value={subject._id}>
                            {subject.name} ({subject.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Marks Obtained
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        max={marksForm.maxMarks}
                        value={marksForm.marksObtained}
                        onChange={(e) => setMarksForm({...marksForm, marksObtained: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Marks
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={marksForm.maxMarks}
                        onChange={(e) => setMarksForm({...marksForm, maxMarks: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Exam Type
                      </label>
                      <select
                        value={marksForm.examType}
                        onChange={(e) => setMarksForm({...marksForm, examType: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="final">Final Exam</option>
                        <option value="midterm">Midterm</option>
                        <option value="assignment">Assignment</option>
                        <option value="quiz">Quiz</option>
                        <option value="project">Project</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Semester
                      </label>
                      <select
                        value={marksForm.semester}
                        onChange={(e) => setMarksForm({...marksForm, semester: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {[1,2,3,4,5,6,7,8].map(sem => (
                          <option key={sem} value={sem}>{sem}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Academic Year
                      </label>
                      <input
                        type="text"
                        required
                        value={marksForm.academicYear}
                        onChange={(e) => setMarksForm({...marksForm, academicYear: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="2024-2025"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Remarks (Optional)
                    </label>
                    <textarea
                      value={marksForm.remarks}
                      onChange={(e) => setMarksForm({...marksForm, remarks: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      placeholder="Additional comments..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <Save className="w-5 h-5 mr-2" />
                    )}
                    Assign Marks
                  </button>
                </form>
              </div>
            )}

            {/* View Records Tab */}
            {activeTab === 'view' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Student Records</h3>
                
                {/* Filters */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <input
                        type="text"
                        value={filters.department}
                        onChange={(e) => setFilters({...filters, department: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Filter by department"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Semester
                      </label>
                      <select
                        value={filters.semester}
                        onChange={(e) => setFilters({...filters, semester: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">All Semesters</option>
                        {[1,2,3,4,5,6,7,8].map(sem => (
                          <option key={sem} value={sem}>{sem}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Academic Year
                      </label>
                      <input
                        type="text"
                        value={filters.academicYear}
                        onChange={(e) => setFilters({...filters, academicYear: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="2024-2025"
                      />
                    </div>
                  </div>
                </div>

                {/* Records Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subject
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Marks
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Semester
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Year
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {marks.map((mark) => (
                        <tr key={mark._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {mark.studentId?.fullName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {mark.studentId?.studentId}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {mark.subjectId?.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {mark.subjectId?.code}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {mark.marksObtained}/{mark.maxMarks} ({((mark.marksObtained/mark.maxMarks)*100).toFixed(1)}%)
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              mark.grade === 'A+' || mark.grade === 'A' ? 'bg-green-100 text-green-800' :
                              mark.grade === 'B+' || mark.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                              mark.grade === 'C+' || mark.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {mark.grade} ({mark.gradePoint})
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {mark.semester}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {mark.academicYear}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarksManagement
