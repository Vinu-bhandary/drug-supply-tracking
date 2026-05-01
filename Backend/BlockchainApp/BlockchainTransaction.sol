// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BlockchainTransaction {

    struct Transaction {
        string orderId;
        string status;
        uint timestamp;
    }

    // Stores full history of each order
    mapping(string => Transaction[]) private transactions;

    event TransactionAdded(
        string orderId,
        string status,
        uint timestamp
    );

    // Add new transaction event
    function addTransaction(
        string memory _orderId,
        string memory _status
    ) public {

        transactions[_orderId].push(
            Transaction(
                _orderId,
                _status,
                block.timestamp
            )
        );

        emit TransactionAdded(
            _orderId,
            _status,
            block.timestamp
        );
    }

    // Get number of events for an order
    function getTransactionCount(
        string memory _orderId
    )
        public
        view
        returns (uint)
    {
        return transactions[_orderId].length;
    }

    // Get a specific event for an order
    function getTransaction(
        string memory _orderId,
        uint index
    )
        public
        view
        returns (
            string memory,
            string memory,
            uint
        )
    {
        require(
            index < transactions[_orderId].length,
            "Transaction does not exist"
        );

        Transaction memory t = transactions[_orderId][index];

        return (
            t.orderId,
            t.status,
            t.timestamp
        );
    }

    // Get all transactions for an orded
    function getAllTransactions(
        string memory _orderId
    )
        public
        view
        returns (
            string[] memory,
            string[] memory,
            uint[] memory
        )
    {
        require(
            transactions[_orderId].length > 0,
            "Order does not exist"
        );

        uint len = transactions[_orderId].length;

        string[] memory orderIds = new string[](len);
        string[] memory statuses = new string[](len);
        uint[] memory timestamps = new uint[](len);

        for (uint i = 0; i < len; i++) {
            Transaction memory t = transactions[_orderId][i];

            orderIds[i] = t.orderId;
            statuses[i] = t.status;
            timestamps[i] = t.timestamp;
        }

        return (orderIds, statuses, timestamps);
    }
}