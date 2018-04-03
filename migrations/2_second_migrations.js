var Certificates = artifacts.require("./certificate.sol");

module.exports = function(deployer) {
  deployer.deploy(Certificates);
};
