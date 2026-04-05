import { useState, useEffect } from 'react';
import MedicationTracker from './components/Medication/MedicationTracker';
import BloodSugarTracker from './components/BloodSugar/BloodSugarTracker';
import { useDashboardStats } from './hooks/useDashboardStats';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import './App.css';

function AppContent() {
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('activeTab');
    return savedTab || 'dashboard';
  });

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const { medicationsToday, todaysMedications, latestBloodSugar, loading, error } = useDashboardStats();
  const { isAuthenticated, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'medication', name: 'Medication', protected: true },
    { id: 'bloodSugar', name: 'Blood Sugar', protected: true },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Health Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card">
                <h2 className="text-lg font-semibold mb-2">Medications Today</h2>
                {loading ? (
                  <p className="text-gray-500">Loading...</p>
                ) : error ? (
                  <p className="text-red-600 text-sm">Error loading data</p>
                ) : medicationsToday > 0 ? (
                  <div>
                    <p className="text-3xl font-bold text-primary-600 mb-3">{medicationsToday}</p>
                    <ul className="space-y-1">
                      {todaysMedications.map((med) => (
                        <li key={med._id} className="text-sm text-gray-700">
                          {med.name} - {med.dosage}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-500">No medications taken today</p>
                )}
              </div>
              <div className="card">
                <h2 className="text-lg font-semibold mb-2">Latest Blood Sugar</h2>
                {loading ? (
                  <p className="text-gray-500">Loading...</p>
                ) : error ? (
                  <p className="text-red-600 text-sm">Error loading data</p>
                ) : latestBloodSugar ? (
                  <div>
                    <p className="text-2xl font-bold text-primary-600">{latestBloodSugar.value} {latestBloodSugar.unit}</p>
                    <p className="text-gray-600 text-sm">{latestBloodSugar.dateStr}</p>
                    {latestBloodSugar.notes && (
                      <p className="text-gray-500 text-sm mt-2"><strong>Notes:</strong> {latestBloodSugar.notes}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">No readings yet</p>
                )}
              </div>
            </div>
          </div>
        );
      case 'medication':
        return isAuthenticated ? <MedicationTracker /> : <LoginPrompt onLogin={() => setShowLogin(true)} />;
      case 'bloodSugar':
        return isAuthenticated ? <BloodSugarTracker /> : <LoginPrompt onLogin={() => setShowLogin(true)} />;
      default:
        return <MedicationTracker />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14">
            <h1 className="text-xl font-bold text-gray-900">E3Dash</h1>
            <nav className="flex space-x-6">
              {tabs.map((tab) => {
                const isProtected = tab.protected && !isAuthenticated;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (isProtected) {
                        setShowLogin(true);
                      } else {
                        setActiveTab(tab.id);
                      }
                    }}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : isProtected
                        ? 'border-transparent text-gray-400 cursor-not-allowed'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.name}
                    {isProtected && ' 🔒'}
                  </button>
                );
              })}
              {isAuthenticated && (
                <button
                  onClick={logout}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        <main>
          {renderContent()}
        </main>
      </div>

      {showLogin && (
        <LoginForm onClose={() => setShowLogin(false)} />
      )}
    </div>
  );
}

function LoginPrompt({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Authentication Required</h2>
      <p className="text-gray-600 mb-6">Please login to access this feature.</p>
      <button onClick={onLogin} className="btn btn-primary">
        Login
      </button>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
