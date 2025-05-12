import NotificationDropdown from './NotificationDropdown';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Bank Teller System</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <NotificationDropdown />
            {/* Other header items */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 