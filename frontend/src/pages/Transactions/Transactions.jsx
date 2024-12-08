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
    <tr className="border-t hover:bg-gray-50">
      {/* Mobile View - Combined Info */}
      <td className="block sm:hidden px-4 py-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium">{new Date(transaction.date).toLocaleDateString()}</div>
            <div className="text-sm text-gray-600 capitalize">{transaction.type}</div>
            {transaction.description && (
              <div className="text-sm text-gray-500">{transaction.description}</div>
            )}
          </div>
          <div className="text-right">
            <div className={`font-medium ${
              transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">
              Balance: ${transaction.balanceAfter.toFixed(2)}
            </div>
          </div>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {transaction._id.toString().replace(/^[0-9a-f]{24}$/, id => `TXN${id.substr(-6).toUpperCase()}`)}
          </div>
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

            {/* Email Form Popup */}
            {showEmailForm && (
              <div className="absolute right-0 top-8 bg-white p-4 rounded-lg shadow-lg border z-50 w-64">
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowEmailForm(false);
                      }}
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
        </div>
      </td>

      {/* Desktop View - Separate Columns */}
      <td className="hidden sm:table-cell px-4 py-2 whitespace-nowrap">
        <div className="text-sm">{new Date(transaction.date).toLocaleDateString()}</div>
      </td>
      <td className="hidden md:table-cell px-4 py-2 whitespace-nowrap">
        <div className="text-sm">
          {transaction._id.toString().replace(/^[0-9a-f]{24}$/, id => `TXN${id.substr(-6).toUpperCase()}`)}
        </div>
      </td>
      <td className="hidden sm:table-cell px-4 py-2">
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
      <td className="hidden sm:table-cell px-4 py-2">
        <div className="text-sm capitalize">
          {transaction.type}
          {transaction.description && (
            <span className="text-gray-500 ml-2">
              - {transaction.description}
            </span>
          )}
        </div>
      </td>
      <td className="hidden sm:table-cell px-4 py-2 text-right whitespace-nowrap">
        <div className={`text-sm ${
          transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
        }`}>
          {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
        </div>
      </td>
      <td className="hidden sm:table-cell px-4 py-2 text-right whitespace-nowrap">
        <div className="text-sm">${transaction.balanceAfter.toFixed(2)}</div>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-2xl font-bold">Transaction Management</h1>
        {selectedCustomer && (
          <button
            onClick={() => setShowTransactionModal(true)}
            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            New Transaction
          </button>
        )}
      </div>

      {!selectedCustomer ? (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Select Customer</h2>
          <CustomerSearch onCustomerSelect={handleCustomerSelect} />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Selected Customer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                    <h2 className="text-xl font-bold">Transaction History</h2>
                    <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full lg:w-auto">
                      <PDFDownloadLink
                        document={<TransactionReceipt 
                          transactions={transactions}
                          customer={selectedCustomer}
                          isStatement={true}
                        />}
                        fileName={`statement_${selectedCustomer.accountNumber}.pdf`}
                        className="flex-1 sm:flex-none bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-center"
                      >
                        {({ loading }) => (loading ? 'Generating PDF...' : 'Download Statement')}
                      </PDFDownloadLink>

                      <button
                        onClick={() => setShowStatementEmailForm(!showStatementEmailForm)}
                        className="flex-1 sm:flex-none bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-center"
                      >
                        Email Statement
                      </button>

                      {showStatementEmailForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                            <h3 className="text-lg font-semibold mb-4">Email Statement</h3>
                            <form onSubmit={handleSendStatement} className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Email Address
                                </label>
                                <input
                                  type="email"
                                  value={statementEmail}
                                  onChange={(e) => setStatementEmail(e.target.value)}
                                  className="w-full p-2 border rounded-md"
                                  placeholder="Enter email address"
                                  required
                                />
                              </div>
                              
                              {statementError && (
                                <div className="text-red-500 text-sm">{statementError}</div>
                              )}
                              {statementSuccess && (
                                <div className="text-green-500 text-sm">Statement sent successfully!</div>
                              )}

                              <div className="flex justify-end space-x-3">
                                <button
                                  type="button"
                                  onClick={() => setShowStatementEmailForm(false)}
                                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  disabled={sendingStatement}
                                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-green-300"
                                >
                                  {sendingStatement ? 'Sending...' : 'Send Statement'}
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 hidden sm:table-header-group">
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left">Date</th>
                          <th className="px-4 py-2 text-left hidden md:table-cell">Transaction ID</th>
                          <th className="px-4 py-2 text-left">Receipt</th>
                          <th className="px-4 py-2 text-left">Type</th>
                          <th className="px-4 py-2 text-right">Amount</th>
                          <th className="px-4 py-2 text-right hidden sm:table-cell">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
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