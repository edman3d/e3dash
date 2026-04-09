import { useState, useEffect } from 'react';
import MedicationTracker from './components/Medication/MedicationTracker';
import BloodSugarTracker from './components/BloodSugar/BloodSugarTracker';
import { useDashboardStats } from './hooks/useDashboardStats';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/Auth/LoginForm';
// Inline SVG Icons
import './App.css';

function AppContent() {
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('activeTab');
    return savedTab || 'dashboard';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const { medicationsToday, todaysMedications, latestBloodSugar, loading, error } = useDashboardStats(activeTab);
  const { user, isAuthenticated, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg> },
    { id: 'medication', name: 'Medication', protected: true, icon: <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg> },
    { id: 'bloodSugar', name: 'Blood Sugar', protected: true, icon: <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
              <svg className="w-8 h-8 mr-3 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
              Health Dashboard
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card">
                <h2 className="text-lg font-semibold mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                  Medications Today
                </h2>
                {loading ? (
                  <p className="text-gray-500">Loading...</p>
                ) : error ? (
                  <p className="text-red-600 text-sm">Error loading data</p>
                ) : medicationsToday > 0 ? (
                  <div>
                    <p className="text-3xl font-bold text-primary-600 mb-3">{medicationsToday}</p>
                    {user?.username === 'edman3d' ? (
                      <ul className="space-y-1">
                        {todaysMedications.map((med) => (
                          <li key={med._id} className="text-sm text-gray-700">
                            {med.name} - {med.dosage}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-600">Medication details are private</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">No medications taken today</p>
                )}
              </div>
              <div className="card">
                <h2 className="text-lg font-semibold mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
                  Latest Blood Sugar
                </h2>
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

  const handleTabClick = (tabId: string, isProtected: boolean | undefined) => {
    if (isProtected) {
      setShowLogin(true);
    } else {
      setActiveTab(tabId);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14">
            <h1 
              onClick={() => {
                setActiveTab('dashboard');
                setIsMobileMenuOpen(false);
              }}
              className="text-xl font-bold text-gray-900 cursor-pointer hover:text-primary-600 transition-colors"
            >
              E3Dash
            </h1>
            
            {/* Mobile Hamburger Menu */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
              >
                {isMobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden sm:flex space-x-6">
              {tabs.map((tab) => {
                const isProtected = tab.protected && !isAuthenticated;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id, isProtected)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : isProtected
                        ? 'border-transparent text-gray-400 cursor-not-allowed'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.icon}
                    {tab.name}
                    {isProtected && ' 🔒'}
                  </button>
                );
              })}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-sm text-red-600 hover:text-red-800 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
                  Logout
                </button>
              )}
            </nav>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="sm:hidden border-t border-gray-200">
              <nav className="py-2 space-y-1">
                {tabs.map((tab) => {
                  const isProtected = tab.protected && !isAuthenticated;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id, isProtected)}
                      className={`block w-full text-left px-3 py-2 text-base font-medium flex items-center ${
                        activeTab === tab.id
                          ? 'bg-primary-50 border-l-4 border-primary-500 text-primary-700'
                          : isProtected
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {tab.icon}
                    {tab.name}
                      {isProtected && ' 🔒'}
                    </button>
                  );
                })}
                {isAuthenticated && (
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
                  Logout
                  </button>
                )}
              </nav>
            </div>
          )}
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
