// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.7.0;

contract Allergy {
    struct AllergyInfo {
        uint allergytId;
        string allergyName;
        string observation;
        uint patientId;
    }
}