# E3Dash - Personal Health Dashboard

**Live Site**: [https://e3dash.vercel.app](https://e3dash.vercel.app)

A personal dashboard web application for tracking medication intake and blood sugar levels. All features are publicly accessible without authentication requirements.

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
├── package.json         # Root package with dev/prod scripts
├── .env.development     # Environment variables (don't commit)
├── backend/             # Node.js/Express API
└── frontend/            # React/Vite application
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB running locally or MongoDB Atlasconnection string

### Installation
1. Clone the repository
2. Install all dependencies:
   ```bash
   npm run install:all
   ```

3. Set up environment variables in `.env.development`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/<dbname>
   NODE_ENV=development
   JWT_SECRET=your-jwt-secret-key
   VITE_API_URL=http://localhost:3001
   ```

4. Start development servers:
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

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