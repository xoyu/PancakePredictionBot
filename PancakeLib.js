require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.HTTP_RPC));
const CONTRACT_ABI = require('./src/PancakePredictionABI.json');
const PancakePredictionContract = new web3.eth.Contract(CONTRACT_ABI, process.env.PANCAKE_REDICTION_CONTRACT);

async function getEpoch()
{   
    let getCurrentEpoch = await PancakePredictionContract.methods.currentEpoch().call();
    return getCurrentEpoch;
}
async function getRound(roundNumber)
{
    let getRound = await PancakePredictionContract.methods.rounds(roundNumber).call();
    return getRound;
}
async function isWin(address, roundNumber){
    let getRound = await PancakePredictionContract.methods.claimable(roundNumber, address).call();
    return getRound;
}

async function sendTx(account, destinationContract, txData)
{
    const count = await web3.eth.getTransactionCount(account.address, "pending");
    const tx = {
        from        : account.address, 
        to          : destinationContract, 
        value       : '0',
        gas         : web3.utils.numberToHex(100000),
        gasPrice    : web3.utils.numberToHex(web3.utils.toWei('3', 'gwei')),
        data        : txData ,
        nonce       : count
      }; 
      try{
      await web3.eth.accounts.signTransaction(tx, account.privateKey).then(tx => {
        var rawTx = tx.rawTransaction;  
            web3.eth.sendSignedTransaction(rawTx).on('transactionHash', (receipt) => {
                console.log(receipt);
            });
        });
    }catch(err){}

}

module.exports = {getEpoch, getRound, isWin};