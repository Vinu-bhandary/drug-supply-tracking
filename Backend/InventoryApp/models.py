from django.db import models
from MasterApp.models import Location, Drug, User
from SupplyApp.models import Batch


class Inventory(models.Model):
    id = models.CharField(primary_key=True, max_length=100)
    location_id = models.ForeignKey(Location, on_delete=models.CASCADE)
    drug_id = models.ForeignKey(Drug, on_delete=models.CASCADE)
    batch_id = models.ForeignKey(Batch, on_delete=models.CASCADE)
    qty_on_hand = models.IntegerField()
    exp_date = models.DateField()

    def __str__(self):
        return f"{self.drug_id.name} @ {self.location_id.name}"


class Alert(models.Model):
    id = models.CharField(primary_key=True, max_length=100)
    type = models.CharField(max_length=100)
    location_id = models.ForeignKey(Location, on_delete=models.CASCADE)
    drug_id = models.ForeignKey(Drug, on_delete=models.CASCADE)
    batch_id = models.ForeignKey(Batch, on_delete=models.CASCADE)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField()

    def __str__(self):
        return self.type


class ConsumptionRecord(models.Model):
    id = models.CharField(primary_key=True, max_length=100)
    recorded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    drug_id = models.ForeignKey(Drug, on_delete=models.CASCADE)
    location_id = models.ForeignKey(Location, on_delete=models.CASCADE)
    batch_id = models.ForeignKey(Batch, on_delete=models.SET_NULL, null=True)
    qty_consumed = models.IntegerField()
    consumption_date = models.DateField()

    def __str__(self):
        return f"{self.drug_id.name} consumed"
