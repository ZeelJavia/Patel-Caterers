# MongoDB Migration Guide for Patel Caterers

## Overview

This guide will help you migrate from JSON file storage to MongoDB database for better data management, scalability, and persistence.

## Prerequisites

### 1. Install MongoDB

Download and install MongoDB Community Server from: https://www.mongodb.com/try/download/community

**Windows Installation:**

1. Download the .msi installer
2. Run installer and follow the setup wizard
3. Make sure to install MongoDB as a Service
4. MongoDB will be available at `mongodb://localhost:27017`

**Alternative: MongoDB Atlas (Cloud)**

1. Create free account at https://www.mongodb.com/atlas
2. Create a free cluster
3. Get connection string and update `.env` file

## Migration Steps

### Step 1: Environment Setup

The `.env` file has been created with default MongoDB settings:

```
MONGODB_URI=mongodb://localhost:27017/patel-caterers
PORT=3001
NODE_ENV=development
```

### Step 2: Start MongoDB Service

**Windows:**

- MongoDB should start automatically as a service
- If not, run: `net start MongoDB`

**Check if MongoDB is running:**

- Open command prompt and run: `mongosh`
- If connected, you'll see MongoDB shell

### Step 3: Run Migration

```bash
cd backend
npm run migrate
```

This will:

- Connect to MongoDB
- Create database and collections
- Import existing data from `db.json`
- Import menu items from `data.js`

### Step 4: Start Server with MongoDB

```bash
# Start with MongoDB integration
npm run start:mongodb

# Or for development
npm run dev:mongodb
```

## What's New with MongoDB

### 1. Improved Data Structure

- **Events**: Full event management with sub-events, notes, status tracking
- **Contact Forms**: Store and manage contact form submissions
- **Users**: User management system for future authentication
- **Menu Items**: Structured menu item database with categories, pricing, etc.

### 2. New API Endpoints

```
GET    /api/events          - Get all events
POST   /api/events          - Create new event
GET    /api/events/:id      - Get single event
PUT    /api/events/:id      - Update event
DELETE /api/events/:id      - Delete event

GET    /api/contacts        - Get all contact submissions
POST   /api/contacts        - Create new contact submission
PUT    /api/contacts/:id    - Update contact status/response
DELETE /api/contacts/:id    - Delete contact submission

GET    /api/menu-data       - Get menu data (existing endpoint)
GET    /api/health          - Health check
```

### 3. Enhanced Features

- **Data Validation**: MongoDB schemas ensure data integrity
- **Automatic Calculations**: Total amounts calculated automatically
- **Timestamps**: Automatic creation and update timestamps
- **Status Tracking**: Event and contact status management
- **Better Relationships**: Properly structured sub-events and items

## Frontend Integration

### Update Frontend API Calls

The frontend will need minor updates to work with new API endpoints:

**Before (JSON file):**

```javascript
fetch("http://localhost:3001/api/events");
```

**After (MongoDB):**

```javascript
fetch("http://localhost:3001/api/events");
```

### Contact Form Integration

The contact form can now store submissions in database:

```javascript
// In Contact.jsx
const response = await fetch("http://localhost:3001/api/contacts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData),
});
```

## Benefits of MongoDB Migration

1. **Persistence**: Data survives server restarts
2. **Scalability**: Can handle large amounts of data
3. **Relationships**: Proper data relationships between events, items, etc.
4. **Indexing**: Fast data retrieval with database indexing
5. **Validation**: Built-in data validation and constraints
6. **Backup**: Easy database backup and restore
7. **Analytics**: Better data analysis capabilities
8. **Multi-user**: Support for multiple concurrent users

## Rollback Plan

If you need to rollback to JSON file system:

1. Restore the original `server.js` file from version control
2. Your original `db.json` file is preserved
3. Update package.json scripts to use the JSON-based server

## Monitoring and Maintenance

### Check Database Status

```bash
mongosh
use patel-caterers
db.stats()
db.events.count()
db.contacts.count()
```

### Backup Database

```bash
mongodump --db patel-caterers --out ./backup
```

### Restore Database

```bash
mongorestore --db patel-caterers ./backup/patel-caterers
```

## Troubleshooting

### MongoDB Not Starting

1. Check if MongoDB service is running: `net start MongoDB`
2. Check MongoDB logs in: `C:\Program Files\MongoDB\Server\7.0\log\`
3. Try connecting manually: `mongosh mongodb://localhost:27017`

### Migration Issues

1. Ensure MongoDB is running before migration
2. Check `.env` file has correct MongoDB URI
3. Verify `db.json` exists and has valid JSON format

### Port Conflicts

- Default MongoDB port: 27017
- New server port: 3001 (configurable in `.env`)
- Make sure these ports are available

## Next Steps

After successful migration:

1. Update frontend API calls to use new endpoints
2. Test all functionality (CRUD operations, PDF generation)
3. Implement contact form database integration
4. Consider adding user authentication system
5. Set up regular database backups
