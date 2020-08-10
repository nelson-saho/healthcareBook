// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.7.0;

import "./ResultExamination.sol";
/**
 * @title Examination
 * @dev All examination processus
 */
contract Examination is ResultExamination {

    struct ExaminationInfo {
        uint docExaminationId;
        uint patientId;
        string codeExaminationName;
        string examinationName;
        string orderedDate;
    }

    mapping (uint => ResultExaminationInfo) resultOfAnExamination; // docExaminationId => ResultExaminationInfo

}