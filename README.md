# E3Dash - Personal Health Dashboard

A personal dashboard web application for tracking medication intake and blood sugar levels. All features are publicly accessible without authentication requirements.

## Features

- **Medication Tracking**: Track medication intake, dosages, and schedules
- **Blood Sugar Monitoring**: Record and visualize blood sugar levels over time
- **Interactive Charts**: Visual trends and statistics for health data
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Tab-based Navigation**: Organized modules for easy access
- **No Authentication**: Public access to all features

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose
- **Charts**: Recharts for data visualization
- **Deployment**: Vercel

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

### Installation

1. Clone the repository
2. Install all dependencies:
   ```bash
   npm run install:all
   ```

3. Set up environment variables in `.env.local`:
   - Set your MongoDB connection string

4. Start development servers:
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Environment Variables

Copy `.env.local` and update with your values:

```env
# Backend
MONGODB_URI=mongodb://localhost:27017/e3dash
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:3001
```

## Usage

The application is completely public - no login required! Simply:

1. **Dashboard**: View overview and quick stats
2. **Medication**: Add, edit, and delete medication records
3. **Blood Sugar**: Track readings with charts and statistics

## Data Storage

All data is stored in MongoDB with a simple user identifier system. Since there's no authentication, all records use a `'demo-user'` identifier for data organization.

## Deployment

Deploy to Vercel:

```bash
npm run deploy
```

Set environment variables in your Vercel dashboard:
- `MONGODB_URI`: Your MongoDB connection string
- `NODE_ENV`: Set to `production`

## Security

- No authentication means no user data protection
- In production, consider adding authentication if storing sensitive health data
- MongoDB connection should be secured with proper credentials
- Rate limiting and CORS protection are configured

## Future Enhancements

- User authentication system (if needed)
- Data export functionality
- Advanced analytics and insights
- Multi-user support
- Integration with health devices
- Offline mode support
