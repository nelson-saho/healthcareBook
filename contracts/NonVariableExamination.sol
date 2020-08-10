// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

/**
 * @title NonVariableExamination
 * @dev Implements non-variable biological examinations of a patient like blood group, rhesus, electrophoresis
 */
contract NonVariableExamination {
    struct NonVariableExaminationInfo {
        string bloodGroup;
        string rhesus;
        string electrophoresis;
        uint patientId;
    }
}