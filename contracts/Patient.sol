// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
//pragma solidity ^0.6.0;
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

    uint32 public counterPatient = 0;
    uint public counterAllergy = 0;

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

    /*function getAllPatient() public view returns (PatientInfo[] memory) {
        return patients;
    }*/
    function isPatient(uint32 _patientId) public view returns (bool) {
        bool find;
        if (_patientId > counterPatient.sub(1)) {
            find = false;
        } else {
            find = true;
        }
        return find;
    }

    /*function getThePatient(uint32 _patientId) public view returns (PatientInfo memory) { 
        PatientInfo memory patient = patients[_patientId];
        return patient;
    }*/
    function getThePatient(uint32 _patientId) public view returns (string memory, string memory, string memory, string memory) { 
        /*string memory _firstName = patients[_patientId].firstName;
        string memory _lastName = patients[_patientId].lastName;
        string memory _gender = patients[_patientId].gender;
        string memory _addressOfPatient = patients[_patientId].addressOfPatient;
        return (_firstName, _lastName, _gender, _addressOfPatient);*/
        return (
            patients[_patientId].firstName,
            patients[_patientId].lastName,
            patients[_patientId].gender,
            patients[_patientId].addressOfPatient
        );
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
    /*function getNonVariableExamination(uint _patientId) public view returns (NonVariableExaminationInfo memory){
        return nonVariableExaminationOfPatient[_patientId];
    }*/
    function getNonVariableExamination(uint _patientId) public view returns (string memory, string memory, string memory){
        /*string memory _bloodGroup = nonVariableExaminationOfPatient[_patientId].bloodGroup;
        string memory _rhesus = nonVariableExaminationOfPatient[_patientId].rhesus;
        string memory _electrophoresis = nonVariableExaminationOfPatient[_patientId].electrophoresis;
        return (_bloodGroup, _rhesus, _electrophoresis);*/
        return (
            nonVariableExaminationOfPatient[_patientId].bloodGroup,
            nonVariableExaminationOfPatient[_patientId].rhesus,
            nonVariableExaminationOfPatient[_patientId].electrophoresis
        );
    }

    // Add a speciality medicine prescribe by the doctor to any patient
    function prescribeSpecialtyMedicine(string memory _documentCode,
        string memory _medicationCode,
        string memory _medicationName,
        string memory _normalStartDate,
        string memory _normalEndDate,
        string memory _DosageUnit,
        uint _DosageQuantity,
        string memory _prescriptionDate,
        string memory _observation,
        uint _patientId) public isDoctor(msg.sender) {
        allSpecialtyMedicine.push(SpecialtyMedicineInfo(
            _documentCode,
            _medicationCode,
            _medicationName,
            _normalStartDate,
            _normalEndDate,
            _DosageUnit,
            _DosageQuantity,
            _prescriptionDate,
            _observation,
            _patientId
        ));
        specialtyMedicineToPatientCount[_patientId] = specialtyMedicineToPatientCount[_patientId].add(1);
    }

    function medicineCountOfPatient(uint _patientId) public view returns (uint) {
        return specialtyMedicineToPatientCount[_patientId];
    }

    // During the use of the drug the patient noticed side effects. He reports them to the doctor who records them
    function setObservationAfterPrescription(uint _patientId,
        string memory _documentCode,
        string memory _medicationCode,
        string memory _observation) public isDoctor(msg.sender) returns (bool) {
        uint i;
        for(i = 0; i < allSpecialtyMedicine.length; i++) {
            if (allSpecialtyMedicine[i].patientId == _patientId &&
                keccak256(abi.encodePacked(allSpecialtyMedicine[i].documentCode)) == keccak256(abi.encodePacked(_documentCode)) &&
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
    /*function getAllPrescribeMedicine(uint _patientId) public view returns (SpecialtyMedicineInfo[] memory) {
        SpecialtyMedicineInfo[] memory allMedicine = new SpecialtyMedicineInfo[](specialtyMedicineToPatientCount[_patientId]);
        uint counter = 0;
        for(uint i = 0; i < allSpecialtyMedicine.length; i++) {
            if (allSpecialtyMedicine[i].patientId == _patientId) {
                allMedicine[counter] = allSpecialtyMedicine[i];
                counter = counter.add(1);
            }
        }
        return allMedicine;
    }*/
    function getAllPrescribeMedicine(uint _patientId) public view returns (uint[] memory) {
        uint[] memory allMedicine = new uint[](specialtyMedicineToPatientCount[_patientId]);
        uint counter = 0;
        for(uint i = 0; i < allSpecialtyMedicine.length; i++) {
            if (allSpecialtyMedicine[i].patientId == _patientId) {
                allMedicine[counter] = i;
                counter = counter.add(1);
            }
        }
        return allMedicine; 
    }

    function getPrescribeMedicine1(uint _documentId) public view returns (string memory, string memory, string memory, string memory) {
        /*string memory _medicationCode = allSpecialtyMedicine[_documentId].medicationCode;
        string memory _medicationName = allSpecialtyMedicine[_documentId].medicationName;
        string memory _normalStartDate = allSpecialtyMedicine[_documentId].normalStartDate;
        string memory _normalEndDate = allSpecialtyMedicine[_documentId].normalEndDate;
        string memory _DosageUnit = allSpecialtyMedicine[_documentId].DosageUnit;
        uint _DosageQuantity = allSpecialtyMedicine[_documentId].DosageQuantity;
        string memory _prescriptionDate = allSpecialtyMedicine[_documentId].prescriptionDate;
        string memory _observation = allSpecialtyMedicine[_documentId].observation;
        uint _patientId = allSpecialtyMedicine[_documentId].patientId;

        return (_medicationCode, _medicationName, _normalStartDate, _normalEndDate, _DosageUnit, _DosageQuantity, _prescriptionDate, _observation, _patientId);*/
        return (
            allSpecialtyMedicine[_documentId].medicationCode,
            allSpecialtyMedicine[_documentId].medicationName,
            allSpecialtyMedicine[_documentId].normalStartDate,
            allSpecialtyMedicine[_documentId].normalEndDate
        );
    }

    function getPrescribeMedicine2(uint _documentId) public view returns (string memory, uint, string memory, string memory, uint){//, string memory, string memory, uint) {
        /*string memory _medicationCode = allSpecialtyMedicine[_documentId].medicationCode;
        string memory _medicationName = allSpecialtyMedicine[_documentId].medicationName;
        string memory _normalStartDate = allSpecialtyMedicine[_documentId].normalStartDate;
        string memory _normalEndDate = allSpecialtyMedicine[_documentId].normalEndDate;
        string memory _DosageUnit = allSpecialtyMedicine[_documentId].DosageUnit;
        uint _DosageQuantity = allSpecialtyMedicine[_documentId].DosageQuantity;
        string memory _prescriptionDate = allSpecialtyMedicine[_documentId].prescriptionDate;
        string memory _observation = allSpecialtyMedicine[_documentId].observation;
        uint _patientId = allSpecialtyMedicine[_documentId].patientId;

        return (_medicationCode, _medicationName, _normalStartDate, _normalEndDate, _DosageUnit, _DosageQuantity, _prescriptionDate, _observation, _patientId);*/
        return (
            allSpecialtyMedicine[_documentId].DosageUnit,
            allSpecialtyMedicine[_documentId].DosageQuantity,
            allSpecialtyMedicine[_documentId].prescriptionDate,
            allSpecialtyMedicine[_documentId].observation,
            allSpecialtyMedicine[_documentId].patientId
        );
    }
    // Add alergies record
    function addAllergy(uint _allergytId, string memory _allergyName, string memory _observation, uint _patientId) public isDoctor(msg.sender) {
        allAllergies.push(AllergyInfo(
            _allergytId,
            _allergyName,
            _observation,
            _patientId
        ));
        counterAllergy = counterAllergy.add(1);
        allergyPatientCount[_patientId] = allergyPatientCount[_patientId].add(1);

    }

    function allergyCountOfPatient(uint _patientId) public view returns (uint) {
        return allergyPatientCount[_patientId];
    }

    // Get allergies of a patient through its Id
    function getAllergies(uint _patientId) public view returns (uint[] memory) {
        uint[] memory allAllergiesOfPatient = new uint[](allergyPatientCount[_patientId]);
        uint counter = 0;
        for(uint i = 0; i < allAllergies.length; i++) {
            if (allAllergies[i].patientId == _patientId) {
                allAllergiesOfPatient[counter] = allAllergies[i].allergyId;
                counter = counter.add(1);
            }
        }
        return (allAllergiesOfPatient);
    }

    function getAllergy(uint _allergyId) public view returns (uint, string memory, string memory, uint) {
        /*string memory _allergyname = allAllergies[_allergyId].allergyName;
        string memory _observation = allAllergies[_allergyId].observation;
        uint _patientId = allAllergies[_allergyId].patientId;
        return (_allergyname, _observation, _patientId);*/
        return (
            _allergyId,
            allAllergies[_allergyId].allergyName,
            allAllergies[_allergyId].observation,
            allAllergies[_allergyId].patientId
        );
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
    /*function allExaminationOrderToPatient(uint _patientId) public view returns (ExaminationInfo[] memory){
        ExaminationInfo[] memory myExaminations = new ExaminationInfo[](orderExaminationToPatientCount[_patientId]);
        uint counter = 0;
        for(uint i = 0; i < orderExamination.length; i++) {
            if (orderExamination[i].patientId == _patientId) {
                myExaminations[counter] = orderExamination[i];
                counter = counter.add(1);
            }
        }
        return myExaminations;
    }*/
    function allExaminationOrderToPatient(uint _patientId) public view returns (uint[] memory){
        uint[] memory myExaminations = new uint[](orderExaminationToPatientCount[_patientId]);
        uint counter = 0;
        for(uint i = 0; i < orderExamination.length; i++) {
            if (orderExamination[i].patientId == _patientId) {
                myExaminations[counter] = i;
                counter = counter.add(1);
            }
        }
        return myExaminations;
    }

    function getExaminationOrder(uint _docExaminationId) public view returns (string memory, string memory, string memory, uint) {
        /*string memory _codeExaminationName = orderExamination[_docExaminationId].codeExaminationName;
        string memory _examinationName = orderExamination[_docExaminationId].examinationName;
        string memory _orderedDate = orderExamination[_docExaminationId].orderedDate;
        uint _patientId = orderExamination[_docExaminationId].patientId;
        return (_codeExaminationName, _examinationName, _orderedDate, _patientId);*/
        return (
            orderExamination[_docExaminationId].codeExaminationName,
            orderExamination[_docExaminationId].examinationName,
            orderExamination[_docExaminationId].orderedDate,
            orderExamination[_docExaminationId].patientId
        );
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
    function getResultOfOrderExamination(uint _docExaminationId) public view returns (uint, string memory, string memory, string memory) {
        /*uint _docResultId = resultOfAnExamination[_docExaminationId].docResultId;
        string memory _resultCode = resultOfAnExamination[_docExaminationId].resultCode;
        string memory _codeResultName = resultOfAnExamination[_docExaminationId].codeResultName;
        string memory _observationDate = resultOfAnExamination[_docExaminationId].observationDate;

        return (_docResultId, _resultCode, _codeResultName, _observationDate);*/
        return (
            resultOfAnExamination[_docExaminationId].docResultId,
            resultOfAnExamination[_docExaminationId].resultCode,
            resultOfAnExamination[_docExaminationId].codeResultName,
            resultOfAnExamination[_docExaminationId].observationDate
        );
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
    function getResultDetailExamination(uint _docResultId) public view returns (string memory, string memory, string memory, string memory) {
        /*string memory _componentName = detailOfResultExamination[_docResultId].componentName;
        string memory _labName = detailOfResultExamination[_docResultId].labName;
        string memory _resultValue = detailOfResultExamination[_docResultId].resultValue;
        string memory _resultObservation = detailOfResultExamination[_docResultId].resultObservation;

        return (_componentName, _labName, _resultValue, _resultObservation);*/
        return (
            detailOfResultExamination[_docResultId].componentName,
            detailOfResultExamination[_docResultId].labName,
            detailOfResultExamination[_docResultId].resultValue,
            detailOfResultExamination[_docResultId].resultObservation
        );
    }
}