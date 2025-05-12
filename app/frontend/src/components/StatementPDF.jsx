import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  customerInfo: {
    marginBottom: 20,
  },
  table: {
    display: 'table',
    width: '100%',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    minHeight: 24,
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
  },
  tableCell: {
    flex: 1,
    padding: 4,
    fontSize: 10,
  },
  amount: {
    textAlign: 'right',
  },
});

const StatementPDF = ({ customer, transactions }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Account Statement</Text>
        <View style={styles.customerInfo}>
          <Text>Name: {customer.name}</Text>
          <Text>Account Number: {customer.accountNumber}</Text>
          <Text>Account Type: {customer.accountType}</Text>
          <Text>Current Balance: ${customer.balance.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Date</Text>
          <Text style={styles.tableCell}>Description</Text>
          <Text style={[styles.tableCell, styles.amount]}>Amount</Text>
          <Text style={[styles.tableCell, styles.amount]}>Balance</Text>
        </View>

        {transactions.map((transaction) => (
          <View key={transaction._id} style={styles.tableRow}>
            <Text style={styles.tableCell}>
              {new Date(transaction.date).toLocaleDateString()}
            </Text>
            <Text style={styles.tableCell}>
              {transaction.type}
              {transaction.description && ` - ${transaction.description}`}
            </Text>
            <Text style={[styles.tableCell, styles.amount]}>
              {transaction.type === 'deposit' ? '+' : '-'}
              ${transaction.amount.toFixed(2)}
            </Text>
            <Text style={[styles.tableCell, styles.amount]}>
              ${transaction.balanceAfter.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default StatementPDF; 