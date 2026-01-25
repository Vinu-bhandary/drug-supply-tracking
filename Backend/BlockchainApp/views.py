from django.db import models
from BlockchainApp.models import BlockchainTransaction
from SupplyApp.models import Batch


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
#CONNECT TO GANACHE
from web3 import Web3
import json

w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))
if not w3.is_connected():
    raise Exception("❌ Ganache is not running")
print("✅ Connected to Ganache")

# ACCOUNT (GANACHE PRIVATE KEY)

PRIVATE_KEY = "0x0611b15e8be8842748234b1489b0d97518bde8a07ab4eaa9ddae860961f0358d"
ACCOUNT = w3.eth.account.from_key(PRIVATE_KEY)

# SMART CONTRACT DETAILS
CONTRACT_ADDRESS = "0x1345850698BFC523b785f17AE34264BC826518ad"

with open("contract_abi.json") as f:
    abi = json.load(f)

contract = w3.eth.contract(
    address=CONTRACT_ADDRESS,
    abi=abi
)

#----------------------------------------------------------#
# CREATE TRANSACTION (DB + BLOCKCHAIN)

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
#----------------------------------------------------------------#
#add TRANSACTION
def add_transaction_on_blockchain(tx_id, status):
    nonce = w3.eth.get_transaction_count(ACCOUNT.address)

    tx = contract.functions.addTransaction(
        tx_id,
        status
    ).build_transaction({
        "from": ACCOUNT.address,
        "nonce": nonce,
        "gas": 300000,
        "gasPrice": w3.to_wei("20", "gwei")
    })

    signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)

    return w3.to_hex(tx_hash)

#getTransaction
def get_transaction_from_blockchain(tx_id):
    tx = contract.functions.getTransaction(tx_id).call()
    return {
        "id": tx[0],
        "status": tx[1]
    }


# READ TRANSACTION

# def read_blockchain_tx(tx_id):
#     tx = get_object_or_404(BlockchainTransaction, id=tx_id)

#     blockchain_data = contract.functions.getTransaction(tx_id).call()

#     return {
#         "db_id": tx.id,
#         "db_status": tx.status,
#         "blockchain_id": blockchain_data[0],
#         "blockchain_status": blockchain_data[1]
#     }

# #UPDATE TRANSACTION (BLOCKCHAIN ONLY)


# def update_blockchain_tx(tx_id, new_status):
#     tx = get_object_or_404(BlockchainTransaction, id=tx_id)

#     nonce = w3.eth.get_transaction_count(ACCOUNT.address)

#     txn = contract.functions.addTransaction(
#         tx.id,
#         new_status
#     ).build_transaction({
#         "from": ACCOUNT.address,
#         "nonce": nonce,
#         "gas": 300000,
#         "gasPrice": w3.to_wei("20", "gwei")
#     })

#     signed_txn = w3.eth.account.sign_transaction(txn, PRIVATE_KEY)
#     tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)

#     tx.status = new_status
#     tx.blockchain_hash = tx_hash.hex()
#     tx.save()

#     return tx



# #SIMPLE TEST API (OPTIONAL)


# @csrf_exempt
# def test_blockchain(request):
#     if request.method == "POST":
#         data = {
#             "status": "CREATED"
#         }
#         tx = create_blockchain_tx(data)

#         return JsonResponse({
#             "message": "Transaction created",
#             "id": tx.id,
#             "blockchain_hash": tx.blockchain_hash
#         })

#     return JsonResponse({"error": "Only POST allowed"})