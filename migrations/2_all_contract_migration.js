/*var Allergy = artifacts.require("./Allergy.sol");
var Doctor = artifacts.require("./Doctor.sol");
var Examination = artifacts.require("./Examination.sol");
var NonVariableExamination = artifacts.require("./NonVariableExamination.sol");*/
var Patient = artifacts.require("./Patient.sol");
/*var ResultExamination = artifacts.require("./ResultExamination.sol");
var ResultExaminationDetail = artifacts.require("./ResultExaminationDetail.sol");
var SafeMath = artifacts.require("./SafeMath.sol");
var SpecialtyMedicine = artifacts.require("./SpecialtyMedicine.sol");*/

module.exports = function(deployer) {
    /*deployer.deploy(SafeMath);
    deployer.deploy(SpecialtyMedicine);
    deployer.deploy(ResultExaminationDetail);
    deployer.deploy(NonVariableExamination);
    deployer.deploy(ResultExamination);
    deployer.deploy(Examination);
    deployer.deploy(Allergy);
    deployer.deploy(Doctor);*/
    deployer.deploy(Patient);
};