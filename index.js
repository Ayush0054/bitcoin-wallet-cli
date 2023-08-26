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

// const program = new Command();
// program.version("1.0.0");

// // Define wallet storage location
// const WALLET_DIR = "./wallets";
// if (!fs.existsSync(WALLET_DIR)) {
//   fs.mkdirSync(WALLET_DIR);
// }

// // API configuration
// const API_KEY = process.env.BLOCKCYPHER_API_KEY;
// // const API_BASE_URL = "https://api.blockcypher.com/v1/btc/test3";
// const API_BASE_URL = `https://api.blockcypher.com/v1/btc/main/wallets/hd?token=cf5bf695dd0d40e6b288b653115377b6`;

// // Function to read/write wallets
// const getWalletPath = (walletName) => `${WALLET_DIR}/${walletName}.json`;

// const saveWallet = (walletName, mnemonic) => {
//   const walletData = { mnemonic };
//   fs.writeFileSync(getWalletPath(walletName), JSON.stringify(walletData));
// };

// const loadWallet = (walletName) => {
//   const walletData = JSON.parse(fs.readFileSync(getWalletPath(walletName)));
//   return walletData.mnemonic;
// };

// // Function to get wallet balance
// const getWalletBalance = async (address) => {
//   const response = await axios.get(`${API_BASE_URL}/addrs/${address}/balance`);
//   return response.data.balance;
// };

// // Function to list all wallets
// const listWallets = () => {
//   const files = fs.readdirSync(WALLET_DIR);
//   return files.map((file) => file.replace(".json", ""));
// };

// // Function to generate an unused Bitcoin address
// const getUnusedAddress = async (mnemonic) => {
//   const seedBuffer = await bip39.mnemonicToSeed(mnemonic);
//   const root = bip32.fromSeed(seedBuffer);

//   const accountIndex = 0; // You can change this as needed
//   const addressIndex = 0; // You can change this as needed

//   // Derive BIP44 purpose
//   const purpose = 44; // BIP44 purpose
//   const coinType = 1; // Bitcoin Testnet
//   const accountPath = `m/${purpose}'/${coinType}'/${accountIndex}'`;

//   const account = root.derivePath(accountPath);
//   const addressNode = account.derive(addressIndex);

//   const address = bitcoin.payments.p2pkh({
//     pubkey: addressNode.publicKey,
//   }).address;
//   return address;
// };

// // Create Wallet Command
// program
//   .command("create <walletName>")
//   .description("Create a new BIP39 wallet")
//   .action(async (walletName) => {
//     const mnemonic = bip39.generateMnemonic();
//     saveWallet(walletName, mnemonic);
//     console.log(`Wallet '${walletName}' created.`);
//   });

// // Import Wallet Command
// program
//   .command("import <walletName> <mnemonic>")
//   .description("Import a wallet using a BIP39 mnemonic")
//   .action((walletName, mnemonic) => {
//     saveWallet(walletName, mnemonic);
//     console.log(`Wallet '${walletName}' imported.`);
//   });

// // List Wallets Command
// program
//   .command("list")
//   .description("List all wallets")
//   .action(() => {
//     const wallets = listWallets();
//     console.log("Wallets:");
//     wallets.forEach((wallet) => console.log(wallet));
//   });

// // Get Balance Command
// program
//   .command("balance <walletName>")
//   .description("Get Bitcoin balance of a wallet")
//   .action(async (walletName) => {
//     const mnemonic = loadWallet(walletName);
//     const address = await getUnusedAddress(mnemonic);
//     const balance = await getWalletBalance(address);
//     console.log(`Balance of wallet '${walletName}': ${balance} satoshis`);
//   });

// // Unused Address Command
// program
//   .command("unused-address <walletName>")
//   .description("Generate an unused Bitcoin address for a wallet")
//   .action(async (walletName) => {
//     const mnemonic = loadWallet(walletName);
//     const address = await getUnusedAddress(mnemonic);
//     console.log(`Unused address for wallet '${walletName}': ${address}`);
//   });

// program.parse(process.argv);
// Generate a BIP39 mnemonic
// const mnemonic = bip39.generateMnemonic();

// // Derive the seed from the mnemonic
// const seed = bip39.mnemonicToSeedSync(mnemonic);

// // Create a BIP32 root key from the seed
// const root = bip32.fromSeed(seed);

// // Derive the BIP44 purpose key
// const purpose = 44; // BIP44 purpose for Bitcoin
// const coinType = 0; // Bitcoin Mainnet
// const purposeKey = root.derivePath(`m/${purpose}'/${coinType}'`);

// // Derive the account key using index 0 (you can change this)
// const accountIndex = 0;
// const accountKey = purposeKey.derive(accountIndex);

// // Generate the extended public key (xpub)
// const xpub = accountKey.neutered().toBase58();

// console.log("Mnemonic:", mnemonic);
// console.log("Extended Public Key (xpub):", xpub);

const API_KEY = "cf5bf695dd0d40e6b288b653115377b6"; // Replace with your actual API key

