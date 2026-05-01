from django.db import models
from BlockchainApp.models import BlockchainTransaction
from web3 import Web3
import json
import os
from dotenv import load_dotenv
from django.utils import timezone


load_dotenv()

PRIVATE_KEY = os.getenv("PRIVATE_KEY")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")



w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))

if not w3.is_connected():
    raise Exception("❌ Ganache is not running")

print("✅ Connected to Ganache")

ACCOUNT = w3.eth.account.from_key(PRIVATE_KEY)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

abi_path = os.path.join(BASE_DIR, "contract_abi.json")

with open(abi_path) as f:
    abi = json.load(f)

contract = w3.eth.contract(
    address=CONTRACT_ADDRESS,
    abi=abi
)



def add_transaction_on_blockchain(order_id, status):

    nonce = w3.eth.get_transaction_count(ACCOUNT.address, "pending")

    txn = contract.functions.addTransaction(
        order_id,
        status
    ).build_transaction({
        "from": ACCOUNT.address,
        "nonce": nonce,
        "gas": 300000,
        "gasPrice": w3.eth.gas_price
    })

    signed_tx = w3.eth.account.sign_transaction(txn, PRIVATE_KEY)

    tx_hash = w3.eth.send_raw_transaction(
        signed_tx.rawTransaction
    )

    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

    return tx_hash.hex(), receipt



def create_blockchain_tx(order_id, status):

    tx_hash, receipt = add_transaction_on_blockchain(order_id, status)

    tx = BlockchainTransaction.objects.create(
        id=f"{order_id}-{status}-{receipt.blockNumber}",
        tx_hash=tx_hash,
        tx_type=status,
        created_at=timezone.now()
    )

    return {
        "tx_hash": tx_hash,
        "block_number": receipt.blockNumber
    }


def get_transaction_count(order_id):

    return contract.functions.getTransactionCount(
        order_id
    ).call()


def get_transaction(order_id, index):

    tx = contract.functions.getTransaction(
        order_id,
        index
    ).call()

    return {
        "order_id": tx[0],
        "status": tx[1],
        "timestamp": tx[2]
    }


def get_all_transactions(order_id):

    data = contract.functions.getAllTransactions(order_id).call()

    order_ids, statuses, timestamps = data

    result = []

    for i in range(len(order_ids)):
        result.append({
            "order_id": order_ids[i],
            "status": statuses[i],
            "timestamp": timestamps[i]
        })

    return result


def read_blockchain_tx(tx_id):

    return BlockchainTransaction.objects.get(id=tx_id)


def update_blockchain_tx(tx_id, data):

    obj = BlockchainTransaction.objects.get(id=tx_id)

    for k, v in data.items():
        setattr(obj, k, v)

    obj.save()

    return obj


def delete_blockchain_tx(tx_id):

    obj = BlockchainTransaction.objects.get(id=tx_id)

    obj.delete()

def list_blockchain_txs():

    return BlockchainTransaction.objects.all()