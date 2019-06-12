const Transaction= require('./Models/Transaction')
const Block= require('./Models/Block')

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

  addTransaction(transaction){
    if(!transaction.fromAddress || !transaction.toAddress){
      throw new Error('Transaction must include from and to address');
    }

    if(!transaction.isValid()){
      throw new Error('Cannot add invalid transaction to chain');
    }
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

      if(!currentBlock.hasValidTransactions()){
        return false;
      }

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

module.exports = Blockchain;
