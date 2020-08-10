var Doctor = artifacts.require("Doctor");

chai = require("chai");
chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
expect = chai.expect;

contract("Test the Doctor contract", function(accounts) {
  let [salim, malory] = accounts;

  describe("Deploy the Doctor smart contract", function() {
    it("Catch an instance of the Doctor contract", function() {
      return Doctor.new().then(function(instance) {
        doctorContract = instance;
      });
    });
  });

  describe("Check Doctor function", function() {
    it("Add doctor Salim", function() {
      return doctorContract.addDoctor("Salim", "Diatema", "CNHU", salim).then(function(res) {
        expect(res).to.not.be.an("error");
      });
    });
    it("Check firstname of doctor", function() {
      return doctorContract.doctors(0).then(function(res) {
        expect(res.firstName.toString()).to.be.equal("Salim");
      });
    });
    it("Call the function addDoctor to add Josias - should fail because of the sender", function() {
      return expect(doctorContract.addDoctor("Josias", "Gbetoho", "CNHU", malory, {"from": accounts[9]}))
      .to.be.eventually.rejected;
    });
  });
})