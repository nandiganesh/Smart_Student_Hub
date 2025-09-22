# Smart Student Hub - API Documentation

## Overview
This document provides detailed information about all API endpoints, request/response formats, authentication requirements, and error handling for the Smart Student Hub backend API.

## Base URL
```
Development: http://localhost:8000/api
Production: https://your-domain.com/api
```

## Authentication
All protected endpoints require JWT authentication via HTTP-only cookies.

### Authentication Headers
```javascript
// Cookies are automatically sent by browser
// No manual headers required for authentication
```

## Response Format
All API responses follow a consistent format:

### Success Response
```javascript
{
  "statusCode": 200,
  "data": {}, // Response data
  "message": "Success message",
  "success": true
}
```

### Error Response
```javascript
{
  "statusCode": 400,
  "data": null,
  "message": "Error message",
  "success": false,
  "errors": [] // Validation errors (if any)
}
```

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```javascript
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "student", // "student" | "faculty" | "admin"
  "department": "Computer Science",
  "semester": 6,
  "studentId": "STU2021001"
}
```

**Response:**
```javascript
{
  "statusCode": 201,
  "data": {
    "user": {
      "_id": "user_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "department": "Computer Science",
      "semester": 6,
      "studentId": "STU2021001"
    }
  },
  "message": "User registered successfully"
}
```

### Login User
```http
POST /api/auth/login
```

