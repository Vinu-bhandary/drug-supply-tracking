from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime



class LocationBase(BaseModel):
    id: str
    name: str
    type: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str


class LocationCreate(BaseModel):
    id: str
    name: str
    type: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str


class LocationUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None


class LocationOut(LocationBase):
    class Config:
        from_attributes = True



class UserBase(BaseModel):
    id: str
    username: str
    email: EmailStr
    role: str
    location_id: Optional[str] = None
    location: Optional[str] = None


class UserCreate(BaseModel):
    id: str
    username: str
    email: EmailStr
    password_hash: str
    role: str
    location_id: Optional[str] = None


class UserUpdate(BaseModel):
    password_hash: Optional[str] = None


class UserOut(UserBase):
    class Config:
        from_attributes = True


class UserWithLocation(UserOut):
    location_id: Optional[LocationOut] = None



class DrugBase(BaseModel):
    id: str
    name: str
    category: str
    strength: str
    unit: str
    reorder_point: int


class DrugCreate(BaseModel):
    id: str
    name: str
    category: str
    strength: str
    unit: str
    reorder_point: int


class DrugUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    strength: Optional[str] = None
    unit: Optional[str] = None
    reorder_point: Optional[int] = None


class DrugOut(DrugBase):
    class Config:
        from_attributes = True



class ErrorResponse(BaseModel):
    detail: str
    status_code: int = 400


class SuccessResponse(BaseModel):
    message: str
    data: Optional[dict] = None
    status_code: int = 200
