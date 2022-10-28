var MyContract = artifacts.require("Zombies");
module.exports = async function (deployer, _network, _account) {
  // deploy a contract
  await deployer.deploy(MyContract,"Zombies","ZBS");
  //access information about your deployed contract instance
  // const instance = await MyContract.deployed();
  // console.log(instance);
};
