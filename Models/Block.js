var SHA256 = require('crypto-js/sha256');

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

  hasValidTransactions(){
    for(const transaction of this.transactions){
      if(transaction.isValid()){
        return false;
      }
    }
    return true;
  }
}

module.exports = Block;
