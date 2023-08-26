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

const program = new Command();
program.version("1.0.0");

// Define wallet storage location
const WALLET_DIR = "./wallets";
if (!fs.existsSync(WALLET_DIR)) {
  fs.mkdirSync(WALLET_DIR);
}

// API configuration
const API_KEY = process.env.BLOCKCYPHER_API_KEY;
// const API_BASE_URL = "https://api.blockcypher.com/v1/btc/test3";
const API_BASE_URL = `https://api.blockcypher.com/v1/btc/main/wallets/hd?token=cf5bf695dd0d40e6b288b653115377b6`;

// Function to read/write wallets
const getWalletPath = (walletName) => `${WALLET_DIR}/${walletName}.json`;

const saveWallet = (walletName, mnemonic) => {
  const walletData = { mnemonic };
  fs.writeFileSync(getWalletPath(walletName), JSON.stringify(walletData));
};

const loadWallet = (walletName) => {
  const walletData = JSON.parse(fs.readFileSync(getWalletPath(walletName)));
  return walletData.mnemonic;
};

// Function to get wallet balance
const getWalletBalance = async (address) => {
  const response = await axios.get(
    `https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`
    // https://api.blockcypher.com/v1/bcy/test/addrs/${address}/balance
  );
  return response.data.balance;
};

// Function to list all wallets
const listWallets = () => {
  const files = fs.readdirSync(WALLET_DIR);
  return files.map((file) => file.replace(".json", ""));
};

// Function to generate an unused Bitcoin address
const getUnusedAddress = async (walletName) => {
  const url = `https://api.blockcypher.com/v1/btc/main/wallets/${walletName}/addresses/generate?token=${API_KEY}`;

  try {
    const response = await axios.post(url);
    // console.log("response", response);
    console.log("response data", response.data);
    return response.data.address;
  } catch (error) {
    throw error;
  }
};
const getAddress = async () => {
  const url = `https://api.blockcypher.com/v1/btc/main/addrs?token=${API_KEY}`;

  try {
    const response = await axios.post(url);
    // console.log("response", response);
    console.log("response data", response.data);
    return response.data.address;
  } catch (error) {
    throw error;
  }
};

const createNormalWallet = async (name, addresses) => {
  console.log("addresses", addresses);
  const data = {
    name: name,
    address: addresses,
  };

  const response = await axios.post(
    `https://api.blockcypher.com/v1/btc/main/wallets?token=${API_KEY}`,
    data
  );

  return response.data;
};

program
  .command("create <walletName>")
  .description("Create a new BIP39 wallet")
  .action(async (walletName) => {
    const mnemonic = bip39.generateMnemonic();
    saveWallet(walletName, mnemonic);
    console.log(`Wallet '${walletName}' created.`);
  });

program
  .command("import <walletName> <mnemonic>")
  .description("Import a wallet using a BIP39 mnemonic")
  .action((walletName, mnemonic) => {
    saveWallet(walletName, mnemonic);
    console.log(`Wallet '${walletName}' imported.`);
  });

program
  .command("list")
  .description("List all wallets")
  .action(() => {
    const wallets = listWallets();
    console.log("Wallets:");
    wallets.forEach((wallet) => console.log(wallet));
  });

program
  .command("balance <walletName>")
  .description("Get Bitcoin balance of a wallet")
  .action(async (walletName) => {
    const mnemonic = loadWallet(walletName);
    const address = await getUnusedAddress();
    const balance = await getWalletBalance(address);
    console.log(`Balance of wallet '${walletName}': ${balance} satoshis`);
  });

program
  .command("unused-address <walletName>")
  .description("Generate an unused Bitcoin address for a wallet")
  .action(async (walletName) => {
    const mnemonic = loadWallet(walletName);
    const address = await getUnusedAddress(walletName);
    console.log(`Unused address for wallet '${walletName}': ${address}`);
  });

program.parse(process.argv);
