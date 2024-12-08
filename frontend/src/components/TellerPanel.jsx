import { useState } from 'react';
import CustomerSearch from './CustomerSearch';
import AccountDetails from './AccountDetails';
import CustomerInfoUpdate from './CustomerInfoUpdate';

const TellerPanel = () => {
  const [currentCustomer, setCurrentCustomer] = useState(null);

  const handleCustomerFound = (customer) => {
    setCurrentCustomer(customer);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Teller Panel</h1>
      <div className="space-y-6">
        <CustomerSearch onCustomerFound={handleCustomerFound} />
        {currentCustomer && (
          <>
            <AccountDetails customer={currentCustomer} />
            <CustomerInfoUpdate customer={currentCustomer} />
          </>
        )}
      </div>
    </div>
  );
};

export default TellerPanel; 