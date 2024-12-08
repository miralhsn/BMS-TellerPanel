import { useState, useEffect } from 'react';
import { customerService } from '../services/api';
import CashTransaction from './CashTransaction';

const AccountDetails = ({ customer, onUpdate, hideTransactionButton = false }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  useEffect(() => {
    if (customer?._id) {
      loadTransactions();
    }
  }, [customer?._id]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await customerService.getTransactionHistory(customer._id);
      setTransactions(data);
    } catch (err) {
      setError('Failed to load transaction history');
      console.error('Transaction load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionComplete = (transactionData) => {
    loadTransactions();
    // Update the customer balance in the parent component
    if (onUpdate) {
      onUpdate({
        ...customer,
        balance: transactionData.newBalance
      });
    }
  };

  if (!customer) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Account Details</h2>
        {!hideTransactionButton && (
          <button
            onClick={() => setShowTransactionModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            New Transaction
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="font-semibold">Customer Name</p>
          <p>{customer.name}</p>
        </div>
        <div>
          <p className="font-semibold">Account Number</p>
          <p>{customer.accountNumber}</p>
        </div>
        <div>
          <p className="font-semibold">Account Type</p>
          <p className="capitalize">{customer.accountType}</p>
        </div>
        <div>
          <p className="font-semibold">Current Balance</p>
          <p className="text-lg font-medium">${customer.balance.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Transaction History</h3>
        {loading ? (
          <p>Loading transactions...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Balance</th>
                  <th className="px-4 py-2">Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id} className="border-t">
                    <td className="px-4 py-2">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 capitalize">
                      {transaction.type}
                    </td>
                    <td className="px-4 py-2">
                      ${transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      ${transaction.balanceAfter.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {transaction.transactionId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No transactions found</p>
        )}
      </div>

      {showTransactionModal && (
        <CashTransaction
          customer={customer}
          onTransactionComplete={handleTransactionComplete}
          onClose={() => setShowTransactionModal(false)}
        />
      )}
    </div>
  );
};

export default AccountDetails; 