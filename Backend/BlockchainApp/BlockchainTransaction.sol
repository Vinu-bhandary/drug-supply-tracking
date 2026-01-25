// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BlockchainTransaction {

    struct Transaction {
        uint id;
        string status;
    }

    mapping(uint => Transaction) public transactions;

    event TransactionAdded(uint id, string status);

    function addTransaction(uint _id, string memory _status) public {
        transactions[_id] = Transaction(_id, _status);
        emit TransactionAdded(_id, _status);
    }

    function getTransaction(uint _id) public view returns (uint, string memory) {
        Transaction memory t = transactions[_id];
        return (t.id, t.status);
    }
}
