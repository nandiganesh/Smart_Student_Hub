import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();


// CORS: allow Vite dev servers on localhost and 127.0.0.1 (any port) in development
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g., curl, same-origin)
      if (!origin) return callback(null, true);
      try {
        const { hostname } = new URL(origin);
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          return callback(null, true);
        }
      } catch (e) {
        // If origin is not a valid URL, deny
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);


app.use(cookieParser());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('public/uploads'));


import userRoutes from './routes/user.route.js';
app.use('/api/v1/users', userRoutes);  // e.g., /register, /login, /logout
import taskRoutes from './routes/task.route.js';
app.use('/api/v1/tasks', taskRoutes);
import certificateRoutes from './routes/certificate.route.js';
app.use('/api/v1/certificates', certificateRoutes);
import facultyRoutes from './routes/faculty.route.js';
app.use('/api/faculty', facultyRoutes);
import studentRoutes from './routes/student.route.js';
app.use('/api/student', studentRoutes);
import portfolioRoutes from './routes/portfolio.route.js';
app.use('/api/portfolio', portfolioRoutes);
import studentDashboardRoutes from './routes/studentDashboard.route.js';
app.use('/api/dashboard', studentDashboardRoutes);
import projectRoutes from './routes/project.routes.js';
app.use('/api', projectRoutes);
import notificationsRoutes from './routes/notifications.route.js';
app.use('/api/v1/notifications', notificationsRoutes);

// Global error handler to ensure consistent JSON error responses
// This captures errors thrown from async handlers and middleware like verifyJWT
// and prevents Express from sending default HTML error pages with status 500.
app.use((err, req, res, next) => {
  // If headers are already sent, delegate to default Express handler
  if (res.headersSent) return next(err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  // Optionally log stack in development
  // console.error(err);

  res.status(statusCode).json({
    success: false,
    message,
    // Include error details only in development to avoid leaking sensitive info
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export { app };
