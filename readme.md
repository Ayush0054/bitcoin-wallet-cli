### bitcoin cli script

### Tech Stack

- nodejs , commander , blockcyper api, bip 39, bip 32, bitcoinjs-lib

### Instructions for using locally

```diff
- Fork this repository
- install all required libraries by 'npm install' inside folder
- make .env file and paste this "BLOCKCYPHER_API_KEY=" with token from https://www.blockcypher.com/
- run 'node index.js' to get all commands
-  example to run an command:run 'node index.js create walletname' to create a new wallet
```

### Scripts:

&nbsp;

| Commands                   |  Description                                      | 
| ---------------------------| --------------------------------------------------|
|create walletname           |  Create a new BIP39 wallet.                       |
|import walletName "mnemonic"|  Import a wallet using a BIP39 mnemonic.          | 
|list                        |  List all wallets.                                |
|balance walletName          |  Get Bitcoin balance of a wallet.                 |
|addrs walletName            |  Get all addresses of a wallet.                   |
|transaction  walletName     |  Get transactions of a wallet.                    |
|unused-address  walletName  |  Generate an unused Bitcoin address for a wallet. |
