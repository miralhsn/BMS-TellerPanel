import { useState, useEffect } from 'react';
import CustomerSearch from '../../components/CustomerSearch';
import AccountDetails from '../../components/AccountDetails';
import CashTransaction from '../../components/CashTransaction';
import { customerService } from '../../services/api';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TransactionReceipt from '../../components/Receipt';

const TransactionRow = ({ transaction, customer }) => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      setSending(true);
      setError(null);
      await customerService.sendTransactionReceipt(transaction._id, email);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setShowEmailForm(false);
        setEmail('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send receipt');
    } finally {
      setSending(false);
    }
  };

  return (
    <tr className="border-t">
      <td className="px-4 py-2">
        {new Date(transaction.date).toLocaleDateString()}
      </td>
      <td className="px-4 py-2">
        {transaction._id.toString().replace(/^[0-9a-f]{24}$/, id => `TXN${id.substr(-6).toUpperCase()}`)}
      </td>
      <td className="px-4 py-2">
        <div className="flex items-center space-x-2 relative">
          <PDFDownloadLink
            document={<TransactionReceipt transaction={transaction} customer={customer} />}
            fileName={`receipt_${transaction._id}.pdf`}
            className="text-blue-500 hover:text-blue-700"
          >
            {({ loading }) => (
              <button className="p-1 hover:bg-gray-100 rounded" title="Download Receipt">
                📄
              </button>
            )}
          </PDFDownloadLink>
          
          <button
            onClick={() => setShowEmailForm(!showEmailForm)}
            className="p-1 hover:bg-gray-100 rounded"
            title="Email Receipt"
          >
            ✉️
          </button>

          {showEmailForm && (
            <div className="absolute left-0 top-8 bg-white p-4 rounded-lg shadow-lg border z-50 w-64">
              <form onSubmit={handleSendEmail} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full p-2 border rounded-md text-sm"
                  required
                />
                {error && <div className="text-red-500 text-xs">{error}</div>}
                {success && <div className="text-green-500 text-xs">Sent successfully!</div>}
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowEmailForm(false)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:bg-blue-300"
                  >
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-2 capitalize">
        {transaction.type}
        {transaction.description && ` - ${transaction.description}`}
      </td>
      <td className={`px-4 py-2 text-right ${
        transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
      }`}>
        {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
      </td>
      <td className="px-4 py-2 text-right">
        ${transaction.balanceAfter.toFixed(2)}
      </td>
    </tr>
  );
};

const Transactions = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showStatementEmailForm, setShowStatementEmailForm] = useState(false);
  const [statementEmail, setStatementEmail] = useState('');
  const [sendingStatement, setSendingStatement] = useState(false);
  const [statementError, setStatementError] = useState(null);
  const [statementSuccess, setStatementSuccess] = useState(false);

  const loadTransactions = async (customerId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await customerService.getTransactionHistory(customerId);
      setTransactions(response.data || []);
    } catch (err) {
      setError('Failed to load transactions');
      console.error('Load transactions error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSelect = async (customer) => {
    setSelectedCustomer(customer);
    if (customer?._id) {
      await loadTransactions(customer._id);
    }
  };

  const handleTransactionComplete = async (transactionData) => {
    setSelectedCustomer(prev => ({
      ...prev,
      balance: transactionData.newBalance
    }));
    setShowTransactionModal(false);
    // Reload transactions after new transaction
    if (selectedCustomer?._id) {
      await loadTransactions(selectedCustomer._id);
    }
  };

  const handleSendStatement = async (e) => {
    e.preventDefault();
    try {
      setSendingStatement(true);
      setStatementError(null);
      await customerService.sendStatementEmail(selectedCustomer._id, statementEmail);
      setStatementSuccess(true);
      setTimeout(() => {
        setStatementSuccess(false);
        setShowStatementEmailForm(false);
        setStatementEmail('');
      }, 2000);
    } catch (err) {
      setStatementError(err.response?.data?.message || 'Failed to send statement');
    } finally {
      setSendingStatement(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transaction Management</h1>
        {selectedCustomer && (
          <button
            onClick={() => setShowTransactionModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            New Transaction
          </button>
        )}
      </div>

      {!selectedCustomer ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Select Customer</h2>
          <CustomerSearch onCustomerSelect={handleCustomerSelect} />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Selected Customer</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Name</p>
                <p>{selectedCustomer.name}</p>
              </div>
              <div>
                <p className="font-semibold">Account Number</p>
                <p>{selectedCustomer.accountNumber}</p>
              </div>
              <div>
                <p className="font-semibold">Account Type</p>
                <p className="capitalize">{selectedCustomer.accountType}</p>
              </div>
              <div>
                <p className="font-semibold">Current Balance</p>
                <p className="text-lg font-medium text-green-600">
                  ${selectedCustomer.balance.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-4">Loading transactions...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : (
            <>
              {transactions.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Transaction History</h2>
                    <div className="flex items-center space-x-4">
                      <PDFDownloadLink
                        document={<TransactionReceipt 
                          transactions={transactions}
                          customer={selectedCustomer}
                          isStatement={true}
                        />}
                        fileName={`statement_${selectedCustomer.accountNumber}.pdf`}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                      >
                        {({ loading }) => (loading ? 'Generating PDF...' : 'Download Statement')}
                      </PDFDownloadLink>

                      <button
                        onClick={() => setShowStatementEmailForm(!showStatementEmailForm)}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                      >
                        Email Statement
                      </button>

                      {showStatementEmailForm && (
                        <div className="absolute right-0 mt-32 bg-white p-4 rounded-lg shadow-lg border z-50 w-80">
                          <form onSubmit={handleSendStatement} className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Email Address
                              </label>
                              <input
                                type="email"
                                value={statementEmail}
                                onChange={(e) => setStatementEmail(e.target.value)}
                                className="mt-1 w-full p-2 border rounded-md"
                                required
                              />
                            </div>
                            
                            {statementError && (
                              <div className="text-red-500 text-sm">{statementError}</div>
                            )}
                            {statementSuccess && (
                              <div className="text-green-500 text-sm">Statement sent successfully!</div>
                            )}

                            <div className="flex justify-end space-x-2">
                              <button
                                type="button"
                                onClick={() => setShowStatementEmailForm(false)}
                                className="text-sm text-gray-500 hover:text-gray-700"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={sendingStatement}
                                className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 disabled:bg-green-300"
                              >
                                {sendingStatement ? 'Sending...' : 'Send'}
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>

                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Transaction ID</th>
                        <th className="px-4 py-2 text-left">Receipt</th>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-right">Amount</th>
                        <th className="px-4 py-2 text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <TransactionRow 
                          key={transaction._id} 
                          transaction={transaction}
                          customer={selectedCustomer}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {showTransactionModal && (
        <CashTransaction
          customer={selectedCustomer}
          onTransactionComplete={handleTransactionComplete}
          onClose={() => setShowTransactionModal(false)}
        />
      )}
    </div>
  );
};

export default Transactions; 