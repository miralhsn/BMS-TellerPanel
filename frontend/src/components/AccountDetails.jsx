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
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Account Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Name</p>
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
          <p className="font-semibold">Balance</p>
          <p className="text-lg font-medium text-green-600">
            ${customer.balance.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="font-semibold">Email</p>
          <p>{customer.email}</p>
        </div>
        <div>
          <p className="font-semibold">Phone</p>
          <p>{customer.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails; 