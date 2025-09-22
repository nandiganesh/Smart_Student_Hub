// API service layer for connecting to backend
// Use root base so we can call both /api and /api/v1 namespaces
let RAW_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
// Normalize base URL (remove trailing slash)
if (RAW_BASE.endsWith('/')) RAW_BASE = RAW_BASE.slice(0, -1)
const API_BASE_URL = RAW_BASE

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    // Normalize endpoint and avoid double /api or /api/v1 when base already contains it
    let ep = endpoint
    // Ensure endpoint begins with a single leading slash
    if (!ep.startsWith('/')) ep = `/${ep}`
    // If endpoint explicitly targets '/api/...', compose with base ORIGIN only to avoid double namespaces
    // e.g., base 'http://localhost:8000/api/v1' + ep '/api/faculty/...' should become 'http://localhost:8000/api/faculty/...'
    let baseToUse = this.baseURL
    if (ep.startsWith('/api/')) {
      try {
        const u = new URL(this.baseURL)
        baseToUse = `${u.protocol}//${u.host}`
      } catch (_) {
        // fallback to original baseURL if URL parsing fails
        baseToUse = this.baseURL
      }
    }
    // If base includes /api/v1 and endpoint starts with /api/v1, strip the endpoint prefix
    if (baseToUse.endsWith('/api/v1') && ep.startsWith('/api/v1')) {
      ep = ep.replace(/^\/api\/v1/, '') || '/'
    } else if (baseToUse.endsWith('/api') && ep.startsWith('/api')) {
      // If base includes /api and endpoint starts with /api, strip one
      ep = ep.replace(/^\/api/, '') || '/'
    }
    const url = `${baseToUse}${ep}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for authentication
      ...options,
    }

    // If body is a plain object, JSON-encode it. Leave strings (e.g., FormData) untouched.
    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        let errorMessage = errorData.message || `HTTP error! status: ${response.status}`
        
        // Handle specific error codes
        if (response.status === 409) {
          errorMessage = 'User already exists with this email address'
        } else if (response.status === 401) {
          // Generic auth error; specific messaging can be handled at call site
          errorMessage = errorData.message || 'Unauthorized request'
        } else if (response.status === 400) {
          errorMessage = errorData.message || 'Please check your input and try again'
        }
        
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      // Only log errors that aren't auth-related 401s
      if (error.message && !error.message.includes('401') && !endpoint.includes('/users/me')) {
        console.error('API request failed:', error.message)
      }
      throw error
    }
  }

  // Generic GET method
  async get(endpoint) {
    return this.request(endpoint, {
      method: 'GET',
    })
  }

  // Authentication methods
  async login(credentials) {
    return this.request('/api/v1/users/login', {
      method: 'POST',
      body: credentials,
    })
  }

  async register(userData) {
    return this.request('/api/v1/users/register', {
      method: 'POST',
      body: userData,
    })
  }

  async logout() {
    return this.request('/api/v1/users/logout', {
      method: 'POST',
    })
  }

  // Task/Activity methods
  async getTasks() {
    return this.request('/api/v1/tasks')
  }

  async getTaskById(id) {
    return this.request(`/api/v1/tasks/${id}`)
  }

  async createTask(taskData) {
    return this.request('/api/v1/tasks', {
      method: 'POST',
      body: taskData,
    })
  }

  async updateTask(id, taskData) {
    return this.request(`/api/v1/tasks/${id}`, {
      method: 'PUT',
      body: taskData,
    })
  }

  async deleteTask(id) {
    return this.request(`/api/v1/tasks/${id}`, {
      method: 'DELETE',
    })
  }

  // Faculty endpoints
  async getFacultyCertificates(filters = {}) {
    const params = new URLSearchParams(filters).toString()
    return this.request(`/api/faculty/certificates?${params}`)
  }

  async getFacultyStudents(filters = {}) {
    const params = new URLSearchParams(filters).toString()
    return this.request(`/api/faculty/students?${params}`)
  }

  async getFacultySubjects(filters = {}) {
    const params = new URLSearchParams(filters).toString()
    return this.request(`/api/faculty/subjects${params ? `?${params}` : ''}`)
  }

  // Faculty marks endpoints
  async getFacultyMarks(filters = {}) {
    const params = new URLSearchParams(filters).toString()
    return this.request(`/api/faculty/marks${params ? `?${params}` : ''}`)
  }

  async addOrUpdateMarks(markData) {
    return this.request('/api/faculty/marks', {
      method: 'POST',
      body: markData,
    })
  }

  async verifyCertificate(certificateId, data) {
    return this.request(`/api/faculty/certificates/${certificateId}/verify`, {
      method: 'PUT',
      body: data
    })
  }

  async rejectCertificate(certificateId, data) {
    return this.request(`/api/faculty/certificates/${certificateId}/reject`, {
      method: 'PUT',
      body: data
    })
  }

  // Admin endpoints
  async getAdminDashboard(timeRange = '30d') {
    return this.request(`/api/admin/dashboard?timeRange=${timeRange}`)
  }

  async getAllUsers(filters = {}) {
    const params = new URLSearchParams(filters).toString()
    return this.request(`/api/admin/users?${params}`)
  }

  async createUser(userData) {
    return this.request('/api/admin/users', {
      method: 'POST',
      body: userData
    })
  }

  async updateUser(userId, userData) {
    return this.request(`/api/admin/users/${userId}`, {
      method: 'PUT',
      body: userData
    })
  }

  async deleteUser(userId) {
    return this.request(`/api/admin/users/${userId}`, {
      method: 'DELETE'
    })
  }

  async toggleUserStatus(userId) {
    return this.request(`/api/admin/users/${userId}/toggle-status`, {
      method: 'PUT'
    })
  }

  async getApprovalOversight(filters = {}) {
    const params = new URLSearchParams(filters).toString()
    return this.request(`/api/admin/approvals?${params}`)
  }

  async overrideApproval(approvalId, action, reason) {
    return this.request(`/api/admin/approvals/${approvalId}/override`, {
      method: 'PUT',
      body: { action, reason }
    })
  }

  async getInstitutionalReports(type, filters = {}) {
    const params = new URLSearchParams(filters).toString()
    return this.request(`/api/admin/reports/${type}?${params}`)
  }

  async generateReport(type, format, filters = {}) {
    return this.request('/api/admin/reports/generate', {
      method: 'POST',
      body: { type, format, filters }
    })
  }

  async getSystemSettings() {
    return this.request('/api/admin/settings')
  }

  async updateSystemSettings(settings) {
    return this.request('/api/admin/settings', {
      method: 'PUT',
      body: settings
    })
  }

  // Student endpoints
  async getMyMarks(filters = {}) {
    const params = new URLSearchParams(filters).toString()
    return this.request(`/api/student/marks${params ? `?${params}` : ''}`)
  }
}

export default new ApiService()
