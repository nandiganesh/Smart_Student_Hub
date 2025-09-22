import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    studentId: '',
    department: '',
    semester: '',
    institution: '',
    agreeToTerms: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const { register, error, clearError } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    
    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms and Privacy Policy')
      return
    }

    setIsLoading(true)
    
    try {
      await register({
        fullName: formData.fullName,
        username: formData.email.split('@')[0], // Generate username from email
        email: formData.email,
        password: formData.password,
        role: formData.role,
        studentId: formData.studentId,
        department: formData.department,
        semester: formData.semester
      })
      navigate('/dashboard')
    } catch (error) {
      console.error('Registration failed:', error)
      // Error is now displayed via AuthContext error state
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Image and Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-100 p-8">
        <div className="flex flex-col justify-between w-full">
          {/* Header */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">Smart Student Hub</span>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
              <p className="text-gray-600">
                Join the unified platform for academics, activities, and verified portfolios in Jammu & Kashmir.
              </p>
            </div>

            {/* Image Placeholder */}
            <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-xl aspect-video overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Kashmir mountains and lake"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Benefits */}
            <div className="bg-orange-500 rounded-xl p-6 text-white">
              <h3 className="font-semibold mb-4">Why sign up?</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <span>Track activities and achievements</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <span>Build a verified digital portfolio</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <span>Access analytics and reports</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header for mobile */}
          <div className="lg:hidden flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">Smart Student Hub</span>
          </div>

          {/* Form Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Sign Up</h1>
            <div className="flex items-center justify-center mt-4 space-x-4">
              <span className="text-gray-500">Already have an account?</span>
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Log In
              </Link>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-1 bg-blue-600 rounded"></div>
            <div className="w-8 h-1 bg-gray-200 rounded"></div>
            <div className="w-8 h-1 bg-gray-200 rounded"></div>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <select 
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                >
                  <option value="">Institution</option>
                  <option value="University of Kashmir">University of Kashmir</option>
                  <option value="University of Jammu">University of Jammu</option>
                  <option value="NIT Srinagar">NIT Srinagar</option>
                </select>
              </div>
              <div>
                <select 
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="student">Role: Student</option>
                  <option value="faculty">Role: Faculty</option>
                  <option value="admin">Role: Admin</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder={formData.role === 'student' ? "Student ID / Reg. No." : "Employee ID"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={formData.role === 'student'}
                />
              </div>
              {formData.role === 'student' && (
                <div>
                  <select 
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="">Semester</option>
                    <option value="1">1st Semester</option>
                    <option value="2">2nd Semester</option>
                    <option value="3">3rd Semester</option>
                    <option value="4">4th Semester</option>
                    <option value="5">5th Semester</option>
                    <option value="6">6th Semester</option>
                    <option value="7">7th Semester</option>
                    <option value="8">8th Semester</option>
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <select 
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                >
                  <option value="">Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="IT">IT</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="English">English</option>
                  <option value="Business Administration">Business Administration</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                required
              />
              <label className="ml-2 text-sm text-gray-600">
                I agree to the Terms and Privacy Policy
              </label>
            </div>

            <div className="flex space-x-4">
              <Link to="/">
                <Button variant="outline" size="lg" className="flex-1" icon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
              </Link>
              <Button variant="orange" size="lg" className="flex-1" type="button">
                Save & Exit
              </Button>
              <Button 
                variant="primary" 
                size="lg" 
                className="flex-1" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Continue'}
              </Button>
            </div>
          </form>

          <div className="text-center text-sm text-gray-500">
            This is Step 1 of 3. Next: Verify email and institution. Final: Personalize dashboard.
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
