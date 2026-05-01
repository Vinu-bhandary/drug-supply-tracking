from django.db import models
from django.utils import timezone
from SupplyApp.models import Batch, Order, OrderItem
from MasterApp.models import Drug, Location, User
from ninja import Router
from .schemas import BatchOut, BatchCreate, OrderOut, OrderCreate, OrderShip, OrderItemOut, OrderItemCreate
from BlockchainApp.views import create_blockchain_tx, get_all_transactions
from BlockchainApp.models import BlockchainTransaction
from typing import Dict

admin_router = Router()

@admin_router.post("/batches/", response=BatchOut)
def create_batch(request, data: BatchCreate):
    drug = Drug.objects.get(id=data.drug_id)
    count = Batch.objects.filter(drug_id=drug).count() + 1
    batch = Batch.objects.create(
        id=f"BATCH-{drug.id}-{count}",
        drug_id=drug,
        batch_number=data.batch_number,
        mfg_date=data.mfg_date,
        exp_date=data.exp_date,
        blockchain_hash=f"TX-{drug.id}-{count}"
    )
    return {
        "id": batch.id,
        "drug_id": batch.drug_id.name,
        "batch_number": batch.batch_number,
        "mfg_date": batch.mfg_date.strftime("%d-%m-%Y") if batch.mfg_date else None,
        "exp_date": batch.exp_date.strftime("%d-%m-%Y") if batch.exp_date else None,
        "blockchain_hash": batch.blockchain_hash,
    }



@admin_router.post("/orders/{location_id}", response=OrderOut)
def create_order(request, location_id: str, data: OrderCreate):
    order_count = Order.objects.filter(from_location_id=location_id).count() + 1
    items = data.items
    ord_id = f"ORDER-{location_id}-{order_count}"
    tx_hash = create_blockchain_tx(ord_id, "CREATED")
    order = Order.objects.create(
        id=ord_id,
        order_number=f"ORD-{location_id}-{order_count}",
        from_location=Location.objects.get(id=location_id),
        to_location=Location.objects.get(id=data.vendor_id),
        status="PENDING",
        carrier_name='',
        tracking_number='',
        created_by=User.objects.get(id=data.created_by_id) if data.created_by_id else None,
        order_block_hash=tx_hash["tx_hash"]
    )
    item_count = 1
    for item in items:
        OrderItem.objects.create(
            id=f"ORDERITEM-{order.id}-{item_count}",
            order_id=order,
            drug_id=Drug.objects.get(id=item.drug_id),
            qty=item.quantity
        )
        item_count += 1

    return {
        "id": order.id,
        "order_number": order.order_number,
        "from_location_id": order.from_location.name,
        "to_location_id": order.to_location.name,
        "status": order.status,
        "carrier_name": order.carrier_name,
        "tracking_number": order.tracking_number,
        "created_by_id": order.created_by.id if order.created_by else None,
        "created_at": order.created_at.strftime("%d-%m-%Y") if order.created_at else None,
    }

@admin_router.post("/orders/ship/", response=OrderOut)
def ship_order(request, data: OrderShip):
    order = Order.objects.get(id=data.order_id)
    order.status = "SHIPPED"
    order.carrier_name = data.carrier_name
    order.tracking_number = data.tracking_number
    order.shipped_at = timezone.now()
    tx_hash = create_blockchain_tx(order.id, "SHIPPED")
    order.shipped_block_hash = tx_hash["tx_hash"]
    order.save()
    return {
        "id": order.id,
        "order_number": order.order_number,
        "from_location_id": order.from_location.name,
        "to_location_id": order.to_location.name,
        "status": order.status,
        "carrier_name": order.carrier_name,
        "tracking_number": order.tracking_number,
        "created_by_id": order.created_by.id if order.created_by else None,
        "created_at": order.created_at.strftime("%d-%m-%Y") if order.created_at else None,
    }

@admin_router.post("/orders/deliver/{order_id}", response=OrderOut)
def deliver_order(request, order_id: str):
    order = Order.objects.get(id=order_id)
    order.status = "DELIVERED"
    order.delivered_at = timezone.now()
    tx_hash = create_blockchain_tx(order.id, "DELIVERED")
    order.delivered_block_hash = tx_hash["tx_hash"]
    order.save()
    return {
        "id": order.id,
        "order_number": order.order_number,
        "from_location_id": order.from_location.name,
        "to_location_id": order.to_location.name,
        "status": order.status,
        "carrier_name": order.carrier_name,
        "tracking_number": order.tracking_number,
        "created_by_id": order.created_by.id if order.created_by else None,
        "created_at": order.created_at.strftime("%d-%m-%Y") if order.created_at else None,
    }

@admin_router.post("/orders/cancel/{order_id}", response=OrderOut)
def cancel_order(request, order_id: str):
    order = Order.objects.get(id=order_id)
    order.status = "CANCELLED"
    order.save()
    tx_hash = create_blockchain_tx(order.id, "CANCELLED")
    order.cancelled_block_hash = tx_hash["tx_hash"]
    order.save()
    return {
        "id": order.id,
        "order_number": order.order_number,
        "from_location_id": order.from_location.name,
        "to_location_id": order.to_location.name,
        "status": order.status,
        "carrier_name": order.carrier_name,
        "tracking_number": order.tracking_number,
        "created_by_id": order.created_by.id if order.created_by else None,
        "created_at": order.created_at.strftime("%d-%m-%Y") if order.created_at else None,
    }

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

@admin_router.get("/orders/{location_id}/{role}", response=list[Dict])
def list_orders_by_location(request, location_id: str, role: str):
    ord = []
    if role == "vendor":
        ord = Order.objects.filter(to_location_id=location_id).order_by('-created_at')
    elif role == "hospital":
        ord = Order.objects.filter(from_location_id=location_id).order_by('-created_at')
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
                "order_block_hash": o.order_block_hash,
                "shipped_block_hash": o.shipped_block_hash if o.shipped_block_hash else None,
                "delivered_block_hash": o.delivered_block_hash if o.delivered_block_hash else None,
                "cancelled_block_hash": o.cancelled_block_hash if o.cancelled_block_hash else None,
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


@admin_router.post("/orders/verify/{order_id}", response=Dict)
def verify_order(request, order_id: str):
    print("Hello")
    order = Order.objects.get(id=order_id)
    data = {}
    if order.status == "DELIVERED" or order.status == "IN-INVENTORY":
        data = {
            "order_id": order.id,
            "status": order.status,
            "delivered_at": order.delivered_at,
            "blockchain_hash": order.delivered_block_hash
        }
    elif order.status == "SHIPPED":
        data = {
            "order_id": order.id,
            "status": order.status,
            "shipped_at": order.shipped_at,
            "blockchain_hash": order.shipped_block_hash
        }
    elif order.status == "CANCELLED":
        data = {
            "order_id": order.id,
            "status": order.status,
            "blockchain_hash": order.cancelled_block_hash
        }
    else:
        data = {
            "order_id": order.id,
            "status": order.status,
            "blockchain_hash": order.order_block_hash
        }
    print(data)
    return data