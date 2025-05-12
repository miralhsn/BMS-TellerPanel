const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isInitialized = false;
  }

  initialize() {
    if (this.isInitialized) return;

    try {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });
      this.isInitialized = true;
      console.log('Email service initialized');
    } catch (error) {
      console.warn('Email service initialization failed:', error);
    }
  }

  async verifyConnection() {
    if (!this.transporter) return false;
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      return false;
    }
  }

  async sendStatementEmail(customer, transactions, email) {
    if (!this.transporter) {
      this.initialize();
    }
    try {
      console.log('Generating PDF for customer:', customer.accountNumber);
      const pdfBuffer = await this.generatePDF(customer, transactions);
      
      console.log('Sending email to:', email);
      const mailOptions = {
        from: `Bank Teller App <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `Account Statement - ${customer.accountNumber}`,
        text: `Please find attached your account statement for account ${customer.accountNumber}.`,
        html: `
          <h2>Account Statement</h2>
          <p>Dear ${customer.name},</p>
          <p>Please find attached your account statement for account ${customer.accountNumber}.</p>
          <p>Current Balance: $${customer.balance.toFixed(2)}</p>
          <p>Thank you for banking with us!</p>
        `,
        attachments: [{
          filename: `statement_${customer.accountNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }]
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return { messageId: info.messageId, status: 'sent' };
    } catch (error) {
      console.error('Email service error:', error);
      throw error;
    }
  }

  async sendTestEmail(email) {
    if (!this.transporter) {
      this.initialize();
    }

    const mailOptions = {
      from: `Bank Teller App <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Test Email from Bank Teller App',
      text: 'This is a test email to verify email integration.',
      html: '<h1>Test Email</h1><p>This is a test email to verify email integration.</p>'
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Test email sent:', info.messageId);
      return { messageId: info.messageId, status: 'sent' };
    } catch (error) {
      console.error('Test email error:', error);
      throw error;
    }
  }

  async generatePDF(customer, transactions) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const chunks = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Add content to PDF
        doc.fontSize(20).text('Account Statement', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Name: ${customer.name}`);
        doc.text(`Account Number: ${customer.accountNumber}`);
        doc.text(`Account Type: ${customer.accountType}`);
        doc.text(`Current Balance: $${customer.balance.toFixed(2)}`);
        doc.moveDown();

        // Add transactions table
        const tableTop = 200;
        let yPosition = tableTop;

        // Add table headers
        doc.text('Date', 50, yPosition);
        doc.text('Description', 150, yPosition);
        doc.text('Amount', 350, yPosition);
        doc.text('Balance', 450, yPosition);

        // Add transactions
        transactions.forEach((transaction, index) => {
          yPosition = tableTop + (index + 1) * 30;
          
          if (yPosition > 700) {
            doc.addPage();
            yPosition = 50;
          }

          doc.text(new Date(transaction.date).toLocaleDateString(), 50, yPosition);
          doc.text(`${transaction.type}${transaction.description ? ` - ${transaction.description}` : ''}`, 150, yPosition);
          doc.text(`$${transaction.amount.toFixed(2)}`, 350, yPosition);
          doc.text(`$${transaction.balanceAfter.toFixed(2)}`, 450, yPosition);
        });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  async sendTransactionReceipt(transaction, customer, email) {
    if (!this.transporter) {
      this.initialize();
    }

    try {
      const pdfBuffer = await this.generateTransactionReceipt(transaction, customer);
      
      const mailOptions = {
        from: `Bank Teller App <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `Transaction Receipt - ${transaction.transactionId}`,
        html: `
          <h2>Transaction Receipt</h2>
          <p>Dear ${customer.name},</p>
          <p>Thank you for your transaction. Please find your receipt attached.</p>
          <p>Transaction Details:</p>
          <ul>
            <li>Type: ${transaction.type}</li>
            <li>Amount: $${transaction.amount.toFixed(2)}</li>
            <li>New Balance: $${transaction.balanceAfter.toFixed(2)}</li>
            <li>Date: ${new Date(transaction.date).toLocaleString()}</li>
          </ul>
        `,
        attachments: [{
          filename: `receipt_${transaction.transactionId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }]
      };

      const info = await this.transporter.sendMail(mailOptions);
      return { messageId: info.messageId, status: 'sent' };
    } catch (error) {
      console.error('Receipt email error:', error);
      throw error;
    }
  }

  async generateTransactionReceipt(transaction, customer) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const chunks = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Add content to PDF
        doc.fontSize(20).text('Transaction Receipt', { align: 'center' });
        doc.moveDown();

        // Add bank info
        doc.fontSize(12).text('Bank Teller System');
        doc.text(new Date().toLocaleString());
        doc.moveDown();

        // Format transaction ID
        const formattedTxnId = transaction._id.toString().replace(/^[0-9a-f]{24}$/, id => `TXN${id.substr(-6).toUpperCase()}`);

        // Add transaction details
        const details = [
          ['Transaction ID:', formattedTxnId],
          ['Customer Name:', customer.name],
          ['Account Number:', customer.accountNumber],
          ['Transaction Type:', transaction.type.toUpperCase()],
          ['Amount:', `$${transaction.amount.toFixed(2)}`],
          ['New Balance:', `$${transaction.balanceAfter.toFixed(2)}`],
          ['Date:', new Date(transaction.date).toLocaleString()]
        ];

        if (transaction.description) {
          details.push(['Description:', transaction.description]);
        }

        let yPos = doc.y + 20;
        details.forEach(([label, value]) => {
          doc.text(label, 50, yPos);
          doc.text(value, 200, yPos);
          yPos += 25;
        });

        doc.moveDown(2);
        doc.fontSize(10).text('Thank you for banking with us!', { align: 'center' });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new EmailService(); 