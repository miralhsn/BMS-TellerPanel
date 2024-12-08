import { useState, useEffect } from 'react';
import { customerService } from '../services/api';

const CustomerList = ({ onCustomerSelect }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await customerService.getAllCustomers();
      setCustomers(response.data);
    } catch (err) {
      setError('Failed to load customers');
      console.error('Load customers error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="text-center py-4">Loading customers...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4">
          <h2 className="text-xl font-bold">Customer List</h2>
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Account Number</th>
                <th className="px-4 py-2 text-left">Account Type</th>
                <th className="px-4 py-2 text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer._id}
                  onClick={() => onCustomerSelect(customer)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-2">{customer.name}</td>
                  <td className="px-4 py-2">{customer.accountNumber}</td>
                  <td className="px-4 py-2 capitalize">{customer.accountType}</td>
                  <td className="px-4 py-2 text-right">
                    ${customer.balance.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && <div className="text-center py-4">Loading...</div>}
        {error && <div className="text-red-500 text-center py-4">{error}</div>}
        {!loading && !error && filteredCustomers.length === 0 && (
          <div className="text-gray-500 text-center py-4">No customers found</div>
        )}
      </div>
    </div>
  );
};

export default CustomerList; 