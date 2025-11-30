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