**Request Body:**
```javascript
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```javascript
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "user_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "department": "Computer Science"
    }
  },
  "message": "Login successful"
}
```

### Logout User
```http
POST /api/auth/logout
```

**Response:**
```javascript
{
  "statusCode": 200,
  "data": {},
  "message": "Logout successful"
}
```

### Get Current User
```http
GET /api/auth/me
```

**Response:**
```javascript
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "user_id",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "department": "Computer Science"
    }
  },
  "message": "User retrieved successfully"
}
```

## Student Dashboard Endpoints

### Get Student Dashboard
```http
GET /api/dashboard/:id/dashboard
```

**Parameters:**
- `id` (string): User ID

**Response:**
```javascript
{
  "statusCode": 200,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "department": "Computer Science",
      "semester": 6
    },
    "student": {
      "rollNo": "STU2021001",
      "batch": "2021-2025",
      "photoUrl": "profile_image_url",
      "bio": "Student bio"
    },
    "stats": {
      "totalActivities": 15,
      "verifiedActivities": 12,
      "credits": 24,
      "pending": 3,
      "totalPoints": 180
    },
    "activities": [
      {
        "id": "activity_id",
        "title": "Web Development Workshop",
        "category": "Workshop",
        "organizer": "Tech Club",
        "date": "2024-01-15",
        "status": "Verified",
        "points": 15
      }
    ],
    "academicProgress": [
      {
        "semester": 1,
        "cgpa": 8.2,
        "attendance": 92,
        "academicYear": "2021-22"
      }
    ]
  },
  "message": "Dashboard data retrieved successfully"
}
```

### Upload Achievement
```http
POST /api/dashboard/:id/upload
```

**Parameters:**
- `id` (string): User ID

**Request Body:**
```javascript
{
  "title": "Python Programming Certificate",
  "category": "MOOC",
  "organizer": "Coursera",
  "description": "Completed Python for Everybody specialization",
  "date": "2024-01-20",
  "semester": 6,
  "academicYear": "2023-24",
  "credits": 2
}
```

**Response:**
```javascript
{
  "statusCode": 201,
  "data": {
    "_id": "achievement_id",
    "title": "Python Programming Certificate",
    "category": "MOOC",
    "organizer": "Coursera",
    "status": "Pending",
    "studentId": "user_id"
  },
  "message": "Achievement uploaded successfully"
}
```

### Update Student Profile
```http
PUT /api/dashboard/:id/profile
```

**Parameters:**
- `id` (string): User ID

**Request Body:**
```javascript
{
  "bio": "Computer Science student passionate about web development",
  "skills": ["JavaScript", "React", "Node.js", "Python"],
  "interests": ["Web Development", "Machine Learning", "Open Source"],
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe",
    "portfolio": "https://johndoe.dev"
  },
  "photoUrl": "https://example.com/profile.jpg"
}
```

**Response:**
```javascript
{
  "statusCode": 200,
  "data": {
    "student": {
      "_id": "student_id",
      "bio": "Computer Science student passionate about web development",
      "skills": ["JavaScript", "React", "Node.js", "Python"],
      "interests": ["Web Development", "Machine Learning", "Open Source"]
    }
  },
  "message": "Profile updated successfully"
}
```

## Certificate Management Endpoints

### Get Certificates
```http
GET /api/certificates
```

**Query Parameters:**
- `status` (string): Filter by status ("Pending", "Verified", "Rejected")
- `category` (string): Filter by category
- `department` (string): Filter by department
- `page` (number): Page number for pagination
- `limit` (number): Items per page

**Response:**
```javascript
{
  "statusCode": 200,
  "data": {
    "certificates": [
      {
        "_id": "cert_id",
        "title": "Web Development Certificate",
        "category": "Workshop",
        "description": "Certificate description",
        "imageUrl": "certificate_image_url",
        "status": "Pending",
        "userId": "user_id",
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "message": "Certificates retrieved successfully"
}
```

### Upload Certificate
```http
POST /api/certificates
```

**Content-Type:** `multipart/form-data`

**Form Data:**
- `title` (string): Certificate title
- `category` (string): Certificate category
- `description` (string): Certificate description
- `image` (file): Certificate image file

**Response:**
```javascript
{
  "statusCode": 201,
  "data": {
    "certificate": {
      "_id": "cert_id",
      "title": "Web Development Certificate",
      "category": "Workshop",
      "description": "Certificate description",
      "imageUrl": "uploaded_image_url",
      "status": "Pending",
      "userId": "user_id"
    }
  },
  "message": "Certificate uploaded successfully"
}
```

### Verify Certificate
```http
PUT /api/certificates/:id/verify
```

**Parameters:**
- `id` (string): Certificate ID

**Request Body:**
```javascript
{
  "points": 15,
  "remarks": "Excellent certificate from reputable organization"
}
```

**Response:**
```javascript
{
  "statusCode": 200,
  "data": {
    "certificate": {
      "_id": "cert_id",
      "status": "Verified",
      "points": 15,
      "verifiedBy": "faculty_id",
      "verificationDate": "2024-01-20T15:30:00Z",
      "remarks": "Excellent certificate from reputable organization"
    }
  },
  "message": "Certificate verified successfully"
}
```

### Reject Certificate
```http
PUT /api/certificates/:id/reject
```

**Parameters:**
- `id` (string): Certificate ID

**Request Body:**
```javascript
{
  "rejectionReason": "Certificate image is not clear enough for verification"
}
```

**Response:**
```javascript
{
  "statusCode": 200,
  "data": {
    "certificate": {
      "_id": "cert_id",
      "status": "Rejected",
      "rejectionReason": "Certificate image is not clear enough for verification",
      "verifiedBy": "faculty_id",
      "verificationDate": "2024-01-20T15:30:00Z"
    }
  },
  "message": "Certificate rejected successfully"
}
```

## Faculty Endpoints

### Get Pending Certificates
```http
GET /api/faculty/certificates
```

**Query Parameters:**
- `status` (string): Filter by status
- `category` (string): Filter by category
- `department` (string): Filter by department
- `search` (string): Search in title/description
- `page` (number): Page number
- `limit` (number): Items per page

**Response:**
```javascript
{
  "statusCode": 200,
  "data": {
    "certificates": [
      {
        "_id": "cert_id",
        "title": "Certificate Title",
        "category": "Workshop",
        "student": {
          "name": "John Doe",
          "rollNo": "STU2021001",
          "department": "Computer Science"
        },
        "status": "Pending",
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ],
    "stats": {
      "pending": 25,
      "verified": 150,
      "rejected": 5,
      "averageProcessingTime": "2.5 days"
    }
  },
  "message": "Certificates retrieved successfully"
}
```

### Get Faculty Students
```http
GET /api/faculty/students
```

**Query Parameters:**
- `department` (string): Filter by department
- `semester` (number): Filter by semester
- `search` (string): Search by name/roll number

**Response:**
```javascript
{
  "statusCode": 200,
  "data": {
    "students": [
      {
        "_id": "student_id",
        "name": "John Doe",
        "rollNo": "STU2021001",
        "department": "Computer Science",
        "semester": 6,
        "stats": {
          "totalActivities": 15,
          "verifiedActivities": 12,
          "totalPoints": 180
        }
      }
    ]
  },
  "message": "Students retrieved successfully"
}
```

### Get Faculty Analytics
```http
GET /api/faculty/analytics
```

**Query Parameters:**
- `startDate` (string): Start date for analytics
- `endDate` (string): End date for analytics
- `department` (string): Filter by department

**Response:**
```javascript
{
  "statusCode": 200,
  "data": {
    "overview": {
      "totalVerifications": 150,
      "pendingApprovals": 25,
      "averageProcessingTime": "2.5 days",
      "verificationRate": 85.7
    },
    "categoryDistribution": [
      { "category": "MOOC", "count": 45, "percentage": 30 },
      { "category": "Workshop", "count": 38, "percentage": 25.3 }
    ],
    "monthlyTrends": [
      { "month": "Jan", "verified": 25, "rejected": 3 },
      { "month": "Feb", "verified": 30, "rejected": 2 }
    ],
    "topPerformers": [
      {
        "studentName": "John Doe",
        "rollNo": "STU2021001",
        "totalPoints": 180,
        "verifiedActivities": 12
      }
    ]
  },
  "message": "Analytics retrieved successfully"
}
```

## Student Endpoints

### Get Student Achievements
```http
GET /api/student/achievements
```

**Response:**
```javascript
{
  "statusCode": 200,
  "data": {
    "achievements": [
      {
        "_id": "achievement_id",
        "title": "Web Development Workshop",
        "category": "Workshop",
        "organizer": "Tech Club",
        "date": "2024-01-15",
        "points": 15,
        "credits": 2,
        "status": "Verified",
        "verificationDate": "2024-01-20"
      }
    ],
    "summary": {
      "totalVerified": 12,
      "totalPoints": 180,
      "totalCredits": 24,
      "categoryCounts": {
        "MOOC": 5,
        "Workshop": 4,
        "Sports": 2,
        "Volunteering": 1
      }
    }
  },
  "message": "Achievements retrieved successfully"
}
```

### Get Certificate Status Summary
```http
GET /api/student/certificates/status
```

**Response:**
```javascript
{
  "statusCode": 200,
  "data": {
    "summary": {
      "total": 15,
      "verified": 12,
      "pending": 3,
      "rejected": 0
    },
    "recentActivity": [
      {
        "title": "Python Certificate",
        "status": "Verified",
        "date": "2024-01-20",
        "points": 15
      }
    ]
  },
  "message": "Status summary retrieved successfully"
}
```

## Project Management Endpoints

### Get Projects
```http
GET /api/projects
```

**Query Parameters:**
- `status` (string): Filter by status
- `studentId` (string): Filter by student
- `page` (number): Page number
- `limit` (number): Items per page

**Response:**
```javascript
{
  "statusCode": 200,
  "data": {
    "projects": [
      {
        "_id": "project_id",
        "title": "E-commerce Website",
        "description": "Full-stack e-commerce application",
        "technologies": ["React", "Node.js", "MongoDB"],
        "githubUrl": "https://github.com/user/project",
        "liveUrl": "https://project-demo.com",
        "status": "Approved",
        "studentId": "user_id"
      }
    ]
  },
  "message": "Projects retrieved successfully"
}
```

### Create Project
```http
POST /api/projects
```

**Request Body:**
```javascript
{
  "title": "E-commerce Website",
  "description": "Full-stack e-commerce application built with MERN stack",
  "technologies": ["React", "Node.js", "MongoDB", "Express"],
  "githubUrl": "https://github.com/user/ecommerce-project",
  "liveUrl": "https://my-ecommerce-demo.com"
}
```

**Response:**
```javascript
{
  "statusCode": 201,
  "data": {
    "project": {
      "_id": "project_id",
      "title": "E-commerce Website",
      "description": "Full-stack e-commerce application built with MERN stack",
      "technologies": ["React", "Node.js", "MongoDB", "Express"],
      "status": "Draft",
      "studentId": "user_id"
    }
  },
  "message": "Project created successfully"
}
```

### Update Project
```http
PUT /api/projects/:id
```

**Parameters:**
- `id` (string): Project ID

**Request Body:**
```javascript
{
  "title": "Updated E-commerce Website",
  "description": "Updated description",
  "technologies": ["React", "Node.js", "MongoDB", "Express", "Redux"],
  "githubUrl": "https://github.com/user/updated-ecommerce",
  "liveUrl": "https://updated-demo.com"
}
```

### Verify Project
```http
PUT /api/projects/:id/verify
```

**Parameters:**
- `id` (string): Project ID

**Request Body:**
```javascript
{
  "status": "Approved", // "Approved" | "Rejected"
  "feedback": "Excellent project with good implementation"
}
```

## Portfolio Generation

### Download Portfolio
```http
GET /api/portfolio/:userId/download
```

**Parameters:**
- `userId` (string): User ID

**Response:**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="portfolio.pdf"`

## Task Management

### Get Tasks
```http
GET /api/tasks
```

**Response:**
```javascript
{
  "statusCode": 200,
  "data": {
    "tasks": [
      {
        "_id": "task_id",
        "title": "Complete project documentation",
        "description": "Write comprehensive documentation for the project",
        "completed": false,
        "userId": "user_id",
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ]
  },
  "message": "Tasks retrieved successfully"
}
```

### Create Task
```http
POST /api/tasks
```

**Request Body:**
```javascript
{
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the project"
}
```

### Update Task
```http
PUT /api/tasks/:id
```

**Parameters:**
- `id` (string): Task ID

**Request Body:**
```javascript
{
  "title": "Updated task title",
  "description": "Updated description",
  "completed": true
}
```

### Delete Task
```http
DELETE /api/tasks/:id
```

**Parameters:**
- `id` (string): Task ID

## Error Codes

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `500` - Internal Server Error

### Common Error Messages
```javascript
// Authentication Errors
{
  "statusCode": 401,
  "message": "Access token is required",
  "success": false
}

{
  "statusCode": 401,
  "message": "Invalid or expired token",
  "success": false
}

// Validation Errors
{
  "statusCode": 400,
  "message": "Validation failed",
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}

// Authorization Errors
{
  "statusCode": 403,
  "message": "Access denied. Insufficient permissions",
  "success": false
}

// Not Found Errors
{
  "statusCode": 404,
  "message": "Resource not found",
  "success": false
}
```

## Rate Limiting
API endpoints are rate-limited to prevent abuse:
- Authentication endpoints: 5 requests per minute
- File upload endpoints: 10 requests per minute
- General endpoints: 100 requests per minute

## File Upload Guidelines
- Maximum file size: 5MB
- Supported formats: JPG, JPEG, PNG, PDF
- Files are stored securely with unique identifiers
- Image files are automatically optimized

## Pagination
List endpoints support pagination with the following parameters:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)

Response includes pagination metadata:
```javascript
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "hasNext": true,
    "hasPrev": false,
    "limit": 10
  }
}
```

## Filtering and Searching
Many endpoints support filtering and searching:
- Use query parameters for filtering
- Text search is case-insensitive
- Date filters accept ISO 8601 format
- Multiple filters can be combined

Example:
```
GET /api/certificates?status=Pending&category=MOOC&search=python&startDate=2024-01-01
```

This API documentation covers all the major endpoints and functionality of the Smart Student Hub backend system.
