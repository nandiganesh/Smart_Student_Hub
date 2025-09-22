import express from 'express'
import {
  addProject,
  getStudentProjects,
  getProject,
  updateProject,
  deleteProject,
  verifyProject,
  rejectProject,
  getProjectsForVerification
} from '../controllers/project.controller.js'
import { verifyJWT as protect } from '../middlewares/auth.middleware.js'

const router = express.Router()

// Student project routes
router.post('/student/:id/projects', protect, addProject)
router.get('/student/:id/projects', protect, getStudentProjects)

// Project CRUD routes
router.get('/projects/verification', protect, getProjectsForVerification)
router.get('/projects/:id', protect, getProject)
router.put('/projects/:id', protect, updateProject)
router.delete('/projects/:id', protect, deleteProject)

// Project verification routes (Faculty/Admin only)
router.put('/projects/:id/verify', protect, verifyProject)
router.put('/projects/:id/reject', protect, rejectProject)

export default router
