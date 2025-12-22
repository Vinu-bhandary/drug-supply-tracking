from django.db import models
from MasterApp.models import Drug, Location

class Forecast(models.Model):
    id = models.CharField(primary_key=True, max_length=100)
    drug_id = models.ForeignKey(Drug, on_delete=models.CASCADE)
    location_id = models.ForeignKey(Location, on_delete=models.CASCADE)
    forecast_date = models.DateField()
    predicted_qty = models.IntegerField()

    def __str__(self):
        return f"{self.drug_id.name} forecast"