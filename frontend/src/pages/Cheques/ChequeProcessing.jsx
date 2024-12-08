import { useState } from 'react';
import CustomerSearch from '../../components/CustomerSearch';
import ChequeForm from '../../components/ChequeForm';
import ChequeList from '../../components/ChequeList';

const ChequeProcessing = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showChequeForm, setShowChequeForm] = useState(false);

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cheque Processing</h1>
        {selectedCustomer && (
          <button
            onClick={() => setShowChequeForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Submit New Cheque
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
            </div>
          </div>
          
          <ChequeList 
            customerId={selectedCustomer._id} 
            onChequeProcessed={() => {
              // Refresh customer data if needed
            }}
          />
        </div>
      )}

      {showChequeForm && (
        <ChequeForm
          customer={selectedCustomer}
          onClose={() => setShowChequeForm(false)}
          onSubmit={() => {
            setShowChequeForm(false);
            // Refresh cheque list
          }}
        />
      )}
    </div>
  );
};

export default ChequeProcessing; 