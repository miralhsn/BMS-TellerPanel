import { useState } from 'react';
import { customerService } from '../services/api';

const CustomerSearch = ({ onCustomerSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      const { data } = await customerService.searchCustomers(searchTerm);
      setSearchResults(data);
    } catch (err) {
      setError('Failed to search customers. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchResults([]);
    setHasSearched(false);
    setError(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Customer Search</h2>
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, account number, or email"
            className="flex-1 p-2 border rounded-md"
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          {hasSearched && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="mt-4 text-red-500">
          {error}
        </div>
      )}

      {hasSearched && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">
            Search Results {searchResults.length > 0 && `(${searchResults.length})`}
          </h3>
          {searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((customer) => (
                <div
                  key={customer._id}
                  className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                  onClick={() => onCustomerSelect(customer)}
                >
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-gray-600">
                    Account: {customer.accountNumber}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No customers found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerSearch; 