from django.db import models
from datetime import timedelta
from django.utils import timezone
from InventoryApp.models import Inventory, Alert, ConsumptionRecord
from MasterApp.models import User, Drug, Location
from SupplyApp.models import Batch, Order, OrderItem
from .schemas import InventoryItemBase, InventoryItemCreate, InventoryVendorCreate, InventoryItemUpdate, InventoryItemOut, AlertBase, AlertCreate, AlertUpdate, AlertOut, ConsumptionRecordBase, ConsumptionRecordCreate, ConsumptionRecordUpdate, ConsumptionRecordOut
from MasterApp.schemas import SuccessResponse, ErrorResponse
from AiApp.models import Forecast
from AiApp.views import generate_and_store_forecasts
from ninja import Router

invRouter = Router()

@invRouter.post("/inventory/{location_id}", response={200: SuccessResponse, 400: ErrorResponse})
def create_inventory(request, data: InventoryItemCreate, location_id: str):
    try:
        order = Order.objects.get(order_number=data.order_number)
        orderItem = OrderItem.objects.filter(order_id=order)
        loc_id = Location.objects.get(id=location_id)
        for o in orderItem:
            drug = Drug.objects.get(id=o.drug_id.id)
            batch = Batch.objects.get(id=o.batch_id.id)
            inv = Inventory.objects.create(
                id=f"INV-{o.id}-{o.drug_id.id}",
                location_id=loc_id,
                drug_id=drug,
                batch_id=batch,
                qty_on_hand=o.qty,
                exp_date=batch.exp_date
            )
            setattr(order,"status","IN-INVENTORY")
            order.save()

    except Exception as e:
        return 400, {
            "detail": str(e)
        }

    return 200, {
        "message": "Drugs added successfully."
    }

@invRouter.get("/inventory/{item_id}/", response=InventoryItemOut)
def read_inventory(request, item_id: str):
    inv = Inventory.objects.get(id=item_id)
    return {
        "id": inv.id,
        "location_id": inv.location_id.id,
        "drug_id": inv.drug_id.id,
        "batch_id": inv.batch_id.id,
        "qty_on_hand": inv.qty_on_hand,
        "exp_date": inv.exp_date,
    }

@invRouter.put("/inventory/{item_id}/", response=InventoryItemOut)
def update_inventory(request, item_id: str, data: InventoryItemUpdate):
    obj = Inventory.objects.get(id=item_id)
    for k, v in data.dict(exclude_unset=True).items():
        print(k, v)
        if k == "location_id":
            v = Location.objects.get(id=v)
        elif k == "drug_id":
            v = Drug.objects.get(id=v)
        elif k == "batch_id":
            v = Batch.objects.get(id=v)
        setattr(obj, k, v)
    obj.save()
    return {
        "id": obj.id,
        "location_id": obj.location_id.id,
        "drug_id": obj.drug_id.id,
        "batch_id": obj.batch_id.id,
        "qty_on_hand": obj.qty_on_hand,
        "exp_date": obj.exp_date,
    }

@invRouter.get("/inventory/{location_id}", response=list[InventoryItemOut])
def list_inventory(request, location_id: str):
    location = Location.objects.get(id=location_id)
    inventory = Inventory.objects.filter(location_id=location)
    inv = []
    for item in inventory:
        inv.append(
            {
                "id": item.id,
                "location_id": item.location_id.id,
                "drug_id": item.drug_id.id,
                "batch_id": item.batch_id.id,
                "qty_on_hand": item.qty_on_hand,
                "exp_date": item.exp_date,
            }
        )
    return inv

@invRouter.get("/inventory/", response=list[InventoryItemOut])
def list_all_inventory(request):
    inventory = Inventory.objects.all()
    inv = []
    for item in inventory:
        inv.append(
            {
                "id": item.id,
                "location_id": item.location_id.id,
                "drug_id": item.drug_id.id,
                "batch_id": item.batch_id.id,
                "qty_on_hand": item.qty_on_hand,
                "exp_date": item.exp_date,
            }
        )
    return inv

@invRouter.post("/inventory/vendor/{location_id}", response={200: SuccessResponse, 400: ErrorResponse})
def create_inventory_vendor(request, data: InventoryVendorCreate, location_id: str):
    try:
        loc_id = Location.objects.get(id=location_id)
        drug = Drug.objects.get(id=data.drug_id)
        batch = Batch.objects.get(id=data.batch_id)
        inv = Inventory.objects.create(
            id=f"INV-{drug.id}-{batch.id}",
            location_id=loc_id,
            drug_id=drug,
            batch_id=batch,
            qty_on_hand=data.qty_on_hand,
            exp_date=batch.exp_date
        )

    except Exception as e:
        return 400, {
            "detail": str(e)
        }

    return 200, {
        "message": "Drugs added successfully."
    }



