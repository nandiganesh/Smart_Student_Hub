import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">Smart Student Hub</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900 flex items-center space-x-1">
                <span>About</span>
              </button>
              <Link to="/login">
                <Button variant="orange" size="md">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="md">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                Empowering Students,<br />
                Enabling Institutions.
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                A unified smart hub for academics, activities, and verified portfolios across 
                Jammu & Kashmir.
              </p>
            </div>

            <div className="flex space-x-4">
              <Link to="/signup">
                <Button variant="primary" size="lg" className="px-8">
                  Get Started
                </Button>
              </Link>
              <Link to="/login-choice">
                <Button variant="outline" size="lg">
                  Log In
                </Button>
              </Link>
              <Button variant="ghost" size="lg">
                Learn More
              </Button>
            </div>

            <div className="flex space-x-4">
              <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                Secure & Verified
              </span>
              <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                Student-friendly
              </span>
              <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                Institution-ready
              </span>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-4">
              <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Kashmir Lake with mountains"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Landing
