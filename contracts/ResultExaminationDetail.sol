// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.7.0;

contract ResultExaminationDetail  {

    struct ResultExaminationDetailInfo {
        uint docResultId;
        string componentName;
        string labName;
        string resultValue;
        string resultObservation;
    }
}