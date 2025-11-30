# Patel Caterers Backend

This is the MongoDB-powered backend for the Patel Caterers menu generation system.

## Quick Start

```bash
npm install
npm start
```

The server will run on **http://localhost:3001** (configured in `.env` file).

## Key Features

- **MongoDB Integration**: Full database with Mongoose ODM
- **Authentication**: JWT-based admin authentication
- **Menu Management**: Dynamic menu items with categories
- **Event Management**: Complete event creation and editing
- **PDF Generation**: Automated quotations and invoices
- **Admin Panel**: User management and system administration

## API Endpoints

- **Auth**: `http://localhost:3001/api/auth`
- **Admin**: `http://localhost:3001/api/admin`
- **Events**: `http://localhost:3001/api/events`
- **Menu Items**: `http://localhost:3001/api/menu-items`
- **Contacts**: `http://localhost:3001/api/contacts`
- **Health Check**: `http://localhost:3001/api/health`

## Environment Variables

Create a `.env` file:

```
MONGODB_URI=mongodb://127.0.0.1:27017/patel-caterers
PORT=3001
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## Database Migration

If migrating from JSON to MongoDB, run:

```bash
npm run migrate
```
