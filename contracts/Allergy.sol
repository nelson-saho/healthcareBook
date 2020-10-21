// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

contract Allergy {
    struct AllergyInfo {
        uint allergyId;
        string allergyName;
        string observation;
        uint patientId;
    }
}