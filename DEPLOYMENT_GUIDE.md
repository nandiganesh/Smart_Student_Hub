# Smart Student Hub - Deployment Guide

## Overview
This guide provides comprehensive instructions for deploying the Smart Student Hub application in various environments, from development to production.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Local Development Deployment](#local-development-deployment)
4. [Production Deployment](#production-deployment)
5. [Docker Deployment](#docker-deployment)
6. [Cloud Deployment](#cloud-deployment)
7. [Database Setup](#database-setup)
8. [SSL/HTTPS Configuration](#sslhttps-configuration)
9. [Monitoring and Logging](#monitoring-and-logging)
10. [Backup and Recovery](#backup-and-recovery)
11. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements
- **Node.js**: Version 16.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **MongoDB**: Version 5.0 or higher
- **Git**: Latest version
- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)

### Hardware Requirements

#### Development Environment
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 10GB free space
- **CPU**: Dual-core processor minimum

#### Production Environment
- **RAM**: 16GB minimum, 32GB recommended
- **Storage**: 100GB free space (SSD recommended)
- **CPU**: Quad-core processor minimum
- **Network**: Stable internet connection with adequate bandwidth

---

## Environment Setup

### Environment Variables

#### Frontend (.env)
```env
# Vite Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Smart Student Hub
VITE_APP_VERSION=1.0.0

# Development
VITE_NODE_ENV=development
```

#### Backend (.env)
```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/smart-student-hub
DB_NAME=smart-student-hub

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Cloud Storage (Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Security
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs/app.log
```

### Production Environment Variables
```env
# Production Backend (.env.production)
NODE_ENV=production
PORT=8000

# Database (Use MongoDB Atlas or dedicated server)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-student-hub

# JWT (Use strong, unique keys)
JWT_SECRET=your-production-jwt-secret-256-bit-key
JWT_REFRESH_SECRET=your-production-refresh-secret-256-bit-key

# CORS (Your production domain)
CORS_ORIGIN=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# SSL/Security
SECURE_COOKIES=true
TRUST_PROXY=true

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

---

## Local Development Deployment

### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/smart-student-hub.git
cd smart-student-hub
```

### Step 2: Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 3: Setup Environment Files
```bash
# Create frontend environment file
cp .env.example .env

# Create backend environment file
cd backend
cp .env.example .env
cd ..
```

### Step 4: Setup Database
```bash
# Start MongoDB (if local installation)
mongod

# Or use MongoDB Docker container
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Step 5: Start Development Servers
```bash
# Terminal 1 - Start backend server
cd backend
npm run dev

# Terminal 2 - Start frontend server
npm run dev
```

### Step 6: Verify Installation
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Health: http://localhost:8000/api/health

---

## Production Deployment

### Option 1: Traditional Server Deployment

#### Step 1: Server Preparation
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install nginx -y

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

#### Step 2: Deploy Application
```bash
# Clone repository
git clone https://github.com/your-username/smart-student-hub.git
cd smart-student-hub

# Install dependencies
npm install
cd backend && npm install && cd ..

# Build frontend
npm run build

# Setup environment variables
cp .env.production .env
cd backend && cp .env.production .env && cd ..
```

#### Step 3: Configure PM2
```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'smart-student-hub-backend',
      script: './backend/src/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 8000
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      time: true
    }
  ]
};
EOF

# Start application with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Step 4: Configure Nginx
```bash
# Create Nginx configuration
sudo cat > /etc/nginx/sites-available/smart-student-hub << EOF
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend static files
    location / {
        root /path/to/smart-student-hub/dist;
        try_files \$uri \$uri/ /index.html;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Static file caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/smart-student-hub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 2: Docker Deployment

#### Step 1: Create Dockerfiles

**Frontend Dockerfile:**
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Backend Dockerfile:**
```dockerfile
# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy source code
COPY backend/ .

# Create uploads directory
RUN mkdir -p uploads logs

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 8000

CMD ["node", "src/index.js"]
```

#### Step 2: Create Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/smart-student-hub
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
    depends_on:
      - mongodb
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    networks:
      - app-network

  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_ROOT_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_ROOT_PASSWORD}
      - MONGO_INITDB_DATABASE=smart-student-hub
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    networks:
      - app-network

volumes:
  mongodb_data:

networks:
  app-network:
    driver: bridge
```

#### Step 3: Deploy with Docker
```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Scale backend service
docker-compose up -d --scale backend=3
```

---

## Cloud Deployment

### AWS Deployment

#### Using AWS EC2
```bash
# Launch EC2 instance (Ubuntu 20.04 LTS)
# Configure security groups (ports 22, 80, 443, 8000)

# Connect to instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Follow traditional server deployment steps
```

#### Using AWS ECS (Elastic Container Service)
```yaml
# ecs-task-definition.json
{
  "family": "smart-student-hub",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "your-account.dkr.ecr.region.amazonaws.com/smart-student-hub-backend:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/smart-student-hub",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Digital Ocean Deployment

#### Using Digital Ocean App Platform
```yaml
# .do/app.yaml
name: smart-student-hub
services:
- name: backend
  source_dir: backend
  github:
    repo: your-username/smart-student-hub
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  env:
  - key: NODE_ENV
    value: production
  - key: MONGODB_URI
    value: ${DATABASE_URL}
  - key: JWT_SECRET
    value: ${JWT_SECRET}

- name: frontend
  source_dir: /
  github:
    repo: your-username/smart-student-hub
    branch: main
  build_command: npm run build
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs

databases:
- name: mongodb
  engine: MONGODB
  version: "5"
```

### Heroku Deployment

#### Backend Deployment
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create smart-student-hub-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set MONGODB_URI=your-mongodb-uri

# Deploy
git subtree push --prefix backend heroku main
```

#### Frontend Deployment (Netlify)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

---

## Database Setup

### MongoDB Atlas (Cloud)
```bash
# 1. Create MongoDB Atlas account
# 2. Create cluster
# 3. Create database user
# 4. Whitelist IP addresses
# 5. Get connection string

# Connection string format:
# mongodb+srv://username:password@cluster.mongodb.net/smart-student-hub
```

### Local MongoDB Setup
```bash
# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Create database and user
mongo
use smart-student-hub
db.createUser({
  user: "appuser",
  pwd: "securepassword",
  roles: [
    { role: "readWrite", db: "smart-student-hub" }
  ]
})
```

### Database Initialization Script
```javascript
// mongo-init.js
db = db.getSiblingDB('smart-student-hub');

// Create collections
db.createCollection('users');
db.createCollection('students');
db.createCollection('achievements');
db.createCollection('certificates');
db.createCollection('projects');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.students.createIndex({ userId: 1 }, { unique: true });
db.students.createIndex({ rollNo: 1 }, { unique: true });
db.achievements.createIndex({ studentId: 1 });
db.certificates.createIndex({ userId: 1 });
db.projects.createIndex({ studentId: 1 });

// Insert sample admin user
db.users.insertOne({
  fullName: "System Administrator",
  email: "admin@smartstudenthub.com",
  password: "$2b$12$hashedpassword", // Replace with actual hashed password
  role: "admin",
  department: "Administration",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});
```

---

## SSL/HTTPS Configuration

### Using Let's Encrypt (Certbot)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal setup
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Manual SSL Configuration
```nginx
# /etc/nginx/sites-available/smart-student-hub-ssl
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Application configuration
    location / {
        root /path/to/smart-student-hub/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Monitoring and Logging

### Application Monitoring
```javascript
// backend/src/middleware/monitoring.js
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

export default logger;
```

### Health Check Endpoint
```javascript
// backend/src/routes/health.js
import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/health', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    database: 'disconnected',
    memory: process.memoryUsage(),
    cpu: process.cpuUsage()
  };

  try {
    if (mongoose.connection.readyState === 1) {
      health.database = 'connected';
    }
    res.status(200).json(health);
  } catch (error) {
    health.message = error.message;
    res.status(503).json(health);
  }
});

export default router;
```

### PM2 Monitoring
```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart application
pm2 restart all

# Reload application (zero downtime)
pm2 reload all
```

---

## Backup and Recovery

### Database Backup Script
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongodb"
DB_NAME="smart-student-hub"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
mongodump --db $DB_NAME --out $BACKUP_DIR/backup_$DATE

# Compress backup
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz -C $BACKUP_DIR backup_$DATE

# Remove uncompressed backup
rm -rf $BACKUP_DIR/backup_$DATE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: backup_$DATE.tar.gz"
```

### Automated Backup with Cron
```bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /path/to/backup.sh

# Weekly backup on Sunday at 3 AM
0 3 * * 0 /path/to/weekly-backup.sh
```

### Recovery Script
```bash
#!/bin/bash
# restore.sh

BACKUP_FILE=$1
DB_NAME="smart-student-hub"

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file.tar.gz>"
    exit 1
fi

# Extract backup
tar -xzf $BACKUP_FILE

# Restore database
mongorestore --db $DB_NAME --drop backup_*/smart-student-hub/

echo "Database restored from $BACKUP_FILE"
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: Application won't start
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Issue: Database connection failed
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Test connection
mongo --eval "db.adminCommand('ismaster')"
```

#### Issue: Port already in use
```bash
# Find process using port
lsof -i :8000

# Kill process
kill -9 <PID>

# Or use different port
PORT=8001 npm start
```

#### Issue: Permission denied
```bash
# Fix file permissions
sudo chown -R $USER:$USER /path/to/project

# Fix directory permissions
chmod -R 755 /path/to/project
```

#### Issue: SSL certificate errors
```bash
# Check certificate validity
openssl x509 -in certificate.crt -text -noout

# Test SSL configuration
openssl s_client -connect yourdomain.com:443

# Renew Let's Encrypt certificate
sudo certbot renew
```

### Performance Optimization

#### Backend Optimization
```javascript
// Enable compression
import compression from 'compression';
app.use(compression());

// Enable caching
import helmet from 'helmet';
app.use(helmet());

// Database connection pooling
mongoose.connect(MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

#### Frontend Optimization
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

### Monitoring Commands
```bash
# System monitoring
htop
iostat
df -h
free -m

# Application monitoring
pm2 monit
pm2 logs --lines 100

# Database monitoring
mongo --eval "db.stats()"
mongo --eval "db.serverStatus()"

# Network monitoring
netstat -tulpn
ss -tulpn
```

This deployment guide provides comprehensive instructions for deploying the Smart Student Hub application in various environments, from development to production, with proper security, monitoring, and backup procedures.
