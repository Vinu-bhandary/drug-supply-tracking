from django.db import models
from BlockchainApp.models import BlockchainTransaction
from SupplyApp.models import Batch

# BlockchainTransaction CRUD
def create_blockchain_tx(data):
    return BlockchainTransaction.objects.create(**data)

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
    return obj.delete()


##################################################################

from web3 import Web3
import json

w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))

PRIVATE_KEY = "0x2034c9ea2468cbc6191a3688289260dcd04caa79f6f7e65ad95f90305a95e239"
ACCOUNT = w3.eth.account.from_key(PRIVATE_KEY)

CONTRACT_ADDRESS = "0x8ea284C73A5d36E18A755527a076f395ef8Ee2b6"

with open("contract_abi.json") as f:
    abi = json.load(f)

contract = w3.eth.contract(
    address=CONTRACT_ADDRESS,
    abi=abi
)

#----------------------------------------------------------#

def create_blockchain_tx(data):

    # 1. Save in DB
    tx = BlockchainTransaction.objects.create(**data)

    # 2. Save in Blockchain
    nonce = w3.eth.get_transaction_count(ACCOUNT.address)

    txn = contract.functions.addTransaction(
        tx.id,
        "CREATED"
    ).build_transaction({
        'from': ACCOUNT.address,
        'nonce': nonce,
        'gas': 200000,
        'gasPrice': w3.to_wei('20', 'gwei')
    })

    signed = w3.eth.account.sign_transaction(txn, PRIVATE_KEY)
    w3.eth.send_raw_transaction(signed.rawTransaction)

    return tx
