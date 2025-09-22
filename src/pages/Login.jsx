import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, GraduationCap, Users, Shield, Check, Sparkles, Lock, AlertCircle } from 'lucide-react'
import Button from '../components/Button'
import Card from '../components/Card'
import Toast from '../components/Toast'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [searchParams] = useSearchParams()
  const loginType = searchParams.get('type') || 'student'
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const { login, error, clearError } = useAuth()
  const navigate = useNavigate()

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }

  const getLoginConfig = () => {
    switch (loginType) {
      case 'faculty':
        return {
          title: 'Faculty Login',
          subtitle: 'Access faculty management dashboard',
          icon: <Users className="w-8 h-8 text-white" />,
          bgGradient: 'from-emerald-500 via-teal-500 to-cyan-600',
          accentColor: 'emerald',
          cardGradient: 'from-emerald-50 to-teal-50',
          buttonGradient: 'from-emerald-500 to-teal-600'
        }
      case 'admin':
        return {
          title: 'Admin Login',
          subtitle: 'Access administrative controls',
          icon: <Shield className="w-8 h-8 text-white" />,
          bgGradient: 'from-orange-500 via-red-500 to-pink-600',
          accentColor: 'orange',
          cardGradient: 'from-orange-50 to-red-50',
          buttonGradient: 'from-orange-500 to-red-600'
        }
      default:
        return {
          title: 'Student Login',
          subtitle: 'Access your academic dashboard',
          icon: <GraduationCap className="w-8 h-8 text-white" />,
          bgGradient: 'from-blue-500 via-indigo-500 to-purple-600',
          accentColor: 'blue',
          cardGradient: 'from-blue-50 to-purple-50',
          buttonGradient: 'from-blue-500 to-purple-600'
        }
    }
  }

  const config = getLoginConfig()

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
    setIsLoading(true)
    
    try {
      const response = await login(formData)
      
      // Redirect based on user role
      if (response.success) {
        // Role-based redirection
        if (response.data.user.role === 'faculty') {
          navigate('/faculty-dashboard')
        } else if (response.data.user.role === 'admin') {
          navigate('/admin-dashboard')
        } else {
          navigate('/dashboard')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.cardGradient || 'from-blue-50 via-white to-purple-50'} flex`}>
      {/* Left Side - Image and Info */}
      <div className={`hidden lg:flex lg:w-1/2 bg-gradient-to-br ${config.cardGradient || 'from-blue-50 to-purple-100'} p-8 relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute top-10 left-10 w-20 h-20 rounded-full animate-pulse ${
            config.accentColor === 'emerald' ? 'bg-emerald-500' :
            config.accentColor === 'orange' ? 'bg-orange-500' :
            'bg-blue-500'
          }`}></div>
          <div className={`absolute top-40 right-20 w-16 h-16 rounded-full animate-pulse ${
            config.accentColor === 'emerald' ? 'bg-teal-500' :
            config.accentColor === 'orange' ? 'bg-red-500' :
            'bg-purple-500'
          }`} style={{animationDelay: '1s'}}></div>
          <div className={`absolute bottom-20 left-20 w-12 h-12 rounded-full animate-pulse ${
            config.accentColor === 'emerald' ? 'bg-cyan-400' :
            config.accentColor === 'orange' ? 'bg-pink-400' :
            'bg-blue-400'
          }`} style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="flex flex-col justify-between w-full relative z-10">
          {/* Header */}
          <div className="flex items-center space-x-3 animate-fadeIn">
            <div className={`w-10 h-10 bg-gradient-to-br ${config.bgGradient} rounded-xl flex items-center justify-center shadow-lg`}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold bg-gradient-to-r ${
              config.accentColor === 'emerald' ? 'from-emerald-600 to-teal-600' :
              config.accentColor === 'orange' ? 'from-orange-600 to-red-600' :
              'from-blue-600 to-purple-600'
            } bg-clip-text text-transparent`}>Smart Student Hub</span>
          </div>

          {/* Main Content */}
          <div className="space-y-8 animate-slideIn">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">Welcome back to your digital future</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Sign in to access your unified platform for academics, activities, and verified portfolios in Jammu & Kashmir.
              </p>
            </div>

            {/* Image Placeholder */}
            <Card variant="elevated" className="overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="bg-gradient-to-br from-blue-400 via-purple-500 to-blue-600 aspect-video overflow-hidden relative">
                <img 
                  src="/src/assets/kashmir-lake.jpg"
                  alt="Kashmir mountains and lake"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-white"><div class="text-center"><Sparkles class="w-16 h-16 mx-auto mb-4" /><p class="text-lg font-medium">Beautiful Kashmir Landscape</p></div></div>'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </Card>

            {/* Benefits */}
            <Card variant="gradient" className="text-white animate-fadeIn">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center space-x-3">
                  <Lock className="w-6 h-6" />
                  <span>Secure Access Portal</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Check className="w-6 h-6 flex-shrink-0" />
                    <span className="text-lg">View your activity progress & analytics</span>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Check className="w-6 h-6 flex-shrink-0" />
                    <span className="text-lg">Manage your digital portfolio</span>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Check className="w-6 h-6 flex-shrink-0" />
                    <span className="text-lg">Track verification status in real-time</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header for mobile */}
          <div className="lg:hidden flex items-center space-x-3 mb-8 animate-fadeIn">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Smart Student Hub</span>
          </div>

          {/* Form Header */}
          <div className="text-center animate-fadeIn">
            <div className={`w-20 h-20 bg-gradient-to-br ${config.bgGradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse-subtle`}>
              {config.icon}
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">{config.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{config.subtitle}</p>
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <span>Don't have an account?</span>
              <Link to="/signup" className={`font-semibold hover:underline transition-colors ${
                config.accentColor === 'emerald' ? 'text-emerald-600 hover:text-emerald-700' :
                config.accentColor === 'orange' ? 'text-orange-600 hover:text-orange-700' :
                'text-blue-600 hover:text-blue-700'
              }`}>
                Sign Up
              </Link>
            </div>
            <Link to="/login-choice" className="text-sm text-gray-500 hover:text-gray-700 mt-4 inline-flex items-center space-x-1 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Change login type</span>
            </Link>
          </div>

          {/* Form */}
          <Card variant="elevated" className="animate-slideIn">
            <div className="p-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email or student ID"
                    className={`w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white ${
                      config.accentColor === 'emerald' ? 'focus:ring-emerald-500 focus:border-emerald-500' :
                      config.accentColor === 'orange' ? 'focus:ring-orange-500 focus:border-orange-500' :
                      'focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className={`w-full px-4 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white ${
                        config.accentColor === 'emerald' ? 'focus:ring-emerald-500 focus:border-emerald-500' :
                        config.accentColor === 'orange' ? 'focus:ring-orange-500 focus:border-orange-500' :
                        'focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className={`w-5 h-5 rounded border-2 border-gray-300 ${
                        config.accentColor === 'emerald' ? 'text-emerald-600 focus:ring-emerald-500' :
                        config.accentColor === 'orange' ? 'text-orange-600 focus:ring-orange-500' :
                        'text-blue-600 focus:ring-blue-500'
                      }`}
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Remember me for 30 days
                    </label>
                  </div>
                  <Link to="/forgot-password" className={`text-sm font-medium hover:underline transition-colors ${
                    config.accentColor === 'emerald' ? 'text-emerald-600 hover:text-emerald-700' :
                    config.accentColor === 'orange' ? 'text-orange-600 hover:text-orange-700' :
                    'text-blue-600 hover:text-blue-700'
                  }`}>
                    Forgot password?
                  </Link>
                </div>

                <div className="space-y-4 pt-2">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    className={`w-full bg-gradient-to-r ${config.buttonGradient || config.bgGradient} hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200`}
                    disabled={isLoading}
                    loading={isLoading}
                  >
                    {isLoading ? 'Signing you in...' : 'Sign In Securely'}
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500 font-medium">or continue with</span>
                    </div>
                  </div>

                  <Button variant="outline" size="lg" className="w-full">
                    <Shield className="w-5 h-5 mr-2" />
                    Institution SSO Login
                  </Button>
                </div>
              </form>
            </div>
          </Card>

          <div className="text-center animate-fadeIn">
            <Link to="/" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to home</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default Login
