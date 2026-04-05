# E3Dash - Personal Health Dashboard

A personal dashboard web application for tracking medication intake and blood sugar levels. All features are publicly accessible without authentication requirements.

## Features

- **Medication Tracking**: Track medication intake, dosages, and schedules
- **Blood Sugar Monitoring**: Record and visualize blood sugar levels over time
- **Interactive Charts**: Visual trends and statistics for health data
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Tab-based Navigation**: Organized modules for easy access
- **Authentication**: Login system with protected routes
- **User Management**: Single user account with encrypted password

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose
- **Charts**: Recharts for data visualization
- **Authentication**: JWT tokens with bcrypt password hashing
- **Deployment**: Vercel serverless functions

## Project Structure

```
e3dash/
├── package.json          # Root package with dev/prod scripts
├── .env.local           # Environment variables (don't commit)
├── backend/             # Node.js/Express API
└── frontend/            # React/Vite application
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB running locally or connection string
- Git for version control

### Installation
1. Clone the repository
2. Install all dependencies:
   ```bash
   npm run install:all
   ```

3. Set up environment variables in `.env.development`:
   ```env
   # Backend
MONGODB_URI=mongodb://localhost:27017/e3dash
NODE_ENV=development
JWT_SECRET=your-jwt-secret-key

   # Frontend
VITE_API_URL=http://localhost:3001
   ```

4. Start development servers:
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Environment Variables

Copy `.env.development` and update with your values:

```env
# Backend
MONGODB_URI=mongodb://localhost:27017/e3dash
NODE_ENV=development
JWT_SECRET=your-jwt-secret-key

# Frontend
VITE_API_URL=http://localhost:3001
```

## Usage
The application is organized with:
- **Public Dashboard**: View overview and quick stats
- **Medication**: Add, edit, and delete medication records
- **Blood Sugar**: Track readings with charts and statistics
- **Authentication**: Login required for medication and blood sugar features

## Data Storage
All data is stored in MongoDB with a user authentication system:
- Users collection with encrypted passwords

## Deployment
Deploy to Vercel Production Environment:

```bash
npm run deploy
```

Set environment variables in Vercel dashboard:
- `MONGODB_URI`: Your MongoDB connection string
- `NODE_ENV`: Set to `production`
- `JWT_SECRET`: Generate secure random string protection
- Rate limiting and CORS protection are configured
