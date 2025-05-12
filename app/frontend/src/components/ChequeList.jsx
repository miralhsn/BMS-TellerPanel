import { useState, useEffect } from 'react';
import { customerService } from '../services/api';

const ChequeList = ({ customerId, onChequeProcessed }) => {
  const [cheques, setCheques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCheques();
  }, [customerId]);

  const loadCheques = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await customerService.getCheques(customerId);
      setCheques(response || []);
    } catch (err) {
      setError('Failed to load cheques');
      console.error('Load cheques error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async (chequeId, status, rejectionReason = '') => {
    try {
      await customerService.processCheque(chequeId, { status, rejectionReason });
      loadCheques();
      if (onChequeProcessed) {
        onChequeProcessed();
      }
    } catch (err) {
      console.error('Process cheque error:', err);
      alert(err.response?.data?.message || 'Failed to process cheque');
    }
  };

  if (loading) return <div>Loading cheques...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Cheque History</h2>
      </div>
      <div className="divide-y">
        {cheques.length > 0 ? (
          cheques.map((cheque) => (
            <div key={cheque._id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    Cheque #{cheque.chequeNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    Amount: ${cheque.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Bank: {cheque.issuingBank}
                  </p>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(cheque.issueDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: <span className="capitalize">{cheque.status}</span>
                  </p>
                </div>
                {cheque.status === 'pending' && (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleProcess(cheque._id, 'cleared')}
                      className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Enter rejection reason:');
                        if (reason) {
                          handleProcess(cheque._id, 'rejected', reason);
                        }
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
              {cheque.rejectionReason && (
                <p className="mt-2 text-sm text-red-500">
                  Rejection reason: {cheque.rejectionReason}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No cheques found
          </div>
        )}
      </div>
    </div>
  );
};

export default ChequeList; 