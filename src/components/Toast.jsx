import React, { useEffect, useState } from 'react'
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react'

const Toast = ({ 
  message, 
  type = 'info', 
  duration = 4000, 
  onClose,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsAnimating(false)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 300)
  }

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          bgColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
          borderColor: 'border-green-400'
        }
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          bgColor: 'bg-gradient-to-r from-red-500 to-pink-500',
          borderColor: 'border-red-400'
        }
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          bgColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          borderColor: 'border-yellow-400'
        }
      default:
        return {
          icon: <Info className="w-5 h-5" />,
          bgColor: 'bg-gradient-to-r from-blue-500 to-purple-500',
          borderColor: 'border-blue-400'
        }
    }
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4'
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2'
      case 'top-right':
        return 'top-4 right-4'
      case 'bottom-left':
        return 'bottom-4 left-4'
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2'
      case 'bottom-right':
        return 'bottom-4 right-4'
      default:
        return 'top-4 right-4'
    }
  }

  if (!isVisible) return null

  const config = getToastConfig()

  return (
    <div className={`
      fixed z-50 ${getPositionClasses()}
      transform transition-all duration-300 ease-in-out
      ${isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}
    `}>
      <div className={`
        ${config.bgColor} text-white rounded-xl shadow-large p-4 pr-12 
        border ${config.borderColor} backdrop-blur-sm
        max-w-sm min-w-[300px] relative overflow-hidden
      `}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-white opacity-10">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-20 rounded-full -translate-y-10 translate-x-10"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {config.icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium leading-relaxed">{message}</p>
          </div>
        </div>
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        
        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-30 w-full">
          <div 
            className="h-full bg-white bg-opacity-70 transition-all ease-linear"
            style={{ 
              width: '100%',
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>
      </div>
      
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}

// Toast Container Component
export const ToastContainer = ({ toasts = [] }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {toasts.map((toast, index) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            {...toast}
            style={{ 
              transform: `translateY(${index * 80}px)` 
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default Toast
