import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/customers', label: 'Customer Management', icon: '👥' },
    { path: '/search', label: 'Search Customers', icon: '🔍' },
    { path: '/balance-inquiry', label: 'Balance Inquiry', icon: '💰' },
    { path: '/transactions', label: 'Transactions', icon: '💳' },
    { path: '/cheques', label: 'Cheque Processing', icon: '📝' }
  ];

  return (
    <>
      {/* Hamburger Menu for Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-30 bg-white p-2 rounded-md shadow-md"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-20
          w-64 min-h-screen bg-white shadow-lg
          transform transition-transform duration-200 ease-in-out
          lg:transform-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-blue-600">ReliPay Teller</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar; 