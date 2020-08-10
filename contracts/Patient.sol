// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.7.0;
//pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "./SafeMath.sol";
import "./Doctor.sol";
import "./NonVariableExamination.sol";
import "./SpecialtyMedicine.sol";
import "./Allergy.sol";
import "./Examination.sol";

contract Patient is Doctor, NonVariableExamination, SpecialtyMedicine, Allergy, Examination {

    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;

    uint32 counterPatient = 0;

    struct PatientInfo {
        uint32 patientId;
        string firstName;
        string lastName;
        string gender;
        string addressOfPatient;
    }

    PatientInfo[] public patients;
    ExaminationInfo[] public orderExamination;
    SpecialtyMedicineInfo[] public allSpecialtyMedicine;
    AllergyInfo[] public allAllergies;

    event NewPatient(uint32 patientId, string firstName, string lastName);

    mapping (uint32 => address) patientCreatedBy;
    mapping (uint => NonVariableExaminationInfo) nonVariableExaminationOfPatient; // keep a non variable examination
    mapping (uint => uint) orderExaminationToPatientCount;
    mapping (uint => uint) specialtyMedicineToPatientCount;
    mapping (uint => uint) allergyPatientCount;
    mapping (uint => uint16) nonVariableExaminationOfPatientCount;

    function _createPatient(string memory _firstName,
        string memory _lastName,
        string memory _gender,
        string memory _addressOfPatient) private {
        counterPatient = counterPatient.add(1);
        uint32 idPatient = counterPatient.sub(1);
        patients.push(PatientInfo(idPatient, _firstName, _lastName, _gender, _addressOfPatient));
        patientCreatedBy[idPatient] = msg.sender;
        ownerPatientCount[msg.sender] = ownerPatientCount[msg.sender].add(1);
    }

    function addPatient(string memory _firstName,
        string memory _lastName,
        string memory _gender,
        string memory _addressOfPatient) public isDoctor(msg.sender) {
        _createPatient(_firstName, _lastName, _gender, _addressOfPatient);
        emit NewPatient(counterPatient.sub(1), _firstName, _lastName);
    }

    function getAllPatient() public view returns (PatientInfo[] memory) {
        return patients;
    }

    /* Record the non-variable biological examinations of a patient i.e blood group, rhesus, electrophoresis
    It records these parameters once time */
    function setNonVariableExamination(string memory _bloodGroup,
        string memory _rhesus,
        string memory _electrophoresis,
        uint _patientId) public isDoctor(msg.sender) {
        require(nonVariableExaminationOfPatientCount[_patientId] == 0, 'This patient has already non variable examination setting');
        nonVariableExaminationOfPatient[_patientId] = NonVariableExaminationInfo(_bloodGroup,
        _rhesus,
        _electrophoresis,
        _patientId);
        nonVariableExaminationOfPatientCount[_patientId] = nonVariableExaminationOfPatientCount[_patientId].add(1);
    }

    // Recover the non-variable biological examinations of a patient i.e blood group, rhesus, electrophoresis
    function getNonVariableExamination(uint _patientId) public view returns (NonVariableExaminationInfo memory){
        return nonVariableExaminationOfPatient[_patientId];
    }

    // Add a speciality medicine prescribe by the doctor to any patient
    function prescribeSpecialtyMedicine(uint _documentId,
        string memory _medicationCode,
        string memory _medicationName,
        string memory _normalStartDate,
        string memory _normalEndDate,
        string memory _DosageUnit,
        uint _DosageQuantity,
        string memory _prescriptionDate,
        string memory _observation,
        uint _patientId) public isDoctor(msg.sender) {
        allSpecialtyMedicine.push(SpecialtyMedicineInfo(_documentId,
            _medicationCode,
            _medicationName,
            _normalStartDate,
            _normalEndDate,
            _DosageUnit,
            _DosageQuantity,
            _prescriptionDate,
            _observation,
            _patientId));
        specialtyMedicineToPatientCount[_patientId] = specialtyMedicineToPatientCount[_patientId].add(1);
    }

    // During the use of the drug the patient noticed side effects. He reports them to the doctor who records them
    function setObservationAfterPrescription(uint _patientId,
        uint _documentId,
        string memory _medicationCode,
        string memory _observation) public isDoctor(msg.sender) returns (bool) {
        uint i;
        for(i = 0; i < allSpecialtyMedicine.length; i++) {
            if (allSpecialtyMedicine[i].patientId == _patientId &&
                allSpecialtyMedicine[i].documentId == _documentId &&
                keccak256(abi.encodePacked(allSpecialtyMedicine[i].medicationCode)) == keccak256(abi.encodePacked(_medicationCode))) {
                allSpecialtyMedicine[i].observation = string(abi.encodePacked(allSpecialtyMedicine[i].observation, " ",_observation));
                return true;
            }
        }
        if (i == allSpecialtyMedicine.length) {
            return false;
        }
    }

    // Get all medecide took by one patient
    function getAllPrescribeMedicine(uint _patientId) public view returns (SpecialtyMedicineInfo[] memory) {
        SpecialtyMedicineInfo[] memory allMedicine = new SpecialtyMedicineInfo[](specialtyMedicineToPatientCount[_patientId]);
        uint counter = 0;
        for(uint i = 0; i < allSpecialtyMedicine.length; i++) {
            if (allSpecialtyMedicine[i].patientId == _patientId) {
                allMedicine[counter] = allSpecialtyMedicine[i];
                counter = counter.add(1);
            }
        }
        return allMedicine;
    }

    // Add alergies record
    function addAllergy(uint _allergytId, string memory _allergyName, string memory _observation, uint _patientId) public isDoctor(msg.sender) {
        allAllergies.push(AllergyInfo(_allergytId,
            _allergyName,
            _observation,
            _patientId));
        allergyPatientCount[_patientId] = allergyPatientCount[_patientId].add(1);

    }

    // Get allergies of a patient through its Id
    function getAllergies(uint _patientId) public view returns (AllergyInfo[] memory) {
        AllergyInfo[] memory allAllergiesOfPatient = new AllergyInfo[](allergyPatientCount[_patientId]);
        uint counter = 0;
        for(uint i = 0; i < allAllergies.length; i++) {
            if (allAllergies[i].patientId == _patientId) {
                allAllergiesOfPatient[counter] = allAllergies[i];
                counter = counter.add(1);
            }
        }
        return allAllergiesOfPatient;
    }

    //Records a medical examination prescription made by a doctor
    function orderAnExamination(uint _patientId,
        uint _docExaminationId,
        string memory _codeExaminationName,
        string memory _examinationName,
        string memory _orderedDate) public isDoctor(msg.sender) {
        orderExamination.push(ExaminationInfo(_patientId,
        _docExaminationId,
        _codeExaminationName,
        _examinationName,
        _orderedDate));
        orderExaminationToPatientCount[_patientId] = orderExaminationToPatientCount[_patientId].add(1);
    }

    //Returns all the different medical exams prescribed to a given patient
    function allExaminationOrderToPatient(uint _patientId) public view returns (ExaminationInfo[] memory){
        ExaminationInfo[] memory myExaminations = new ExaminationInfo[](orderExaminationToPatientCount[_patientId]);
        uint counter = 0;
        for(uint i = 0; i < orderExamination.length; i++) {
            if (orderExamination[i].patientId == _patientId) {
                myExaminations[counter] = orderExamination[i];
                counter = counter.add(1);
            }
        }
        return myExaminations;
    }

    //Record the result of a prescribed medical examination
    function addResultOfOrderExamination(uint _docResultId,
        uint _docExaminationId,
        string memory _resultCode,
        string memory _codeResultName,
        string memory _observationDate) public isDoctor(msg.sender){
        resultOfAnExamination[_docExaminationId] = ResultExaminationInfo(_docResultId,
        _docExaminationId,
        _resultCode,
        _codeResultName,
        _observationDate);
    }

    //Recover the result of an examination prescribed by a doctor
    function getResultOfOrderExamination(uint _docExaminationId) public view returns (ResultExaminationInfo memory) {
        return resultOfAnExamination[_docExaminationId];
    }

    //Record the result detail of a prescribed medical examination
    function addResultDetailExamination(uint _docResultId,
        string memory _componentName,
        string memory _labName,
        string memory _resultValue,
        string memory _resultObservation) public isDoctor(msg.sender) {
        detailOfResultExamination[_docResultId] = ResultExaminationDetailInfo(_docResultId,
        _componentName,
        _labName,
        _resultValue,
        _resultObservation);
    }

    //Recover the result detail of an examination prescribed by a doctor
    function getResultDetailExamination(uint _docResultId) public view returns (ResultExaminationDetailInfo memory) {
        return detailOfResultExamination[_docResultId];
    }
}