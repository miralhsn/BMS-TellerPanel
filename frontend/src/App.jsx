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
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customer Management</h1>
        <button
          onClick={() => setShowAddCustomer(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Add Customer
        </button>
      </div>

      <CustomerList onCustomerSelect={handleCustomerSelect} />

      {selectedCustomer && (
        <>
          <AccountDetails customer={selectedCustomer} />
          <CustomerInfoUpdate 
            customer={selectedCustomer}
            onUpdate={handleCustomerUpdate}
          />
        </>
      )}

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
      <CustomerSearch onCustomerSelect={handleCustomerSelect} />
      
      {selectedCustomer && (
        <AccountDetails customer={selectedCustomer} />
      )}
    </div>
  );

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1">
          <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4 flex justify-end items-center space-x-4">
              <NotificationDropdown />
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600"
              >
                Logout
              </button>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Navigate to="/customers" replace />} />
                <Route path="/customers" element={<CustomerManagement />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/cheques" element={<ChequeProcessing />} />
                <Route path="/balance-inquiry" element={<BalanceInquiry />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