def generate_alerts(location_id):

    today = timezone.now().date()
    expiry_threshold = today + timedelta(days=30)

    inventories = Inventory.objects.filter(location_id=location_id)

    alert_count = Alert.objects.filter(location_id=location_id).count()

    for inv in inventories:

        if today <= inv.exp_date <= expiry_threshold:

            Alert.objects.get_or_create(
                location_id=inv.location_id,
                drug_id=inv.drug_id,
                batch_id=inv.batch_id,
                type="EXPIRY",
                message=f"{inv.drug_id.name} (Batch {inv.batch_id.id}) expiring on {inv.exp_date}",
                defaults={
                    "id": f"ALERT-{location_id}-{alert_count}",
                    "created_at": timezone.now()
                }
            )
            alert_count += 1

        if inv.qty_on_hand < 50:

            Alert.objects.get_or_create(
                location_id=inv.location_id,
                drug_id=inv.drug_id,
                batch_id=inv.batch_id,
                type="LOW_STOCK",
                message=f"{inv.drug_id.name} low stock ({inv.qty_on_hand} remaining)",
                defaults={
                    "id": f"ALERT-{location_id}-{alert_count}",
                    "created_at": timezone.now()
                }
            )
            alert_count += 1


@invRouter.get("/alerts/{location_id}")
def get_alerts(request, location_id: str):

    generate_alerts(location_id)

    alerts = Alert.objects.filter(location_id=location_id).order_by("-created_at")

    return [
        {
            "id": a.id,
            "type": a.type,
            "drug": a.drug_id.name,
            "batch": a.batch_id.id,
            "message": a.message,
            "is_read": a.is_read,
            "created_at": a.created_at
        }
        for a in alerts
    ]

@invRouter.post("/alerts/read/{alert_id}")
def mark_alert_read(request, alert_id: str):

    alert = Alert.objects.get(id=alert_id)
    alert.is_read = True
    alert.save()

    return {"message": "Marked as read"}

@invRouter.post("/consumption/{inventory_id}", response={200: SuccessResponse, 400: ErrorResponse})
def record_consumption(request, inventory_id: str, data: ConsumptionRecordCreate):
    try:
        consumption_conunt = ConsumptionRecord.objects.filter(location_id=data.location_id).count() + 1
        consumption = ConsumptionRecord.objects.create(
            id=f"CON-{data.location_id}-{consumption_conunt}",
            drug_id=Drug.objects.get(id=data.drug_id),
            batch_id=Batch.objects.get(id=data.batch_id),
            qty_consumed=data.qty_consumed,
            recorded_by=User.objects.get(id=data.recorded_by), 
            location_id=Location.objects.get(id=data.location_id),
            consumption_date=data.consumption_date
        )
        inventory = Inventory.objects.get(id=inventory_id)
        inventory.qty_on_hand -= data.qty_consumed
        inventory.save()
    except Exception as e:
        return 400, {
            "detail": str(e)
        }

    return 200, {
        "message": "Consumption recorded successfully."
    }

@invRouter.get("/consumption/loc/{location_id}", response=list[ConsumptionRecordOut])
def list_consumption(request, location_id: str):
    consumption = ConsumptionRecord.objects.filter(location_id=location_id).order_by("-consumption_date")
    return [
        {
            "id": c.id,
            "recorded_by": c.recorded_by.username if c.recorded_by else None,
            "drug_id": c.drug_id.id,
            "location_id": c.location_id.id,
            "batch_id": c.batch_id.id if c.batch_id else None,
            "qty_consumed": c.qty_consumed,
            "consumption_date": c.consumption_date
        }
        for c in consumption
    ]


import datetime

@invRouter.get("/forecast/{location_id}")
def get_forecast(request, location_id: str):

    forecasts = Forecast.objects.filter(location_id=location_id)

    if not forecasts.exists():
        generate_and_store_forecasts(days_ahead=7)
        forecasts = Forecast.objects.filter(location_id=location_id)

    else:
        latest = forecasts.order_by('-forecast_date').first()

        if latest.forecast_date < datetime.date.today():

            forecasts.delete()
            generate_and_store_forecasts(days_ahead=7)
            forecasts = Forecast.objects.filter(location_id=location_id)

    return [
        {
            "drug_name": f.drug_id.name,
            "forecast_date": f.forecast_date,
            "predicted_qty": f.predicted_qty
        }
        for f in forecasts.order_by("forecast_date")
    ]