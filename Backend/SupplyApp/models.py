from django.db import models
from MasterApp.models import Drug, Location, User



class Batch(models.Model):
    id = models.CharField(primary_key=True, max_length=100)
    drug_id = models.ForeignKey(Drug, on_delete=models.CASCADE)
    batch_number = models.CharField(max_length=100)
    mfg_date = models.DateField()
    exp_date = models.DateField()
    blockchain_hash = models.TextField()
    qr_code_data = models.TextField()

    def __str__(self):
        return f"{self.drug_id.name} - {self.batch_number}"


class Order(models.Model):
    id = models.CharField(primary_key=True, max_length=100)
    order_number = models.CharField(max_length=100)
    from_location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name="orders_sent")
    to_location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name="orders_received")
    status = models.CharField(max_length=50)
    shipped_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    carrier_name = models.CharField(max_length=100)
    tracking_number = models.CharField(max_length=100)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    order_block_hash = models.TextField()
    shipped_block_hash = models.TextField(null=True)
    delivered_block_hash = models.TextField(null=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancelled_block_hash = models.TextField(null=True)

    def __str__(self):
        return self.order_number


class OrderItem(models.Model):
    id = models.CharField(primary_key=True, max_length=100)
    order_id = models.ForeignKey(Order, on_delete=models.CASCADE)
    drug_id = models.ForeignKey(Drug, on_delete=models.CASCADE)
    batch_id = models.ForeignKey(Batch, on_delete=models.CASCADE)
    qty = models.IntegerField()

    def __str__(self):
        return f"{self.drug_id.name} x {self.qty}"
