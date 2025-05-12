import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TransactionReceipt from './Receipt';
import { customerService } from '../services/api';

const ReceiptModal = ({ transaction, customer, onClose }) => {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleEmailReceipt = async (e) => {
    e.preventDefault();
    try {
      setSending(true);
      setError(null);
      await customerService.sendTransactionReceipt(transaction._id, email);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send receipt');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Transaction Receipt</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <PDFDownloadLink
              document={<TransactionReceipt transaction={transaction} customer={customer} />}
              fileName={`receipt_${transaction.transactionId}.pdf`}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-center"
            >
              {({ loading }) => (loading ? 'Generating PDF...' : 'Print Receipt')}
            </PDFDownloadLink>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Email Receipt</h3>
            <form onSubmit={handleEmailReceipt} className="space-y-3">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
              
              {success && (
                <div className="text-green-500 text-sm">Receipt sent successfully!</div>
              )}

              <button
                type="submit"
                className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-green-300"
                disabled={sending}
              >
                {sending ? 'Sending...' : 'Email Receipt'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal; 