// const createHDWallet = async (name, xpub) => {
//   const data = {
//     name,
//     extended_public_key: xpub,
//   };

//   const response = await axios.post(
//     `https://api.blockcypher.com/v1/btc/main/wallets/hd?token=${API_KEY}`,
//     data
//   );

//   return response.data;
// };

// const generateBIP44Address = async (xpub, accountIndex, addressIndex) => {
//   const root = bip32.fromBase58(xpub);

//   const purpose = 44; // BIP44 purpose
//   const coinType = 1; // Bitcoin Mainnet
//   const change = 0; // External change for receiving addresses

//   const addressNode = root.derivePath(
//     `m/${purpose}'/${coinType}'/${accountIndex}'/${change}/${addressIndex}`
//   );

//   const publicKey = addressNode.publicKey;
//   const address = bitcoin.payments.p2pkh({ pubkey: publicKey }).address;

//   return address;
// };
const generateBIP44Addresses = async (walletName) => {
  // const url = `https://api.blockcypher.com/v1/bcy/test/wallets/${walletName}/addresses/generate?token=${API_KEY}`;
  //   const url = `https://api.blockcypher.com/v1/btc/test3/addrs`;
    const url = `https://api.blockcypher.com/v1/bcy/test/addrs?token=${API_KEY}`;

  try {
    const response = await axios.post(url);
    // console.log("response", response);
    console.log("response data", response.data.address);
    return response.data.address;
  } catch (error) {
    throw error;
  }
};
// const walletName = "ayush";
// generateBIP44Addresses(walletName);
// Example usage
// const walletName = "absa"; // Replace with the desired wallet name
// generateBIP44Addresses(walletName)
//   .then((generatedAddresses) => {
//     console.log("Generated Addresses:", generatedAddresses);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// Example usage
// const walletName = "ayushs7";
// createHDWallet(walletName, xpub)
//   .then(async (result) => {
//     console.log("Created HD Wallet:", result);

//     // Generate an address from the HD wallet
//     const generatedAddress = await generateBIP44Addresses(walletName);
//     console.log("Generated BIP44 Address:", generatedAddress);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// const createNormalWallet = async (name, addresses) => {
//   console.log("addresses", addresses);
//   const data = {
//     name: name,
//     address: addresses,
//   };

//   const response = await axios.post(
//     `https://api.blockcypher.com/v1/btc/main/wallets?token=${API_KEY}`,
//     data
//   );

//   return response.data;
// };

// const walletName = "absa1";
// const generatedAddress = generateBIP44Addresses();
// createNormalWallet(walletName, generatedAddress)
//   .then((result) => {
//     console.log(result);
//     console.log("address", generatedAddress);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// const mnemonic = bip39.generateMnemonic();

// const seed = bip39.mnemonicToSeedSync(mnemonic);
// const root = bip32.fromSeed(seed);
// const addressNode = root.derivePath(`m/44'/1'/0'/0/0`);
// const publicKey = addressNode.publicKey;
// const address = bitcoin.payments.p2pkh({ pubkey: publicKey }).address;

// console.log("address", `["${address}"]`);

// const createNormalWallet = async (walletName, address) => {
//   const data = {
//      name:walletName,
//      addresses:[address]
//   };

//   const url = `https://api.blockcypher.com/v1/bcy/test/wallets?token=${API_KEY}`;

//   try {
//     const response = await axios.post(url, JSON.stringify(data));
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// const walletName = "assfda"; // Replace with your desired wallet name
// const address = generateBIP44Addresses(walletName);
// createNormalWallet(walletName, address)
//   .then((result) => {
//     console.log("Imported Wallet:", result);
//   })
//   .catch((error) => {
//     console.error("Error:", error.message);
//   });
// Replace with your BlockCypher API key
const walletName = 'ayush'; // Replace with the name of the wallet

const getWalletTransactions = async (walletName) => {
  const url = `https://api.blockcypher.com/v1/bcy/test/wallets/${walletName}/txs?token=${API_KEY}`;

  try {
    const response = await axios.get(url);
    console.log("response", response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const printTransactions = (transactions) => {
  transactions.forEach((transaction) => {
    console.log('Transaction ID:', transaction.txid);
    console.log('Confirmations:', transaction.confirmations);
    console.log('Received:', transaction.received);
    console.log('Total Output Value:', transaction.total);
    console.log('Inputs:');
    transaction.inputs.forEach((input) => {
      console.log('  Address:', input.addresses[0]);
      console.log('  Value:', input.output_value);
    });
    console.log('Outputs:');
    transaction.outputs.forEach((output) => {
      console.log('  Address:', output.addresses[0]);
      console.log('  Value:', output.value);
    });
    console.log('------------------------------------');
  });
};

getWalletTransactions(walletName)
  .then((transactions) => {
    console.log('Bitcoin Transactions for Wallet:', walletName);
    console.log('------------------------------------');
    printTransactions(transactions);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
