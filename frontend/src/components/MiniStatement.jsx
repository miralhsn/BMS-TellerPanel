import { useState } from 'react';
import { customerService } from '../services/api';
import { PDFDownloadLink } from '@react-pdf/renderer';
import StatementPDF from './StatementPDF';

const MiniStatement = ({ customer, transactions }) => {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      setSending(true);
      setSendError(null);
      await customerService.sendStatementEmail(customer._id, email);
      setSendSuccess(true);
      setTimeout(() => {
        setSendSuccess(false);
        document.getElementById('emailForm').classList.add('hidden');
        setEmail('');
      }, 3000);
    } catch (err) {
      setSendError(
        err.response?.data?.message || 
        'Failed to send statement. Please check your email address and try again.'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Mini Statement</h2>
        <div className="flex gap-2">
          <PDFDownloadLink
            document={<StatementPDF customer={customer} transactions={transactions} />}
            fileName={`statement_${customer.accountNumber}.pdf`}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
          </PDFDownloadLink>
          <button
            onClick={() => document.getElementById('emailForm').classList.toggle('hidden')}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Email Statement
          </button>
        </div>
      </div>

      <div id="emailForm" className="hidden mb-6 p-4 bg-gray-50 rounded-lg">
        <form onSubmit={handleSendEmail} className="space-y-4">
          <div>
            <label className="block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          {sendError && <div className="text-red-500 text-sm">{sendError}</div>}
          {sendSuccess && (
            <div className="text-green-500 text-sm">Statement sent successfully!</div>
          )}
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-green-300"
            disabled={sending}
          >
            {sending ? 'Sending...' : 'Send Statement'}
          </button>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-right">Amount</th>
              <th className="px-4 py-2 text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction._id} className="border-t">
                  <td className="px-4 py-2">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 capitalize">
                    {transaction.type}
                    {transaction.description && ` - ${transaction.description}`}
                  </td>
                  <td className={`px-4 py-2 text-right ${
                    transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'deposit' ? '+' : '-'}
                    ${transaction.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    ${transaction.balanceAfter.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MiniStatement; 