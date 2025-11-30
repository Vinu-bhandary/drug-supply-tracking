from django.db import models
from InventoryApp.models import Inventory, Alert, ConsumptionRecord
from MasterApp.models import User, Drug, Location
from SupplyApp.models import Batch

# Inventory CRUD
def create_inventory(data):
    return Inventory.objects.create(**data)

def read_inventory(inventory_id):
    return Inventory.objects.get(id=inventory_id)

def update_inventory(inventory_id, data):
    obj = Inventory.objects.get(id=inventory_id)
    for k, v in data.items():
        setattr(obj, k, v)
    obj.save()
    return obj

def delete_inventory(inventory_id):
    obj = Inventory.objects.get(id=inventory_id)
    return obj.delete()


# Alert CRUD
def create_alert(data):
    return Alert.objects.create(**data)

def read_alert(alert_id):
    return Alert.objects.get(id=alert_id)

def update_alert(alert_id, data):
    obj = Alert.objects.get(id=alert_id)
    for k, v in data.items():
        setattr(obj, k, v)
    obj.save()
    return obj

def delete_alert(alert_id):
    obj = Alert.objects.get(id=alert_id)
    return obj.delete()


# ConsumptionRecord CRUD
def create_consumption(data):
    return ConsumptionRecord.objects.create(**data)

def read_consumption(record_id):
    return ConsumptionRecord.objects.get(id=record_id)

def update_consumption(record_id, data):
    obj = ConsumptionRecord.objects.get(id=record_id)
    for k, v in data.items():
        setattr(obj, k, v)
    obj.save()
    return obj

def delete_consumption(record_id):
    obj = ConsumptionRecord.objects.get(id=record_id)
    return obj.delete()
