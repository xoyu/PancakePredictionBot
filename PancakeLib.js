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
async function isWin(address, Epoch){
    let getRound = await PancakePredictionContract.methods.rounds(roundNumber).call();
    return getRound;
}

module.exports = {getEpoch, getRound, isWin};