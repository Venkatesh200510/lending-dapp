// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Lending {

    mapping(address => uint) public deposits;
    mapping(address => uint) public loans;

    uint public collateralRatio = 150; // 150%

    // Deposit ETH (LENDER)
    function deposit() public payable {
        deposits[msg.sender] += msg.value;
    }

    // Borrow ETH (BORROWER)
    function borrow(uint amount) public payable {
        require(msg.value * 100 >= amount * collateralRatio, "Not enough collateral");

        loans[msg.sender] += amount;
        payable(msg.sender).transfer(amount);
    }

    // Repay loan
    function repay() public payable {
        require(loans[msg.sender] > 0, "No loan");

        loans[msg.sender] -= msg.value;
    }

    // Withdraw deposit (only if no active loan)
    function withdraw(uint amount) public {
        require(deposits[msg.sender] >= amount, "Insufficient balance");
        require(loans[msg.sender] == 0, "Loan not repaid");

        deposits[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    // Contract balance
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}