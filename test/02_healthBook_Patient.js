var Patient = artifacts.require("Patient");

chai = require("chai");
chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
expect = chai.expect;

contract("Test the Patient's adding", function(accounts) {
    let [salim, esperance, malory] = accounts;

    describe("Deploy the Patient smart contract", function() {
        it("Catch an instance of the Patient contract", function() {
            return Patient.new().then(function(instance) {
                patientContract = instance;
            });
        });
    });

    describe("Add doctors", function() {
        it("Add doctor Salim", function() {
            return patientContract.addDoctor("Salim", "Diatema", "CNHU", salim).then(function(res) {
                expect(res).to.not.be.an("error");
            });
        });   
        it("Add doctor Espérance", function() {
            return patientContract.addDoctor("Espérance", "Assani", "Homel", esperance).then(function(res) {
                expect(res).to.not.be.an("error");
            });
        });
    });

    describe("It checks if someone is a doctor", function() {
        it("It checks salim doctorCount", function() {
            return patientContract.doctorCount(salim).then(function(res) {
                expect(res.toString()).to.be.equal("1");
            })
        });
    });

    describe("Check Patient function adding", function() {
        it("Call addPatient by non-doctor", function() {
            return expect(patientContract.addPatient("Fabrice", "Adjaffon", "F", "Togbin", {"from": malory}))
            .to.be.eventually.rejected;
        });
        it("Call the function addPatient for Fabrice", function() {
            return patientContract.addPatient("Fabrice", "Adjaffon", "F", "Togbin", {"from": salim}).then(function(res) {
                expect(res).to.not.be.an("error");
            });
        });
        it("Call the function addPatient for Bertho", function() {
            return patientContract.addPatient("Bertho", "Ganta", "M", "Agla", {"from": esperance}).then(function(res) {
                expect(res).to.not.be.an("error");
            });
        });
        it("print the first patient", function() {
            return patientContract.patients(0).then(function(res) {
                console.log(res);
            });
        });
        it("Call the function getAllPatient and check if the first name of the second patient is Bertho", function() {
            return patientContract.getAllPatient().then(function(res) {
                expect(res[1].firstName.toString()).to.be.equal("Bertho");
                //console.log(res); Affiche un tableau de patient
            });
        });
    });
})