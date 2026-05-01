from django.db import models
from SupplyApp.models import Batch


class BlockchainTransaction(models.Model):
    id = models.CharField(primary_key=True, max_length=100)
    tx_hash = models.CharField(unique=True, max_length=255)
    tx_type = models.CharField(max_length=50)
    created_at = models.DateTimeField()

    def __str__(self):
        return self.tx_hash
