import { useState, useEffect } from 'react';
import { customerService } from '../services/api';

const BalanceInquiry = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (hasError) {
      const timer = setTimeout(() => {
        setHasError(false);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [hasError]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError('Please enter an account number or customer ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await customerService.getQuickBalance(searchTerm);
      setAccountInfo(response.data);
    } catch (err) {
      setHasError(true);
      setError(
        err.response?.data?.message || 
        'Failed to fetch account information. Please try again.'
      );
      console.error('Balance inquiry error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Quick Balance Inquiry</h2>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter Account Number or Customer ID"
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
        </div>
      </form>

      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Fetching account information...</p>
        </div>
      )}

      {accountInfo && (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Account Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Account Holder</p>
                <p className="font-medium">{accountInfo.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Account Number</p>
                <p className="font-medium">{accountInfo.accountNumber}</p>
              </div>
              <div>
                <p className="text-gray-600">Account Type</p>
                <p className="font-medium capitalize">{accountInfo.accountType}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-medium text-green-600">Active</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-gray-600">Available Balance</p>
              <p className="text-2xl font-bold text-green-600">
                ${accountInfo.balance.toFixed(2)}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-600">Pending Transactions</p>
              <p className="text-2xl font-bold text-blue-600">
                ${accountInfo.pendingBalance?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>

          {accountInfo.recentTransactions && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Recent Transactions</h3>
              <div className="space-y-2">
                {accountInfo.recentTransactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="font-medium capitalize">{transaction.type}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className={`font-medium ${
                      transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BalanceInquiry; 