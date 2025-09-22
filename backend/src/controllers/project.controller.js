import Project from '../models/project.model.js'
import { User } from '../models/user.model.js'
import asyncHandler from 'express-async-handler'

// @desc    Add a new project/leadership role
// @route   POST /api/student/:id/projects
// @access  Private (Student, Faculty, Admin)
const addProject = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { title, description, role, duration, link } = req.body

  // Verify the student exists
  const student = await User.findById(id)
  if (!student) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    })
  }

  // Check if user can add projects for this student
  if (req.user.role === 'student' && req.user._id.toString() !== id) {
    return res.status(403).json({
      success: false,
      message: 'You can only add projects for yourself'
    })
  }

  // Validate required fields
  if (!title || !role || !duration) {
    return res.status(400).json({
      success: false,
      message: 'Title, role, and duration are required'
    })
  }

  const project = await Project.create({
    studentId: id,
    title,
    description,
    role,
    duration,
    link
  })

  await project.populate('studentId', 'name email studentId')

  res.status(201).json({
    success: true,
    message: 'Project added successfully',
    data: project
  })
})

// @desc    Get all projects for a student
// @route   GET /api/student/:id/projects
// @access  Private (Student, Faculty, Admin)
const getStudentProjects = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { verified } = req.query

  // Verify the student exists
  const student = await User.findById(id)
  if (!student) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    })
  }

  // Build query
  let query = { studentId: id }
  if (verified !== undefined) {
    query.verified = verified === 'true'
  }

  const projects = await Project.find(query)
    .populate('studentId', 'name email studentId')
    .populate('verifiedBy', 'name email')
    .sort({ createdAt: -1 })

  res.json({
    success: true,
    data: projects,
    count: projects.length
  })
})

// @desc    Get a single project by ID
// @route   GET /api/projects/:id
// @access  Private (Student, Faculty, Admin)
const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('studentId', 'name email studentId department')
    .populate('verifiedBy', 'name email')

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    })
  }

  res.json({
    success: true,
    data: project
  })
})

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Student owner, Faculty, Admin)
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    })
  }

  // Check permissions
  if (req.user.role === 'student' && project.studentId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'You can only update your own projects'
    })
  }

  const { title, description, role, duration, link } = req.body

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    {
      title: title || project.title,
      description: description || project.description,
      role: role || project.role,
      duration: duration || project.duration,
      link: link || project.link
    },
    { new: true, runValidators: true }
  ).populate('studentId', 'name email studentId')

  res.json({
    success: true,
    message: 'Project updated successfully',
    data: updatedProject
  })
})

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Student owner, Faculty, Admin)
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    })
  }

  // Check permissions
  if (req.user.role === 'student' && project.studentId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'You can only delete your own projects'
    })
  }

  await Project.findByIdAndDelete(req.params.id)

  res.json({
    success: true,
    message: 'Project deleted successfully'
  })
})

// @desc    Verify a project (Faculty/Admin only)
// @route   PUT /api/projects/:id/verify
// @access  Private (Faculty, Admin)
const verifyProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    })
  }

  if (req.user.role === 'student') {
    return res.status(403).json({
      success: false,
      message: 'Only faculty and admin can verify projects'
    })
  }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    {
      verified: true,
      verifiedBy: req.user._id,
      verifiedAt: new Date(),
      rejectionReason: undefined // Clear any previous rejection
    },
    { new: true }
  ).populate('studentId', 'name email studentId')
    .populate('verifiedBy', 'name email')

  res.json({
    success: true,
    message: 'Project verified successfully',
    data: updatedProject
  })
})

// @desc    Reject a project (Faculty/Admin only)
// @route   PUT /api/projects/:id/reject
// @access  Private (Faculty, Admin)
const rejectProject = asyncHandler(async (req, res) => {
  const { reason } = req.body
  const project = await Project.findById(req.params.id)

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    })
  }

  if (req.user.role === 'student') {
    return res.status(403).json({
      success: false,
      message: 'Only faculty and admin can reject projects'
    })
  }

  if (!reason) {
    return res.status(400).json({
      success: false,
      message: 'Rejection reason is required'
    })
  }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    {
      verified: false,
      rejectionReason: reason,
      verifiedBy: req.user._id,
      verifiedAt: new Date()
    },
    { new: true }
  ).populate('studentId', 'name email studentId')
    .populate('verifiedBy', 'name email')

  res.json({
    success: true,
    message: 'Project rejected',
    data: updatedProject
  })
})

// @desc    Get all projects for verification (Faculty/Admin)
// @route   GET /api/projects/verification
// @access  Private (Faculty, Admin)
const getProjectsForVerification = asyncHandler(async (req, res) => {
  if (req.user.role === 'student') {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    })
  }

  const { status, department, search } = req.query
  let query = {}

  // Filter by verification status
  if (status === 'pending') {
    query.verified = false
    query.rejectionReason = { $exists: false }
  } else if (status === 'verified') {
    query.verified = true
  } else if (status === 'rejected') {
    query.rejectionReason = { $exists: true }
  }

  const projects = await Project.find(query)
    .populate('studentId', 'name email studentId department')
    .populate('verifiedBy', 'name email')
    .sort({ createdAt: -1 })

  // Filter by department if specified
  let filteredProjects = projects
  if (department && department !== 'all') {
    filteredProjects = projects.filter(project => 
      project.studentId.department === department
    )
  }

  // Filter by search term if specified
  if (search) {
    const searchLower = search.toLowerCase()
    filteredProjects = filteredProjects.filter(project =>
      project.title.toLowerCase().includes(searchLower) ||
      project.studentId.name.toLowerCase().includes(searchLower) ||
      project.role.toLowerCase().includes(searchLower)
    )
  }

  res.json({
    success: true,
    data: filteredProjects,
    count: filteredProjects.length
  })
})

export {
  addProject,
  getStudentProjects,
  getProject,
  updateProject,
  deleteProject,
  verifyProject,
  rejectProject,
  getProjectsForVerification
}
