var Blockchain = require("./Blockchain");
var Transaction= require('./Models/Transaction')
var EC = require('elliptic').ec;
var ec = new EC('secp256k1');

const mykey= ec.keyFromPrivate('2e677deeb7e7c0e09f9d107e6991bff6c998e71c8d409a0d9a6699a78e1a4a1e');
const myWalletAddress= mykey.getPublic('hex');

let firstBlockChain = new Blockchain();
//console.log('wallet address:',myWalletAddress);
//console.log('My key:',mykey);

const tx1 = new Transaction(myWalletAddress,"public key reciever",10);
tx1.signTransaction(mykey);
firstBlockChain.addTransaction(tx1);
console.log("starting miner.... \n");
firstBlockChain.minePendingTransactions(myWalletAddress);
console.log("balance of miner "+firstBlockChain.getBalanceOfAddress(myWalletAddress));
firstBlockChain.minePendingTransactions(myWalletAddress);
console.log("balance of miner "+firstBlockChain.getBalanceOfAddress(myWalletAddress));
