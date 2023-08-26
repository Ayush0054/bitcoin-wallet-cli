const fs = require("fs");
const axios = require("axios");
const ecc = require("tiny-secp256k1");
const { BIP32Factory } = require("bip32");
const bip32 = BIP32Factory(ecc);
const bip39 = require("bip39");
const bitcoin = require("bitcoinjs-lib");
const { Command } = require("commander");
const dotenv = require("dotenv");
dotenv.config();

  exports.getTransactionInfo = async (address) => {
    const url = `https://api.blockcypher.com/v1/btc/test3/addrs/${address}`;
    
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  exports.formatTransactionInfo = (transactionInfo) => {
    console.log("Address:", transactionInfo.address);
    console.log("Total Received:", transactionInfo.total_received);
    console.log("Total Sent:", transactionInfo.total_sent);
    console.log("Balance:", transactionInfo.balance);
    console.log("Unconfirmed Balance:", transactionInfo.unconfirmed_balance);
    console.log("Final Balance:", transactionInfo.final_balance);
    console.log("Number of Transactions:", transactionInfo.n_tx);
    console.log("Unconfirmed Number of Transactions:", transactionInfo.unconfirmed_n_tx);
    console.log("Final Number of Transactions:", transactionInfo.final_n_tx);
  
    console.log("Transaction History:");
    {
      transactionInfo.txrefs?
      transactionInfo.txrefs.forEach((tx, index) => {
        console.log(`Transaction ${index + 1}:`);
        console.log("  Transaction Hash:", tx.tx_hash);
        console.log("  Block Height:", tx.block_height);
        console.log("  Input Index:", tx.tx_input_n);
        console.log("  Output Index:", tx.tx_output_n);
        console.log("  Value:", tx.value);
        console.log("  Reference Balance:", tx.ref_balance);
        console.log("  Spent:", tx.spent);
        console.log("  Confirmations:", tx.confirmations);
        console.log("  Confirmed:", tx.confirmed);
        console.log("  Double Spend:", tx.double_spend);
      }) : console.log("No transaction history");
    }
  };