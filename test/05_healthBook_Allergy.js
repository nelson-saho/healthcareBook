/* To test NonVariableExamination contract
First of all add doctor and patient and add tne non variable examination*/

var Patient = artifacts.require("Patient");

chai = require("chai");
chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
expect = chai.expect;

contract("Test the Patient contract", function(accounts) {
    let [salim, esperance, malory] = accounts;
    // Deploy the contract
    describe("Deploy the Patient smart contract", function() {
        it("Catch an instance of the Patient contract", function() {
            return Patient.new().then(function(instance) {
                patientContract = instance;
            });
        });
    });
    //Add Doctors
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
    // Add patients
    describe("Check Patient function adding", function() {
        it("Call the function addPatient for Fabrice", function() {
            return patientContract.addPatient("Fabrice", "Adjaffon", "F", "Togbin", {"from": salim}).then(function(res) {
                expect(res).to.not.be.an("error");
            });
        });
        it("Call the function addPatient for Odette", function() {
            return patientContract.addPatient("Odette", "Adjaffon", "F", "Togbin", {"from": esperance}).then(function(res) {
                expect(res).to.not.be.an("error");
            });
        });
        it("Call the function addPatient for Bertho", function() {
            return patientContract.addPatient("Bertho", "Ganta", "M", "Agla", {"from": salim}).then(function(res) {
                expect(res).to.not.be.an("error");
            });
        });
    });

    describe("Try to add an allergy of patients", function() {
        it("Add an allergy of Odette", function() {
            return patientContract.addAllergy(2, "Body allergy", "burns on the skin black spot", 1, {"from": salim}).then(function(res) {
                expect(res).to.not.be.an("error");
            });
        });
        it("Add an allergy of Odette", function() {
            return patientContract.addAllergy(3, "Body allergy", "the skin itches", 1, {"from": esperance}).then(function(res) {
                expect(res).to.not.be.an("error");
            });
        });
        it("Add an allergy of Bertho", function() {
            return patientContract.addAllergy(2, "Body allergy", "burns on the skin (stomach)", 2, {"from": esperance}).then(function(res) {
                expect(res).to.not.be.an("error");
            });
        });
        it("Add an allergy of Fabrice with a non doctor", function() {
            return expect(patientContract.addAllergy(2, "Body allergy", "burns on the skin (stomach)", 0, {"from": malory}))
            .to.be.eventually.rejected;
        });
        it("Try to get allergies of Odette", function() {
            return patientContract.getAllergies(1).then(function(res) {
                expect(res).to.have.lengthOf(2);
                //console.log(res);
            });
        });
        it("Try to get allergies of Bertho", function() {
            return patientContract.getAllergies(2).then(function(res) {
                expect(res).to.have.lengthOf(1);
                //console.log(res);
            });
        });
        it("Try to get allergies of Fabrice", function() {
            return patientContract.getAllergies(0).then(function(res) {
                expect(res).to.have.lengthOf(0);
                //console.log(res);
            });
        });
    });
})