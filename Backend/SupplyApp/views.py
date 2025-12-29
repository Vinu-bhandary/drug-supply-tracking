from django.db import models
from SupplyApp.models import Batch, Order, OrderItem
from MasterApp.models import Drug, Location, User
from ninja import Router
from .schemas import BatchOut, BatchCreate, OrderOut, OrderCreate, OrderItemOut, OrderItemCreate

admin_router = Router()

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


@admin_router.get("/orders/", response=list[OrderOut])
def list_orders(request):
    ord = Order.objects.all()
    order_list = []
    for o in ord:
        order_list.append(
            {
                "id": o.id,
                "order_number": o.order_number,
                "from_location_id": o.from_location.name,
                "to_location_id": o.to_location.name,
                "status": o.status,
                "shipped_at": o.shipped_at.strftime("%d-%m-%Y") if o.shipped_at else None,
                "delivered_at": o.delivered_at.strftime("%d-%m-%Y") if o.delivered_at else None,
                "carrier_name": o.carrier_name,
                "tracking_number": o.tracking_number,
                "created_by_id": o.created_by.id if o.created_by else None,
                "created_at": o.created_at.strftime("%d-%m-%Y") if o.created_at else None,
            }
        )
    return order_list
