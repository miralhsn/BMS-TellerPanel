import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  receiptPage: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  statementPage: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  subHeader: {
    fontSize: 14,
    marginBottom: 20,
  },
  customerInfo: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  customerInfoText: {
    fontSize: 12,
    marginBottom: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  // Statement columns
  dateColumn: {
    width: '15%',
    fontSize: 10,
  },
  idColumn: {
    width: '20%',
    fontSize: 10,
  },
  typeColumn: {
    width: '25%',
    fontSize: 10,
  },
  amountColumn: {
    width: '20%',
    fontSize: 10,
    textAlign: 'right',
  },
  balanceColumn: {
    width: '20%',
    fontSize: 10,
    textAlign: 'right',
  },
  // Receipt styles
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    width: 150,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
  },
  footer: {
    marginTop: 30,
    fontSize: 10,
    textAlign: 'center',
    color: 'grey',
  },
  headerText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    borderTopWidth: 2,
    borderTopColor: '#000',
    paddingTop: 10,
    marginTop: 10,
  },
});

const TransactionReceipt = ({ transaction, customer, transactions, isStatement }) => (
  <Document>
    {isStatement ? (
      // A4 Statement
      <Page size="A4" style={styles.statementPage}>
        <Text style={styles.header}>Account Statement</Text>
        
        <View style={styles.customerInfo}>
          <Text style={styles.customerInfoText}>Bank Teller System</Text>
          <Text style={styles.customerInfoText}>Statement Date: {new Date().toLocaleDateString()}</Text>
          <Text style={styles.customerInfoText}>Customer Name: {customer.name}</Text>
          <Text style={styles.customerInfoText}>Account Number: {customer.accountNumber}</Text>
          <Text style={styles.customerInfoText}>Current Balance: ${customer.balance.toFixed(2)}</Text>
        </View>

        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, styles.dateColumn]}>Date</Text>
          <Text style={[styles.headerText, styles.idColumn]}>Transaction ID</Text>
          <Text style={[styles.headerText, styles.typeColumn]}>Type</Text>
          <Text style={[styles.headerText, styles.amountColumn]}>Amount</Text>
          <Text style={[styles.headerText, styles.balanceColumn]}>Balance</Text>
        </View>

        {transactions.map((tx) => (
          <View key={tx._id} style={styles.tableRow}>
            <Text style={styles.dateColumn}>
              {new Date(tx.date).toLocaleDateString()}
            </Text>
            <Text style={styles.idColumn}>
              {tx._id.toString().replace(/^[0-9a-f]{24}$/, id => `TXN${id.substr(-6).toUpperCase()}`)}
            </Text>
            <Text style={styles.typeColumn}>{tx.type.toUpperCase()}</Text>
            <Text style={styles.amountColumn}>
              {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
            </Text>
            <Text style={styles.balanceColumn}>
              ${tx.balanceAfter.toFixed(2)}
            </Text>
          </View>
        ))}

        <View style={styles.totalRow}>
          <Text style={[styles.headerText, { flex: 1 }]}>Closing Balance:</Text>
          <Text style={[styles.headerText, { width: '20%', textAlign: 'right' }]}>
            ${customer.balance.toFixed(2)}
          </Text>
        </View>

        <Text style={styles.footer}>
          This is a computer generated statement and does not require a signature.
        </Text>
      </Page>
    ) : (
      // A6 Receipt
      <Page size="A6" style={styles.receiptPage}>
        <Text style={styles.header}>Transaction Receipt</Text>
        
        <View style={styles.subHeader}>
          <Text>Bank Teller System</Text>
          <Text>{new Date().toLocaleString()}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Transaction ID:</Text>
          <Text style={styles.value}>
            {transaction._id.toString().replace(/^[0-9a-f]{24}$/, id => `TXN${id.substr(-6).toUpperCase()}`)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Customer Name:</Text>
          <Text style={styles.value}>{customer.name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Account Number:</Text>
          <Text style={styles.value}>{customer.accountNumber}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Transaction Type:</Text>
          <Text style={styles.value}>{transaction.type.toUpperCase()}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.value}>${transaction.amount.toFixed(2)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>New Balance:</Text>
          <Text style={styles.value}>${transaction.balanceAfter.toFixed(2)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>
            {new Date(transaction.date).toLocaleString()}
          </Text>
        </View>

        {transaction.description && (
          <View style={styles.row}>
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.value}>{transaction.description}</Text>
          </View>
        )}

        <Text style={styles.footer}>
          Thank you for banking with us!
        </Text>
      </Page>
    )}
  </Document>
);

export default TransactionReceipt; 