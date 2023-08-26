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


const WALLET_DIR = "./wallets";
if (!fs.existsSync(WALLET_DIR)) {
  fs.mkdirSync(WALLET_DIR);
}

const API_KEY = process.env.BLOCKCYPHER_API_KEY;


const getWalletPath = (walletName) => `${WALLET_DIR}/${walletName}.json`;


exports.saveWallet = (walletName, mnemonic,address) => {
  const walletData = { mnemonic:mnemonic ,addresses : [address] };
  console.log("walletData", walletData);
  fs.writeFileSync(getWalletPath(walletName), JSON.stringify(walletData));
};


exports.saveWalletaddress = (walletName, newaddress) => {
  const walletPath = getWalletPath(walletName);
  const existingWalletData = JSON.parse(fs.readFileSync(walletPath, 'utf8'));
  existingWalletData.addresses.push(newaddress);
  fs.writeFileSync(walletPath, JSON.stringify(existingWalletData, null, 2));
}

exports.loadWalletaddress = (walletName) => {
  const walletData = JSON.parse(fs.readFileSync(getWalletPath(walletName)));
  return walletData.addresses[0];
};

exports.createNormalWallet = async (walletName, address) => {
    console.log("address", address);
    const data = {
      name: walletName,
      addresses: [address],
    };
    console.log(JSON.stringify(data));
    const url = `https://api.blockcypher.com/v1/btc/test3/wallets?token=${API_KEY}`;
  
    try {
      const response = await axios.post(url, JSON.stringify(data));
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  exports.listWallets = () => {
    const files = fs.readdirSync(WALLET_DIR);
    return files.map((file) => file.replace(".json", ""));
  };

  exports.getUnusedAddress = async (walletName) => {
    const url = `https://api.blockcypher.com/v1/btc/test3/wallets/${walletName}/addresses/generate?token=${API_KEY}`;
  
    try {
      const response = await axios.post(url);
    
      console.log("response data", response.data);
      return response.data.address;
    } catch (error) {
      throw error;
    }
  };
  exports.getWalletAddresses = async (walletName) => {
    const API_KEY = "4fa2584cbbce4a5dbd00c5dac8283dad";
    const url = `https://api.blockcypher.com/v1/btc/test3/wallets/${walletName}/addresses?token=${API_KEY}`;
  
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  exports.getWalletBalance = async (address) => {
    const response = await axios.get(
      `https://api.blockcypher.com/v1/btc/test3/addrs/${address}/balance`
    
    );
    return response.data.balance;
  };
  