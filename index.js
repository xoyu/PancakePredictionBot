require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.HTTP_RPC));
const { getEpoch, getRound } = require('./PancakeLib');

(async() => {

    console.log(await getCurrentEpoch());

})()