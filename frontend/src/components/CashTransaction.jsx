import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { customerService } from '../services/api';
import TransactionReceipt from './Receipt';

const CashTransaction = ({ customer, onTransactionComplete, onClose }) => {
  const [formData, setFormData] = useState({
    type: 'deposit',
    amount: '',
    description: '',
    withdrawalMethod: 'cash'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [completedTransaction, setCompletedTransaction] = useState(null);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  const LIMITS = {
    cash: 5000,
    cheque: 10000
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailReceipt = async (e) => {
    e.preventDefault();
    try {
      setSending(true);
      await customerService.sendTransactionReceipt(completedTransaction._id, email);
      setEmailSuccess(true);
      setTimeout(() => setEmailSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send receipt');
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (formData.type === 'withdrawal') {
      const amount = parseFloat(formData.amount);
      const limit = formData.withdrawalMethod === 'cash' ? LIMITS.cash : LIMITS.cheque;
      
      if (amount > limit) {
        setError(`${formData.withdrawalMethod.charAt(0).toUpperCase() + formData.withdrawalMethod.slice(1)} withdrawal limit is $${limit}`);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await customerService.processTransaction({
        ...formData,
        customerId: customer._id,
        amount: parseFloat(formData.amount)
      });

      setCompletedTransaction(response.data.transaction);
      onTransactionComplete(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Cash Transaction</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ��
          </button>
        </div>

        {!completedTransaction ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Transaction Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="deposit">Cash Deposit</option>
                <option value="withdrawal">Withdrawal</option>
              </select>
            </div>

            {formData.type === 'withdrawal' && (
              <div>
                <label className="block mb-1">Withdrawal Method</label>
                <select
                  name="withdrawalMethod"
                  value={formData.withdrawalMethod}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                </select>
                <p className="text-sm text-gray-600 mt-1">
                  Limit: ${formData.withdrawalMethod === 'cash' ? LIMITS.cash : LIMITS.cheque}
                </p>
                {formData.withdrawalMethod === 'cash' && (
                  <p className="text-sm text-gray-600">
                    Maximum 3 cash withdrawals per hour
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block mb-1">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-2">$</span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full p-2 pl-8 border rounded-md"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-1">Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                rows="2"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Submit'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-600 font-medium">Transaction Successful!</p>
              <p className="text-sm text-gray-600 mt-1">
                {formData.type === 'deposit' ? 'Deposited' : 'Withdrawn'}: ${formData.amount}
              </p>
              <p className="text-sm text-gray-600">
                New Balance: ${completedTransaction.balanceAfter.toFixed(2)}
              </p>
            </div>

            <div className="space-y-4">
              <PDFDownloadLink
                document={<TransactionReceipt transaction={completedTransaction} customer={customer} />}
                fileName={`receipt_${completedTransaction._id}.pdf`}
                className="block w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-center"
              >
                {({ loading }) => (loading ? 'Generating PDF...' : 'Download Receipt')}
              </PDFDownloadLink>

              <button
                onClick={onClose}
                className="block w-full border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CashTransaction; 