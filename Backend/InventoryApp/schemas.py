from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class InventoryItemBase(BaseModel):
    id: str
    location_id: str
    drug_id: str
    batch_id: str
    qty_on_hand: int
    exp_date: datetime

class InventoryItemCreate(BaseModel):
    order_number: str

class InventoryVendorCreate(BaseModel):
    drug_id: str
    batch_id: str
    qty_on_hand: int

class InventoryItemUpdate(BaseModel):
    location_id: Optional[str] = None
    drug_id: Optional[str] = None
    batch_id: Optional[str] = None
    qty_on_hand: Optional[int] = None
    exp_date: Optional[datetime] = None

class InventoryItemOut(InventoryItemBase):
    class Config:
        from_attributes = True

class AlertBase(BaseModel):
    id: str
    type: str
    location_id: str
    drug_id: str
    batch_id: str
    message: str
    is_read: bool
    created_at: datetime

class AlertCreate(BaseModel):
    id: str
    type: str
    location_id: str
    drug_id: str
    batch_id: str
    message: str
    is_read: bool
    created_at: datetime

class AlertUpdate(BaseModel):
    type: Optional[str] = None
    location_id: Optional[str] = None
    drug_id: Optional[str] = None
    batch_id: Optional[str] = None
    message: Optional[str] = None
    is_read: Optional[bool] = None
    created_at: Optional[datetime] = None

class AlertOut(AlertBase):
    class Config:
        from_attributes = True

class ConsumptionRecordBase(BaseModel):
    id: str
    recorded_by: Optional[str] = None
    drug_id: str
    location_id: str
    batch_id: Optional[str] = None
    qty_consumed: int
    consumption_date: datetime

class ConsumptionRecordCreate(BaseModel):
    recorded_by: Optional[str] = None
    drug_id: str
    location_id: str
    batch_id: Optional[str] = None
    qty_consumed: int
    consumption_date: datetime

class ConsumptionRecordUpdate(BaseModel):
    recorded_by: Optional[str] = None
    drug_id: Optional[str] = None
    location_id: Optional[str] = None
    batch_id: Optional[str] = None
    qty_consumed: Optional[int] = None
    consumption_date: Optional[datetime] = None

class ConsumptionRecordOut(ConsumptionRecordBase):
    class Config:
        from_attributes = True

