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

async function betBear(Epoch){
    let account = await web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    let PredictionContract = process.env.PANCAKE_REDICTION_CONTRACT;
    let betBear = await PancakePredictionContract.methods.betBear(Epoch).encodeABI();
    await sendTx(account, PredictionContract, betBear, process.env.BET_AMOUNT);
}
async function betBull(Epoch){
    let account = await web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    let PredictionContract = process.env.PANCAKE_REDICTION_CONTRACT;
    let betBull = await PancakePredictionContract.methods.betBull(Epoch).encodeABI();
    await sendTx(account, PredictionContract, betBull, process.env.BET_AMOUNT);
}
async function claim(Epoch){
    let account = await web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    let PredictionContract = process.env.PANCAKE_REDICTION_CONTRACT;
    let claimWinner = await PancakePredictionContract.methods.claim(Epoch).encodeABI();
    await sendTx(account, PredictionContract, claimWinner);
}

async function sendTx(account, destinationContract, txData, value)
{
    const count = await web3.eth.getTransactionCount(account.address, "pending");
    const tx = {
        from        : account.address, 
        to          : destinationContract, 
        value       : web3.utils.toWei(value.toString(), 'ether'),
        gas         : web3.utils.numberToHex(100000),
        gasPrice    : web3.utils.numberToHex(web3.utils.toWei('3', 'gwei')),
        data        : txData ,
        nonce       : count
      }; 
      try{
      await web3.eth.accounts.signTransaction(tx, account.privateKey).then(tx => {
        var rawTx = tx.rawTransaction;  
        try{
            web3.eth.sendSignedTransaction(rawTx).on('transactionHash', (receipt) => {
                console.log(receipt);
            });
        }catch(err){}
        });
    }catch(err){}

}

module.exports = {getEpoch, getRound, isWin};