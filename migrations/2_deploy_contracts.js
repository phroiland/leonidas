var Leonidas = artifacts.require("contracts/Leonidas.sol");

module.exports = function(deployer) {
  deployer.deploy(Leonidas);
};