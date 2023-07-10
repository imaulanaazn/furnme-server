const Transaction = require('./model');
module.exports = {

    // Controller for creating a new transaction
    createTransaction : async (req, res) => {
    try {
        const {
        userId,
        products,
        paymentMethod,
        totalAmount,
        shippingAddress,
        billingAddress,
        additionalDetails,
        } = req.body;

        // Create a new transaction document
        const transaction = new Transaction({
        userId,
        products,
        paymentMethod,
        totalAmount,
        shippingAddress,
        billingAddress,
        additionalDetails,
        });

        // Save the transaction to the database
        const savedTransaction = await transaction.save();

        res.status(201).json(savedTransaction);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create transaction', error: err.message });
    }
    },

    // Controller for retrieving a specific transaction by ID
    getTransactionById : async (req, res) => {
    try {
        const { transactionId } = req.params;

        // Find the transaction by ID
        const transaction = await Transaction.findById(transactionId);

        if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
        }

        res.status(200).json(transaction);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch transaction', error: err.message });
    }
    },

    // Controller for retrieving all transactions
    getAllTransactions : async (req, res) => {
    try {
        // Retrieve all transactions
        const transactions = await Transaction.find();

        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch transactions', error: err.message });
    }
    },

}