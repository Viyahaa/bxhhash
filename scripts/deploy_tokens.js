

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
  const factory = await UniswapV2Factory.deploy(feeAdrr);
  await factory.deployed();
  // const factory = await UniswapV2Factory.attach(addrs.uniswap.factory);

  console.log("factory deployed to:", factory.address);

  // await factory.setFeeTo(feeAdrr);

  // console.log("factory setfee to:", feeAdrr);


  const BXHPool = await hre.ethers.getContractFactory("BXHPool");
  const bxhpool = await BXHPool.deploy(bxh.address,42,0,970);
  await bxhpool.deployed();
  console.log("BXHPool deployed to:", bxhpool.address);


  const Airdrop = await hre.ethers.getContractFactory("Airdrop");
  const airdrop = await Airdrop.deploy(usdt.address,bxh.address);
  await airdrop.deployed();
  console.log("Airdrop deployed to:", airdrop.address);


  console.log("factory fee to:", await factory.feeTo());

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
