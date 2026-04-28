// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract P2PLending {

    struct Loan {
        uint id;
        address borrower;
        address lender;
        uint amount;
        uint interest;
        bool funded;
        bool repaid;
    }

    Loan[] public loans;

    function createLoan(uint amount, uint interest) public {
        loans.push(Loan({
            id: loans.length,
            borrower: msg.sender,
            lender: address(0),
            amount: amount,
            interest: interest,
            funded: false,
            repaid: false
        }));
    }

    function fundLoan(uint id) public payable {
        Loan storage loan = loans[id];

        require(!loan.funded, "Already funded");
        require(msg.value == loan.amount, "Wrong amount");

        loan.lender = msg.sender;
        loan.funded = true;

        payable(loan.borrower).transfer(msg.value);
    }

    function repayLoan(uint id) public payable {
        Loan storage loan = loans[id];

        require(msg.sender == loan.borrower, "Not borrower");
        require(loan.funded, "Not funded");
        require(!loan.repaid, "Already repaid");

        uint total = loan.amount + loan.interest;
        require(msg.value == total, "Incorrect repayment");

        loan.repaid = true;

        payable(loan.lender).transfer(msg.value);
    }

    function getLoans() public view returns (Loan[] memory) {
        return loans;
    }
}