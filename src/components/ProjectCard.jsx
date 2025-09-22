import React from 'react'
import { ExternalLink, Calendar, User, CheckCircle, Clock, XCircle } from 'lucide-react'

const ProjectCard = ({ project, onEdit, onDelete, showActions = true }) => {
  const getStatusBadge = () => {
    if (project.verified) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </span>
      )
    } else if (project.rejectionReason) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      )
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
          {getStatusBadge()}
        </div>
        {showActions && (
          <div className="flex space-x-2 ml-4">
            <button
              onClick={() => onEdit(project)}
              className="text-gray-400 hover:text-orange-500 transition-colors"
              title="Edit Project"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(project._id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Delete Project"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Role and Duration */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center">
          <User className="w-4 h-4 mr-1" />
          <span className="font-medium">{project.role}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{project.duration}</span>
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {project.description}
        </p>
      )}

      {/* Rejection Reason */}
      {project.rejectionReason && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-700 text-sm">
            <strong>Rejection Reason:</strong> {project.rejectionReason}
          </p>
        </div>
      )}

      {/* Link */}
      {project.link && (
        <div className="flex justify-between items-center">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Project
          </a>
        </div>
      )}

      {/* Verification Info */}
      {project.verified && project.verifiedBy && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Verified by {project.verifiedBy.name} on {new Date(project.verifiedAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  )
}

export default ProjectCard
