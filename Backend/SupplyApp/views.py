from django.db import models
from SupplyApp.models import Batch, Order, OrderItem
from MasterApp.models import Drug, Location, User


def create_batch(data):
    return Batch.objects.create(**data)

def read_batch(batch_id):
    return Batch.objects.get(id=batch_id)

def update_batch(batch_id, data):
    obj = Batch.objects.get(id=batch_id)
    for k, v in data.items():
        setattr(obj, k, v)
    obj.save()
    return obj

def delete_batch(batch_id):
    obj = Batch.objects.get(id=batch_id)
    return obj.delete()



def create_order(data):
    return Order.objects.create(**data)

def read_order(order_id):
    return Order.objects.get(id=order_id)

def update_order(order_id, data):
    obj = Order.objects.get(id=order_id)
    for k, v in data.items():
        setattr(obj, k, v)
    obj.save()
    return obj

def delete_order(order_id):
    obj = Order.objects.get(id=order_id)
    return obj.delete()



def create_order_item(data):
    return OrderItem.objects.create(**data)

def read_order_item(item_id):
    return OrderItem.objects.get(id=item_id)

def update_order_item(item_id, data):
    obj = OrderItem.objects.get(id=item_id)
    for k, v in data.items():
        setattr(obj, k, v)
    obj.save()
    return obj

def delete_order_item(item_id):
    obj = OrderItem.objects.get(id=item_id)
    return obj.delete()
