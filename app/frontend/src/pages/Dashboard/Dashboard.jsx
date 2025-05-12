import { useState } from 'react';
import BalanceSummary from '../../components/BalanceSummary';
import BalanceInquiry from '../../components/BalanceInquiry';
import Notifications from '../../components/Notifications';

const Dashboard = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BalanceInquiry onCustomerSelect={setSelectedCustomer} />
        {selectedCustomer && <BalanceSummary customer={selectedCustomer} />}
      </div>

      {selectedCustomer && (
        <div className="mt-6">
          <Notifications customerId={selectedCustomer._id} />
        </div>
      )}
    </div>
  );
};

export default Dashboard; 