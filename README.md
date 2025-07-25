# Agenda Test - Job Scheduler with React Frontend

A Node.js application using Agenda job scheduler with a modern React frontend dashboard for managing and monitoring scheduled jobs.

![Agenda Dashboard](https://github.com/user-attachments/assets/7fb0374b-1a26-43fb-9dcd-66ed8fdf1550)

## Features

- 🗓️ **Job Scheduling**: Create and manage recurring jobs with custom intervals
- 📊 **Real-time Dashboard**: Monitor job status, execution history, and server health
- 🎨 **Modern UI**: Responsive React interface with TypeScript
- 🔄 **Auto-refresh**: Live updates every 5 seconds
- 📋 **Job Management**: View, create, and delete scheduled jobs
- ⚡ **Quick Presets**: Pre-configured job templates for common tasks
- 🚀 **Production Ready**: Built-in production server with static file serving

## Quick Start

### Option 1: Demo Mode (No MongoDB required)
```bash
npm install
npm run build
npm run demo
```
Visit: http://localhost:3000

### Option 2: Full Mode (Requires MongoDB)
```bash
# Start MongoDB on port 27017
npm install
npm run build
npm start
```

### Development Mode
```bash
npm install
npm run dev
```
This runs the backend server and React dev server concurrently.

## Scripts

- `npm start` - Production server with MongoDB
- `npm run demo` - Demo server with mock data (no MongoDB needed)
- `npm run dev` - Development mode with hot reload
- `npm run build` - Build React app for production
- `npm run client` - Start React development server only
- `npm run server` - Start backend server only

## API Endpoints

- `GET /api/jobs` - List all jobs
- `POST /api/jobs` - Create new job
- `DELETE /api/jobs/:id` - Delete job
- `GET /api/status` - Server and Agenda status

## Project Structure

```
├── server.js          # Production server with Agenda + MongoDB
├── demo-server.js     # Demo server with mock data
├── index.js           # Original Agenda job runner
├── client/            # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── JobsList.tsx     # Job display component
│   │   │   ├── JobForm.tsx      # Job creation form
│   │   │   └── StatusPanel.tsx  # Server status display
│   │   └── App.tsx              # Main application
│   └── build/         # Production build output
└── package.json       # Dependencies and scripts
```

## Technologies Used

- **Backend**: Node.js, Express, Agenda, MongoDB
- **Frontend**: React, TypeScript, CSS Grid
- **Build**: Create React App, Concurrently
- **Job Scheduling**: Agenda.js with MongoDB persistence
