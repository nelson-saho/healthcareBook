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

    describe("Test examination of Patient", function() {
        it("Order an examination to Fabrice", function() {
            return patientContract.orderAnExamination(0, 10, "CV-19", "Corona virus", "2020-06-12", {"from": salim}).then(function(res) {
                expect(res).to.not.be.an("error");
            });
        });
        it("Order an examination to Fabrice", function() {
            return patientContract.orderAnExamination(0, 11, "RD", "Left leg x-ray", "2020-06-12", {"from": salim}).then(function(res) {
                expect(res).to.not.be.an("error");
            });
        });
        it("Order an examination to Odette", function() {
            return patientContract.orderAnExamination(1, 12, "CV-19", "Corona virus", "2020-06-12", {"from": salim}).then(function(res) {
                expect(res).to.not.be.an("error");
            });
        });
        it("Order an examination to Bertho", function() {
            return patientContract.orderAnExamination(2, 13, "CV-19", "Corona virus", "2020-06-12", {"from": salim}).then(function(res) {
                expect(res).to.not.be.an("error");
            });
        });

        it("Get all examination ordered to Fabrice", function() {
            return patientContract.allExaminationOrderToPatient(0).then(function(res) {
                expect(res).to.have.lengthOf(2);
            });
        });
        it("Get all examination ordered to Odette", function() {
            return patientContract.allExaminationOrderToPatient(1).then(function(res) {
                expect(res).to.have.lengthOf(1);
            });
        });
        it("Get all examination ordered to Bertho", function() {
            return patientContract.allExaminationOrderToPatient(2).then(function(res) {
                expect(res).to.have.lengthOf(1);
            });
        });

        it("Record examination result", function() {
            return patientContract.addResultOfOrderExamination(1, 10, "N4", "Negative result", "2020-06-30", {"from": salim}).then(function(res) {
                expect(res).to.not.be.an("error");
            });
        });
        it("Record examination result", function() {
            return patientContract.addResultOfOrderExamination(2, 11, "P4", "slight fracture. Immobilize the leg for two weeks", "2020-06-30", {"from": salim}).then(function(res) {
                expect(res).to.not.be.an("error");
            });
        });
        it("Record examination result", function() {
            return patientContract.addResultOfOrderExamination(3, 12, "N4", "Negative result", "2020-06-30", {"from": salim}).then(function(res) {
                expect(res).to.not.be.an("error");
            });
        });
        it("Record examination result", function() {
            return patientContract.addResultOfOrderExamination(4, 13, "N4", "Negative result", "2020-06-30", {"from": salim}).then(function(res) {
                expect(res).to.not.be.an("error");
            });
        });
        it("Add result detail", function() {
            return patientContract.addResultDetailExamination(2, "Radio waves", "Senyon Laboratory", "fracture depth 5 mm", "N/A", {"from": salim}).then(function(res) {
                expect(res).to.not.be.an("error");
            });
        });
    });
})