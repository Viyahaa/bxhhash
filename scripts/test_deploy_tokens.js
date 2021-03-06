

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');





async function main() {

  const feeAdrr = hre.network.config.bxh.address.fee;
  console.log("fee to :",feeAdrr);

  const addrs =  hre.network.config.bxh.address;


  const accounts = await ethers.getSigners();

 
  const HUSD = await hre.ethers.getContractFactory("HRC20HUSD");

  const husd = await HUSD.attach(addrs.husd);

  console.log("HUSD attached to:", husd.address);

  await husd.issue(accounts[0].address,10000000);

  const balance = await husd.balanceOf(accounts[0].address);


  console.log("HUSD.balance=:",balance);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
