// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.8.0;

//import "./Doctor.sol";
import "./ResultExaminationDetail.sol";

contract ResultExamination is ResultExaminationDetail {

    struct ResultExaminationInfo {
        uint docResultId;
        uint docExaminationId;
        string resultCode;
        string codeResultName;
        string observationDate;
    }

    mapping (uint => ResultExaminationDetailInfo) detailOfResultExamination; // docResultId => ResultExaminationDetailInfo

    /*function addResultExamination (uint ) internal isDoctor(msg.sender){
    }*/



}