require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.HTTP_RPC));
const { getEpoch, getRound, isWin, betBull, betBear, claim } = require('./PancakeLib');

(async() => {
   
   while(true){
   await new Promise(r => setTimeout(r, 6000));
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
   console.log(CloseBetIn);
   if(CloseBetIn <= 20 && CloseBetIn >= 10){
   if(PercentageBetBear > 50)
   {
       console.log(`Epoch : ${Epoch}`);
       console.log(`Session Closed Bet In : ${CloseBetIn}`);
       console.log(`Session Closed In : ${ClosedIn}`);
       console.log(`Percentage Bet : Bull ${PercentageBetBull}% | Bear ${PercentageBetBear}`);
       console.log("BET BEAR");
       try{
       await betBear(Epoch);
       }catch(error){}
   }else if(PercentageBetBull > 50)
   {
       console.log(`Epoch : ${Epoch}`);
       console.log(`Session Closed Bet In : ${CloseBetIn}`);
       console.log(`Session Closed In : ${ClosedIn}`);
       console.log(`Percentage Bet : Bull ${PercentageBetBull}% | Bear ${PercentageBetBear}`);
       console.log("BET BULL");
       try{
       await betBull(Epoch);
       }catch(error){}
   }
   }

   if(CloseBetIn <= 30 && CloseBetIn >= 20){
      let account = await web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
      let checkWinorLose = await isWin(account.address,Epoch -1);
       console.log('Claiming!');
       if(checkWinorLose == true){
         await claim([Epoch - 1]);
       }
   }
   }
})()