var SHA256 = require('crypto-js/sha256');

class Block{
  constructor(index,timestamp,data,previousHash = ''){
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce=0;
    this.hash = this.calculateHash();
  }


  mineBlock(difficulty){
    while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
      this.nonce++;
      this.hash=this.calculateHash();
    }
  }

  calculateHash(){
    return SHA256(this.index+this.timestamp+JSON.stringify(this.data)+this.previousHash+this.nonce).toString();
  }
}


class Blockchain{
  constructor(){
    this.chain=[this.createGenesisBlock()];
    this.difficulty=2;
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
console.log("mining block 1.....");
firstBlockChain.addBlock(new Block(1,'11/06/19',{amount: 10},''));
console.log(firstBlockChain.getLatestBlock());
console.log("mining block 2.....");
firstBlockChain.addBlock(new Block(2,'12/06/19',{amount: 200},''));
console.log(firstBlockChain.getLatestBlock());
