const BalanceSummary = ({ accountInfo }) => {
  if (!accountInfo) return null;

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Account Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Account Holder</p>
            <p className="font-medium">{accountInfo.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Account Number</p>
            <p className="font-medium">{accountInfo.accountNumber}</p>
          </div>
          <div>
            <p className="text-gray-600">Account Type</p>
            <p className="font-medium capitalize">{accountInfo.accountType}</p>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            <p className="font-medium text-green-600">Active</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-gray-600">Available Balance</p>
          <p className="text-2xl font-bold text-green-600">
            ${accountInfo.balance.toFixed(2)}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-gray-600">Pending Balance</p>
          <p className="text-2xl font-bold text-blue-600">
            ${accountInfo.pendingBalance?.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BalanceSummary; 