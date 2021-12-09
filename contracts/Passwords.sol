pragma solidity ^0.8.0;

contract Passwords {

    mapping(string => bool) private passwords;
    mapping(string => bool) private isPassFound;

    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function setPasswords(string[] calldata _passwords) public onlyOwner {
        for(uint i = 0; i < _passwords.length; i++) {
            passwords[_passwords[i]] = true;
        }
    }

    function verifyPassword(string calldata _password) public returns(bool) {
        if(passwords[_password] && !isPassFound[_password]) {
            isPassFound[_password] = true;
            return true;
        }
        return false;
    }
}