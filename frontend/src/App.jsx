import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CustomerSearch from './components/CustomerSearch';
import AccountDetails from './components/AccountDetails';
import CustomerInfoUpdate from './components/CustomerInfoUpdate';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import { authService } from './services/auth';
import AddCustomer from './components/AddCustomer';
import CustomerList from './components/CustomerList';
import BalanceInquiry from './components/BalanceInquiry';
import NotificationDropdown from './components/NotificationDropdown';

// Placeholder components for other pages
const Reports = () => <div className="p-6">Reports Page (Coming Soon)</div>;
const Transactions = lazy(() => import('./pages/Transactions/Transactions'));
const ChequeProcessing = lazy(() => import('./pages/Cheques/ChequeProcessing'));

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setSelectedCustomer(null);
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleCustomerUpdate = (updatedCustomer) => {
    setSelectedCustomer(updatedCustomer);
  };

  const CustomerManagement = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <button
          onClick={() => setShowAddCustomer(true)}
          className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Add Customer
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="w-full overflow-x-auto">
          <CustomerList onCustomerSelect={handleCustomerSelect} />
        </div>

        {selectedCustomer && (
          <div className="space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md overflow-x-auto">
              <AccountDetails customer={selectedCustomer} />
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <CustomerInfoUpdate 
                customer={selectedCustomer}
                onUpdate={handleCustomerUpdate}
              />
            </div>
          </div>
        )}
      </div>

      {showAddCustomer && (
        <AddCustomer
          onCustomerAdded={(customer) => {
            setShowAddCustomer(false);
            setSelectedCustomer(customer);
          }}
          onClose={() => setShowAddCustomer(false)}
        />
      )}
    </div>
  );

  const SearchPage = () => (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Search Customers</h1>
        <div className="max-w-xl">
          <CustomerSearch onCustomerSelect={handleCustomerSelect} />
        </div>
      </div>
      
      {selectedCustomer && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <AccountDetails customer={selectedCustomer} />
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <CustomerInfoUpdate 
              customer={selectedCustomer}
              onUpdate={handleCustomerUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/customers" : "/login"} replace />} />
        
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/customers" replace /> : 
              <Login onLoginSuccess={handleLoginSuccess} />
          } 
        />
        
        <Route
          element={
            isAuthenticated ? (
              <div className="flex min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1">
                  <header className="bg-white shadow-sm">
                    <div className="container mx-auto px-4 py-4 flex justify-end items-center space-x-4">
                      <NotificationDropdown />
                      <button onClick={handleLogout} className="text-red-500 hover:text-red-600">
                        Logout
                      </button>
                    </div>
                  </header>

                  <main className="container mx-auto px-4 py-8">
                    <Suspense fallback={<div>Loading...</div>}>
                      <Routes>
                        <Route path="/customers" element={<CustomerManagement />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/transactions" element={<Transactions />} />
                        <Route path="/cheques" element={<ChequeProcessing />} />
                        <Route path="/balance-inquiry" element={<BalanceInquiry />} />
                      </Routes>
                    </Suspense>
                  </main>
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
          path="/*"
        />
      </Routes>
    </Router>
  );
}

export default App;
