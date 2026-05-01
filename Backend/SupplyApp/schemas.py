from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class OrderBase(BaseModel):
    id: str
    order_number: str
    from_location_id: str
    to_location_id: str
    created_at: str
    status: str
    shipped_at: Optional[str] = None
    delivered_at: Optional[str] = None
    carrier_name: str
    tracking_number: str
    created_by_id: Optional[str] = None

class OrderUpdate(BaseModel):
    order_number: Optional[str] = None
    from_location_id: Optional[str] = None
    to_location_id: Optional[str] = None
    status: Optional[str] = None
    shipped_at: Optional[str] = None
    delivered_at: Optional[str] = None
    carrier_name: Optional[str] = None
    tracking_number: Optional[str] = None
    created_by_id: Optional[str] = None

class OrderShip(BaseModel):
    order_id: str
    carrier_name: str
    tracking_number: str

class OrderOut(OrderBase):
    id: str
    order_number: str
    from_location_id: str
    to_location_id: str
    status: str
    carrier_name: str
    tracking_number: str
    created_at: str
    created_by_id: Optional[str] = None

class OrderItemBase(BaseModel):
    id: str
    order_id: str
    drug_id: str
    qty: int

class OrderItemCreate(BaseModel):
    drug_id: str
    quantity: int

class OrderItemUpdate(BaseModel):
    drug_id: Optional[str] = None
    quantity: Optional[int] = None
    batch_id: Optional[str] = None

class OrderItemOut(OrderItemBase):
    class Config:
        from_attributes = True

class BatchBase(BaseModel):
    id: str
    drug_id: str
    batch_number: str
    mfg_date: datetime
    exp_date: datetime
    blockchain_hash: str

class BatchCreate(BaseModel):
    drug_id: str
    batch_number: str
    mfg_date: datetime
    exp_date: datetime

class BatchUpdate(BaseModel):
    drug_id: Optional[str] = None
    batch_number: Optional[str] = None
    mfg_date: Optional[datetime] = None
    exp_date: Optional[datetime] = None
    blockchain_hash: Optional[str] = None

class BatchOut(BatchBase):
    id: str
    drug_id: str
    batch_number: str
    mfg_date: str
    exp_date: str
    blockchain_hash: str

class OrderCreate(BaseModel):
    created_by_id: str
    vendor_id: str
    items: List[OrderItemCreate]