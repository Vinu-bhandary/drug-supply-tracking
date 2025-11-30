from django.db import models
from AiApp.models import Forecast
from MasterApp.models import Drug, Location

# Forecast CRUD
def create_forecast(data):
    return Forecast.objects.create(**data)

def read_forecast(forecast_id):
    return Forecast.objects.get(id=forecast_id)

def update_forecast(forecast_id, data):
    obj = Forecast.objects.get(id=forecast_id)
    for k, v in data.items():
        setattr(obj, k, v)
    obj.save()
    return obj

def delete_forecast(forecast_id):
    obj = Forecast.objects.get(id=forecast_id)
    return obj.delete()
