const { Web3 } = require('web3'); // Updated import
const admin = require('firebase-admin');
const { Connection, clusterApiUrl } = require('@solana/web3.js');
const { CoinbaseClient } = require('@coinbase/coinbase-sdk');

// Initialize Web3 for Base chain (USDC)
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BASE_CHAIN_URL)); // Initialize Web3 with the provider URL
const BASE_CHAIN_USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'; // Replace with the actual USDC contract address on Base chain

// Initialize Solana connection for SOL
const solanaConnection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed'); // Change to the appropriate cluster if needed

// Payment settings for USDC and SOL
const PAYMENT_SETTINGS = {
  USDC: {
    base: {
      receivingAddress: process.env.USDC_BASE_RECEIVING_ADDRESS, // Your USDC receiving address on Base
      channelFee: parseFloat(process.env.BASE_CHANNEL_CREATION_FEE) || 0.1,  // Adjust fee as needed
      groupChatFee: parseFloat(process.env.BASE_GROUP_CHAT_FEE) || 0.05,
    },
  },
  SOL: {
    receivingAddress: process.env.USDC_SOLANA_RECEIVING_ADDRESS, // Your SOL receiving address on Solana
    channelFee: parseFloat(process.env.SOL_CHANNEL_CREATION_FEE) || 0.1, // Adjust fee as needed
    groupChatFee: parseFloat(process.env.SOL_GROUP_CHAT_FEE) || 0.05,
  }
};

// Function to verify USDC payment using Coinbase SDK for Base chain
async function verifyBaseChainPayment(userId, type, transactionHash) {
  try {
    // Fetch transaction details from Coinbase
    const transaction = await coinbaseClient.getTransaction(transactionHash);

    // Check if the transaction is valid and the amount is correct
    if (transaction && transaction.to.address === PAYMENT_SETTINGS.USDC.base.receivingAddress) {
      const amount = parseFloat(transaction.amount.amount); // Amount received

      if (
        (type === 'channel' && amount >= PAYMENT_SETTINGS.USDC.base.channelFee) ||
        (type === 'group' && amount >= PAYMENT_SETTINGS.USDC.base.groupChatFee)
      ) {
        // Update Firestore with payment status
        await admin.firestore().collection('users').doc(userId).update({
          [`${type}PaymentStatus`]: true,
          paymentTransaction: transactionHash,
          paymentCurrency: 'USDC', // Store which cryptocurrency was used
        });

        return { success: true, message: `Payment verified for ${type} using USDC on Base chain` };
      }
    }

    return { success: false, message: 'Payment not found or insufficient on Base chain' };
  } catch (error) {
    console.error('Base chain payment verification error:', error);
    return { success: false, message: 'Error verifying Base chain payment' };
  }
}

// Function to verify SOL payment on Solana
async function verifySolPayment(userId, type, transactionSignature) {
  try {
    const transaction = await solanaConnection.getTransaction(transactionSignature);
    if (!transaction) {
      throw new Error('Transaction not found.');
    }

    // Check if the transaction has SOL transfer
    const { meta } = transaction;
    const preBalances = meta.preBalances;
    const postBalances = meta.postBalances;

    const amountSent = postBalances[0] - preBalances[0]; // Calculate amount sent in SOL
    const solAmount = amountSent / 1e9; // Convert from lamports to SOL

    if (
      (type === 'channel' && solAmount >= PAYMENT_SETTINGS.SOL.channelFee) ||
      (type === 'group' && solAmount >= PAYMENT_SETTINGS.SOL.groupChatFee)
    ) {
      // Update Firestore with payment status
      await admin.firestore().collection('users').doc(userId).update({
        [`${type}PaymentStatus`]: true,
        paymentTransaction: transactionSignature,
        paymentCurrency: 'SOL', // Store which cryptocurrency was used
      });

      return { success: true, message: `Payment verified for ${type} using SOL on Solana` };
    }

    return { success: false, message: 'Payment not found or insufficient on Solana' };
  } catch (error) {
    console.error('Solana payment verification error:', error);
    return { success: false, message: 'Error verifying Solana payment' };
  }
}

// Main payment verification function
const verifyPayment = async (userId, type, transactionHashOrSignature, currency, blockchain) => {
  if (currency === 'USDC') {
    return await verifyBaseChainPayment(userId, type, transactionHashOrSignature);
  } else if (currency === 'SOL') {
    return await verifySolPayment(userId, type, transactionHashOrSignature);
  }
  return { success: false, message: 'Unsupported currency or blockchain type' };
};

module.exports = { verifyPayment };
