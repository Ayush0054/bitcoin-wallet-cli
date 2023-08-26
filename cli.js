const fs = require("fs");
const ecc = require("tiny-secp256k1");
const { BIP32Factory } = require("bip32");
const bip32 = BIP32Factory(ecc);
const bip39 = require("bip39");
const bitcoin = require("bitcoinjs-lib");
const wallet = require("./api/wallet.js");
 const transactions = require("./api/transaction.js");
const { Command } = require("commander");
const dotenv = require("dotenv");
dotenv.config();

const program = new Command();
program.version("1.0.0");



program
  .command("create <walletName>")
  .description("Create a new BIP39 wallet")
  .action(async (walletName) => {
    const mnemonic = bip39.generateMnemonic();
    console.log("mnemonic", mnemonic);
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed,bitcoin.networks.testnet);
    const addressNode = root.derivePath(`m/44'/1'/0'/1/0`);
    const publicKey = addressNode.publicKey;
    const address = bitcoin.payments.p2pkh({ pubkey: publicKey ,network: bitcoin.networks.testnet}).address;
  
   wallet.createNormalWallet(walletName, address);
   wallet.saveWallet(walletName, mnemonic,address);
    console.log(`Wallet '${walletName}' , '${address}' created.`);
  });

program
  .command("import <walletName> <mnemonic>")
  .description("Import a wallet using a BIP39 mnemonic, enter mnemonic in double quotes")
  .action((walletName, mnemonic) => {
    console.log("mnemonic", mnemonic);
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed,bitcoin.networks.testnet);
    const addressNode = root.derivePath(`m/44'/1'/0'/1/0`);
    const publicKey = addressNode.publicKey;
    const address = bitcoin.payments.p2pkh({ pubkey: publicKey ,network: bitcoin.networks.testnet}).address;
    wallet.createNormalWallet(walletName, address);
    wallet.saveWallet(walletName, mnemonic, address);
    console.log(`Wallet '${walletName}' imported.`);
  });

program
  .command("list")
  .description("List all wallets")
  .action(() => {
    const wallets =  wallet.listWallets();
    console.log("Wallets:");
    wallets.forEach((wallet) => console.log(wallet));
  });

program
  .command("balance <walletName>")
  .description("Get Bitcoin balance of a wallet")
  .action(async (walletName) => {
    const address = await  wallet.loadWalletaddress(walletName);
    const balance = await  wallet.getWalletBalance(address);
    
    console.log(`Balance of wallet '${walletName}': ${balance} satoshis`);
  });

  program
  .command("addrs <walletName>")
  .description("Get all addresses of a wallet")
  .action(async (walletName) => {
    const address = await wallet.getWalletAddresses(walletName);
    console.log( address);
  });
  program
  .command("transaction <walletName>")
  .description("Get transactions of a wallet")
  .action(async (walletName) => {
    const address = await  wallet.loadWalletaddress(walletName);
    const transaction = await  transactions.getTransactionInfo(address);
 
    transactions.formatTransactionInfo(transaction);
  });
program
  .command("unused-address <walletName>")
  .description("Generate an unused Bitcoin address for a wallet")
  .action(async (walletName) => {
    const address = await  wallet.getUnusedAddress(walletName);
    wallet.saveWalletaddress(walletName, address);
    console.log(`Unused address for wallet '${walletName}': ${address}`);
  });

program.parse(process.argv);
