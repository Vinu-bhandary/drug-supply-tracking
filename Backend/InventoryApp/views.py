from django.db import models
from InventoryApp.models import Inventory, Alert, ConsumptionRecord
from MasterApp.models import User, Drug, Location
from SupplyApp.models import Batch
from .schemas import InventoryItemBase, InventoryItemCreate, InventoryItemUpdate, InventoryItemOut, AlertBase, AlertCreate, AlertUpdate, AlertOut, ConsumptionRecordBase, ConsumptionRecordCreate, ConsumptionRecordUpdate, ConsumptionRecordOut
from ninja import Router

invRouter = Router()

@invRouter.post("/inventory/", response=InventoryItemOut)
def create_inventory(request, data: InventoryItemCreate):
    data.location_id = Location.objects.get(id=data.location_id)
    data.drug_id = Drug.objects.get(id=data.drug_id)
    data.batch_id = Batch.objects.get(id=data.batch_id)
    inv = Inventory.objects.create(**data.dict())
    return {
        "id": inv.id,
        "location_id": inv.location_id.id,
        "drug_id": inv.drug_id.id,
        "batch_id": inv.batch_id.id,
        "qty_on_hand": inv.qty_on_hand,
        "exp_date": inv.exp_date,
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

## FIX THIS UPDATE METHOD LATER
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
