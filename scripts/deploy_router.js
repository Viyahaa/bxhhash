

const hre = require("hardhat");
require("@nomiclabs/hardhat-waffle");
var Assert = require('assert');





async function main() {

  const feeAdrr = hre.network.config.bxh.address.fee;
  console.log("fee to :",feeAdrr);

  const addrs =  hre.network.config.bxh.address;

  const accounts = await ethers.getSigners();

  console.log("deploy account: " + accounts[0].address);
  const BXH = await hre.ethers.getContractFactory("BXHToken");
  // const bxh = await BXH.deploy();
  // await bxh.deployed();
  const bxh = await BXH.attach(addrs.bxh);

  console.log("BXH attached to:", bxh.address);


  const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");

  const usdt = await ERC20Template.attach(addrs.usdt);
  Assert.equal("USDT",await usdt.symbol(),"Contract Attach Error");
  console.log("USDT attached to:", usdt.address);


  const wht = await ERC20Template.attach(hre.network.config.bxh.address.wht);
  Assert.equal("WHT",await wht.symbol());
  console.log("WHT attached to:", wht.address);


  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  // const factory = await UniswapV2Factory.deploy(feeAdrr);
  // await factory.deployed();

  const factory = await UniswapV2Factory.attach(addrs.uniswap.factory);

  console.log("factory attached to:", factory.address);

  // await factory.setFeeTo(feeAdrr);

  const pairCodeHash = await factory.pairCodeHash();
  console.log("factory pairCodeHash is:", pairCodeHash);

  const UniswapV2Router02 = await hre.ethers.getContractFactory("UniswapV2Router02");
  const router = await UniswapV2Router02.deploy(factory.address,wht.address);
  await router.deployed();
  console.log("router deployed to:", router.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
