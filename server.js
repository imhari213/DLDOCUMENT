var Pudding = require("ether-pudding");
var Web3 = require('web3');
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
var contractData = require("./build/contracts/certificate.json")
Pudding.save(contractData,"./Demoone.sol.js")
.then(function (err,res) {
       if(err){
           console.log(err)
        }
        else{
            console.log("success");
        }

    });
