const Migrations = artifacts.require("Migrations");
// const CROWDBridge = artifacts.require('CROWDBridge');

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  // deployer.deploy(CROWDBridge, 2);
};
