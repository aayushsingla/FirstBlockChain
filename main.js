var SHA256 = require('crypto-js/sha256');

class Transaction{
  constructor(fromAddress, toAddress, amount){
     this.fromAddress= fromAddress;
     this.toAddress = toAddress;
     this.amount = amount;
  }
}


class Block{
  constructor(timestamp,transaction,previousHash = ''){
    this.transaction = transaction;
    this.timestamp = timestamp;
    this.previousHash = previousHash;
    this.nonce=0;
    this.hash = this.calculateHash();
  }


  mineBlock(difficulty){
    while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
      this.nonce++;
      this.hash=this.calculateHash();
    }
    console.log("Mined Block's Address: "+this.hash);
  }

  calculateHash(){
    return SHA256(this.timestamp+JSON.stringify(this.data)+this.previousHash+this.nonce).toString();
  }
}


class Blockchain{
  constructor(){
    this.chain=[this.createGenesisBlock()];
    this.difficulty=5;
    this.pendingTransactions =[];
    this.miningReward=100;
  }


  createGenesisBlock(){
    return (new Block(0,'10/06/19','GenesisBlock','0'));
  }

  addBlock(newBlock){
    newBlock.previousHash=this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }
  //all pending transactions are added to the block here but cant be done in
  //real lifedue to limited to block size and huge number of pensing transactions
  minePendingTransactions(miningRewardAddress){
     let block = new Block(Date.now(), this.pendingTransactions);
     block.mineBlock(this.difficulty);
     console.log('Block Successfully mined');
     this.chain.push(block);

     this.pendingTransactions = [
       new Transaction(null, miningRewardAddress, this.miningReward)
     ];
  }

  createTransaction(transaction){
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address){
    let balance=0;
    for(const block of this.chain){
      for(const trans of block.transaction){
        if(trans.fromAddress === address){
          balance -= trans.amount;
        }

        if(trans.toAddress === address){
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  isChainValid(){
    for(var i=1;i<this.chain.length;i++){
      const currentBlock = this.chain[i];
      const lastBlock = this.chain[i-1];

      if(currentBlock.hash !== currentBlock.calculateHash()){
        return false;
      }

      if(currentBlock.previousHash !== lastBlock.hash){
        return false;
      }
      return true;
    }
  }

}


let firstBlockChain = new Blockchain();
firstBlockChain.createTransaction(new Transaction("address1","address2",100));
firstBlockChain.createTransaction(new Transaction("address2","address1",50));
console.log("starting miner.... \n");
firstBlockChain.minePendingTransactions('aayush');

console.log("balance of address1 "+firstBlockChain.getBalanceOfAddress("address1"));
console.log("balance of address2 "+firstBlockChain.getBalanceOfAddress("address1"));
//This should be zero as miner gets his award in the future transaction
console.log("balance of miner "+firstBlockChain.getBalanceOfAddress("aayush"));


firstBlockChain.minePendingTransactions('aayush');
console.log("balance of miner "+firstBlockChain.getBalanceOfAddress("aayush"));
