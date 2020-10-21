// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

contract SpecialtyMedicine {
    struct SpecialtyMedicineInfo {
        string documentCode;
        string medicationCode;
        string medicationName;
        string normalStartDate;
        string normalEndDate;
        string DosageUnit;
        uint DosageQuantity;
        string prescriptionDate;
        string observation;
        uint patientId;
    }
}