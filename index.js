require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.HTTP_RPC));
const { getEpoch, getRound, isWin } = require('./PancakeLib');

(async() => {
    
    while(true)
    {
        await new Promise(r => setTimeout(r, 10000));
        var timestampNow = Math.floor(Date.now() / 1000);
        var Epoch = await getEpoch();
        var RoundDetail = await getRound(Epoch);
        var startTimestamp = RoundDetail.startTimestamp;
        var lockTimestamp = RoundDetail.lockTimestamp;
        var closeTimestamp = RoundDetail.closeTimestamp;
        var totalAmount = RoundDetail.totalAmount;
        var bullAmount = RoundDetail.bullAmount; 
        var bearAmount = RoundDetail.bearAmount;
        var PercentageBetBull = (Number(bullAmount)/ Number(totalAmount) *100);
        var PercentageBetBear = (Number(bearAmount)/ Number(totalAmount) *100);
        var CloseBetIn = Number(lockTimestamp - timestampNow);
        var ClosedIn = Number(closeTimestamp - timestampNow);
        if(CloseBetIn < 10 && CloseBetIn > 0){
        if(PercentageBetBear > 50)
        {
            console.log(`Epoch : ${Epoch}`);
            console.log(`Session Closed Bet In : ${CloseBetIn}`);
            console.log(`Session Closed In : ${ClosedIn}`);
            console.log(`Percentage Bet : Bull ${PercentageBetBull}% | Bear ${PercentageBetBear}`);
            console.log("BET BEAR");
        }else if(PercentageBetBull > 50)
        {
            console.log(`Epoch : ${Epoch}`);
            console.log(`Session Closed Bet In : ${CloseBetIn}`);
            console.log(`Session Closed In : ${ClosedIn}`);
            console.log(`Percentage Bet : Bull ${PercentageBetBull}% | Bear ${PercentageBetBear}`);
            console.log("BET BULL");
        }
        }

        if(CloseBetIn < 30 && CloseBetIn > 0){
           
            var checkWinorLose = await isWin("0xdaa2fAA20484ef193F4678a802cEa58750638B2A", Number(Epoch) - 1);
            if(checkWinorLose == true){

            }
        }

    }

})()