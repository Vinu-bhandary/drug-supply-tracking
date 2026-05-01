from django.db import models
from SupplyApp.models import Batch, Order, OrderItem
from MasterApp.models import Drug, Location, User
from ninja import Router
from .schemas import BatchOut, BatchCreate, OrderOut, OrderCreate, OrderItemOut, OrderItemCreate

admin_router = Router()

@admin_router.post("/batches/", response=BatchOut)
def create_batch(request, data: BatchCreate):
    batch = Batch.objects.create(**data.dict())
    return batch

@admin_router.post("/orders/", response=OrderOut)
def create_order(request, data: OrderCreate):
    order = Order.objects.create(**data.dict())
    return order

@admin_router.post("/orderitems/", response=OrderItemOut)
def create_orderitem(request, data: OrderItemCreate):
    order_item = OrderItem.objects.create(**data.dict())
    return order_item


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

@admin_router.get("/orders/{location_id}/{role}", response=list[OrderOut])
def list_orders_by_location(request, location_id: str, role: str):
    ord = []
    if role == "vendor":
        ord = Order.objects.filter(to_location_id=location_id)
    elif role == "hospital":
        ord = Order.objects.filter(from_location_id=location_id)
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

@admin_router.get("/batches/", response=list[BatchOut])
def list_batches(request):
    batches = Batch.objects.all()
    batch_list = []
    for b in batches:
        batch_list.append(
            {
                "id": b.id,
                "drug_id": b.drug_id.name,
                "batch_number": b.batch_number,
                "mfg_date": b.mfg_date.strftime("%d-%m-%Y") if b.mfg_date else None,
                "exp_date": b.exp_date.strftime("%d-%m-%Y") if b.exp_date else None,
                "blockchain_hash": b.blockchain_hash,
                "qr_code_data": b.qr_code_data,
            }
        )
    return batch_list

@admin_router.get("/orderitems/{order_id}", response=list[OrderItemOut])
def list_order_items(request, order_id: int):
    order_items = OrderItem.objects.filter(order_id=order_id)
    order_item_list = []
    for oi in order_items:
        order_item_list.append(
            {
                "id": oi.id,
                "order_id": oi.order_id.id,
                "drug_id": oi.drug_id.name,
                "batch_id": oi.batch_id.id,
                "quantity": oi.qty,
            }
        )
    return order_item_list