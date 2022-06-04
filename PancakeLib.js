require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.HTTP_RPC));
const CONTRACT_ABI = require('./PancakePredictionABI.json');
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
    let betingBear = await PancakePredictionContract.methods.betBear(Epoch).encodeABI();
    await sendTx(account, PredictionContract, betingBear, process.env.BET_AMOUNT);
}
async function betBull(Epoch){
    let account = await web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    let PredictionContract = process.env.PANCAKE_REDICTION_CONTRACT;
    let betingBull = await PancakePredictionContract.methods.betBull(Epoch).encodeABI();
    await sendTx(account, PredictionContract, betingBull, process.env.BET_AMOUNT);
}
async function claim(Epoch){
    let account = await web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    let PredictionContract = process.env.PANCAKE_REDICTION_CONTRACT;
    let claimWinner = await PancakePredictionContract.methods.claim(Epoch).encodeABI();
    await sendTx(account, PredictionContract, claimWinner, 0);
}

async function sendTx(account, destinationContract, txData, value)
{
    const count = await web3.eth.getTransactionCount(account.address, "pending");
    const tx = {
        from        : account.address, 
        to          : destinationContract, 
        value       : web3.utils.toWei(value.toString(), 'ether'),
        gas         : web3.utils.numberToHex(150000),
        gasPrice    : web3.utils.numberToHex(web3.utils.toWei('5', 'gwei')),
        data        : txData ,
        nonce       : count
      }; 
        let txs = await web3.eth.accounts.signTransaction(tx, account.privateKey)
        var rawTx = txs.rawTransaction;  
        try{
        let tx = await web3.eth.sendSignedTransaction(rawTx);
        console.log(tx);
        }catch(err){console.log(err)}


}

module.exports = {getEpoch, getRound, isWin, betBear, betBull, claim};