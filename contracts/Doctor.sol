// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./SafeMath.sol";
import "./Ownable.sol";
/**
 * @title Doctor
 * @dev Adding doctor operations
*/
contract Doctor is Ownable {

    using SafeMath16 for uint16;
    using SafeMath32 for uint32;

    // address public theOwner = msg.sender; //The address of deployer

    uint32 public counterDoctor = 0;

    struct DoctorInfo{
        uint32 doctorId;
        string firstName;
        string lastName;
        string hospitalAddress;
    }

    DoctorInfo[] public doctors; // record all doctors of the system

    mapping (uint32 => address) eachDoctor;  // Corresponding doctorId to address
    mapping (address => uint16) public doctorCount; // Corresponding address to 0 or 1 (help us to know if doctor has an account)
    mapping (address => uint32) public ownerPatientCount; // Counts the number of patients added by each doctor
    //mapping (uint32 => DoctorInfo) allDoctors; 

    event NewDoctor(uint32 doctorId, string firstName, string lastName);

    // Modifier to check if the sender of any called method is a deployer (owner)
    /*modifier onlyTheOwner() {
        require(msg.sender == theOwner,'Sender not authorized.');
        _;
    }*/

    // Modifier to check if the sender of any called method is a doctor
    modifier isDoctor(address _address) {
        require(doctorCount[_address] == 1,'Sender not authorized  ::: It should be a doctor');
        _;
    }

    // Add doctor. Only the deployer of the contract can call this method
    function addDoctor(string memory _firstName,
        string memory _lastName,
        string memory _hospitalAddress,
        address addressDoctor) public onlyOwner {
        require(doctorCount[addressDoctor] == 0,'Sender not authorized. It already has an account');
        counterDoctor = counterDoctor.add(1);
        uint32 idDoctor = counterDoctor.sub(1);
        doctors.push(DoctorInfo(idDoctor, _firstName, _lastName, _hospitalAddress));
        eachDoctor[idDoctor] = addressDoctor;
        //allDoctors[idDoctor] = DoctorInfo(idDoctor, _firstName, _lastName, _hospitalAddress);
        doctorCount[addressDoctor] = doctorCount[addressDoctor].add(1);
        emit NewDoctor(idDoctor, _firstName, _lastName);
    }

    

    /* We can add other method as:
    - getAllDoctors
    - getAnyDoctor by its doctorId or others parameters*/
}