const SHA265 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}
class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = '';
        this.nonce = 0;
    }

    calculateHash() {
        return SHA265(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) != Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("block minned " + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block("10/09/2020", "Genesis block", "0");
    }

    getLastestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block successfuly mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ]
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previusBlock = this.chain[i - 1];
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false
            }
            if (currentBlock.previousHash !== previusBlock.hash) {
                return false
            }
            return true;
        }
    }

}

let romuloCoin = new Blockchain();
romuloCoin.createTransaction(new Transaction('address1', 'address2', 100));
romuloCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log('\n Starting the minner...');
romuloCoin.minePendingTransactions('romulos-address');

console.log('\n Balance of romulo is', romuloCoin.getBalanceOfAddress('romulos-address'))

console.log('\n Starting the minner again...');
romuloCoin.minePendingTransactions('romulos-address');

console.log('\n Balance of romulo is', romuloCoin.getBalanceOfAddress('romulos-address'))



