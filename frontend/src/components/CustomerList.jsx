import { useState, useEffect } from 'react';
import { customerService } from '../services/api';

const CustomerList = ({ onCustomerSelect }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className="text-center py-4">Loading customers...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Customer List</h2>
      </div>
      <div className="divide-y">
        {customers.length > 0 ? (
          customers.map((customer) => (
            <div
              key={customer._id}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onCustomerSelect(customer)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{customer.name}</h3>
                  <p className="text-sm text-gray-600">
                    Account: {customer.accountNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Balance: ${customer.balance.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">
                    Type: {customer.accountType}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No customers found
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList; 