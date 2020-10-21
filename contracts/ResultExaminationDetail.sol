// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

contract ResultExaminationDetail  {

    struct ResultExaminationDetailInfo {
        uint docResultId;
        string componentName;
        string labName;
        string resultValue;
        string resultObservation;
    }
}