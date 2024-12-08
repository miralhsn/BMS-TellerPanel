import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/customers', label: 'Customer Management', icon: '👥' },
    { path: '/search', label: 'Search Customers', icon: '🔍' },
    { path: '/balance-inquiry', label: 'Balance Inquiry', icon: '💰' },
    { path: '/transactions', label: 'Transactions', icon: '💳' },
    { path: '/cheques', label: 'Cheque Processing', icon: '📝' }
  ];

  return (
    <div className="bg-white w-64 min-h-screen shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Teller Panel</h2>
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
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 