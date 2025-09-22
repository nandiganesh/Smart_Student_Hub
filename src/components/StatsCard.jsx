import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  color = 'primary',
  icon,
  trend,
  trendValue,
  loading = false 
}) => {
  const colorClasses = {
    primary: 'bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600',
    secondary: 'bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700',
    orange: 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-500',
    blue: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
    green: 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500',
    purple: 'bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-500',
    pink: 'bg-gradient-to-br from-pink-400 via-rose-500 to-red-500',
    yellow: 'bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500',
    indigo: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
    teal: 'bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500'
  }

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />
    return <Minus className="w-4 h-4" />
  }

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-200'
    if (trend === 'down') return 'text-red-200'
    return 'text-gray-200'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-medium hover-lift animate-fadeIn">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-24 skeleton"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-lg skeleton"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-16 skeleton mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-32 skeleton"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-medium hover-lift animate-fadeIn">
      {/* Gradient Background */}
      <div className={`${colorClasses[color]} p-6 text-white relative`}>
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full translate-y-12 -translate-x-12"></div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium opacity-90">{title}</div>
            {icon && (
              <div className="p-2 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                {icon}
              </div>
            )}
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold mb-1 group-hover:scale-105 transition-transform duration-300">
                {value}
              </div>
              {subtitle && (
                <div className="text-sm opacity-90">{subtitle}</div>
              )}
            </div>
            
            {trend && trendValue && (
              <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="text-sm font-medium">{trendValue}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Hover Effect */}
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      </div>
    </div>
  )
}

export default StatsCard
