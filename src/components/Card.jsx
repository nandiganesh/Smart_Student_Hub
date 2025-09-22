import React from 'react'

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'md',
  hover = true,
  loading = false,
  onClick,
  ...props 
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-300 animate-fadeIn'
  
  const variants = {
    default: 'bg-white shadow-soft border border-gray-100',
    elevated: 'bg-white shadow-medium',
    glass: 'glass border border-white/20',
    gradient: 'bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-medium',
    bordered: 'bg-white border-2 border-gray-200 shadow-soft',
    flat: 'bg-gray-50 border border-gray-200'
  }
  
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }
  
  const hoverClasses = hover ? 'hover-lift cursor-pointer' : ''
  const clickableClasses = onClick ? 'cursor-pointer' : ''

  if (loading) {
    return (
      <div className={`${baseClasses} ${variants.default} ${paddings[padding]} ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded skeleton w-3/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded skeleton"></div>
            <div className="h-3 bg-gray-200 rounded skeleton w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`
        ${baseClasses} 
        ${variants[variant]} 
        ${paddings[padding]} 
        ${hoverClasses} 
        ${clickableClasses} 
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

// Card Header Component
export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-6 ${className}`}>
    {children}
  </div>
)

// Card Title Component
export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${className}`}>
    {children}
  </h3>
)

// Card Description Component
export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-gray-600 ${className}`}>
    {children}
  </p>
)

// Card Content Component
export const CardContent = ({ children, className = '' }) => (
  <div className={`${className}`}>
    {children}
  </div>
)

// Card Footer Component
export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-6 pt-4 border-t border-gray-100 ${className}`}>
    {children}
  </div>
)

export default Card
