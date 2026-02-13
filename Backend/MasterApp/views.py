
from ninja import Router
from .schemas import LocationOut, LocationCreate, LocationUpdate, DrugOut, DrugCreate, DrugUpdate, UserOut, UserCreate, UserUpdate, SuccessResponse, ErrorResponse
from .models import Location, Drug, User
from SupplyApp.models import Order, Batch
from django.contrib.auth.hashers import check_password, make_password
import json

router = Router()
router1 = Router()


@router1.post("/login", response={200:SuccessResponse, 400:ErrorResponse})
def login(request):
    try:
        data = json.loads(request.body)
        print(data)
        user = User.objects.get(email=data['email'])
    except User.DoesNotExist:
        return 400, {"detail": "User does not exist"}

    if check_password(data['password'], user.password_hash):
        return 200, {"message": "Login successful", "data": {"user_id": user.id, "username": user.username, "email": user.email, "role": user.role, "location_id": user.location_id.id if user.location_id else None}}
    
    return 400, {"detail": "Invalid email or password"}


# Location endpoints
@router.get("/locations/", response=list[LocationOut])
def list_locations(request):
    return Location.objects.all()

@router.post("/locations/", response=LocationOut)
def create_location(request, payload: LocationCreate):
    location = Location.objects.create(**payload.dict())
    return location

@router.get("/locations/{location_id}", response=LocationOut)
def get_location(request, location_id: str):
    return Location.objects.get(id=location_id)

@router.put("/locations/{location_id}", response={200: LocationOut, 400: ErrorResponse})
def update_location(request, location_id: str, payload: LocationUpdate):
    try:
        location = Location.objects.get(id=location_id)
        for field, value in payload.dict().items():
            setattr(location, field, value)
        location.save()
        return 200, location
    except Location.DoesNotExist:
        return 400, {"detail": "Location does not exist"}
    except Exception as e:
        return 400, {"detail": str(e)}
    
@router.delete("/locations/{location_id}", response={200: SuccessResponse, 400: ErrorResponse})
def delete_location(request, location_id: str):
    try:
        location = Location.objects.get(id=location_id)
        location.delete()
        return 200, {"message": "Location deleted successfully"}
    except Location.DoesNotExist:
        return 400, {"detail": "Location does not exist"}
    except Exception as e:
        return 400, {"detail": str(e)}

@router.get("/drugs/", response=list[DrugOut])
def list_drugs(request):
    return Drug.objects.all()

@router.post("/drugs/", response=DrugOut)
def create_drug(request, payload: DrugCreate):
    drug = Drug.objects.create(**payload.dict())
    return drug

@router.put("/drugs/{drug_id}", response={200: DrugOut, 400: ErrorResponse})
def update_drug(request, drug_id: str, payload: DrugUpdate):
    try:
        drug = Drug.objects.get(id=drug_id)
        for field, value in payload.dict().items():
            setattr(drug, field, value)
        drug.save()
        return 200, drug
    except Drug.DoesNotExist:
        return 400, {"detail": "Drug does not exist"}
    except Exception as e:
        return 400, {"detail": str(e)}
    
@router.delete("/drugs/{drug_id}", response={200: SuccessResponse, 400: ErrorResponse})
def delete_drug(request, drug_id: str):
    try:
        drug = Drug.objects.get(id=drug_id)
        drug.delete()
        return 200, {"message": "Drug deleted successfully"}
    except Drug.DoesNotExist:
        return 400, {"detail": "Drug does not exist"}
    except Exception as e:
        return 400, {"detail": str(e)}

@router.get("/users/", response=list[UserOut])
def list_users(request):
    user = User.objects.all()
    user_list = []
    for u in user:
        user_list.append(
            {
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "role": u.role,
                "location_id": u.location_id.id if u.location_id else None,
                "location": u.location_id.name if u.location_id else "System-wide"
            }
        )
    return user_list

@router.post("/users/", response=SuccessResponse)
def create_user(request, payload: UserCreate):
    loc = Location.objects.get(id=payload.location_id)
    userData = payload.dict()
    payload.location_id = loc
    payload.password_hash = make_password(payload.password_hash)
    user = User.objects.create(**payload.dict())
    return {"message": "User created successfully", "data": userData }

@router.delete("/users/{user_id}", response={200: SuccessResponse, 400: ErrorResponse})
def delete_user(request, user_id: str):
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return 200, {"message": "User deleted successfully"}
    except User.DoesNotExist:
        return 400, {"detail": "User does not exist"}
    except Exception as e:
        return 400, {"detail": str(e)}
    
@router.put("/users/{user_id}", response={200: SuccessResponse, 400: ErrorResponse})
def update_user(request, user_id: str, payload: UserUpdate):
    try:
        user = User.objects.get(id=user_id)
        for field, value in payload.dict().items():
            if field == "password_hash":
                value = make_password(value)
            setattr(user, field, value)
        user.save()
        return 200, {"message": "User updated successfully"}
    except User.DoesNotExist:
        return 400, {"detail": "User does not exist"}
    except Exception as e:
        return 400, {"detail": str(e)}

@router.get("/users/{user_id}", response=UserOut)
def get_user(request, user_id: str):
    return User.objects.get(id=user_id)

@router.get("/dashboard/", response=dict)
def dashboard(request):
    total_users = User.objects.count()
    total_hospitals = Location.objects.filter(type="Hospital").count()
    total_vendors = Location.objects.filter(type="Vendor").count()
    total_drugs = Drug.objects.count()
    recent_orders = Order.objects.order_by('-created_at')[:10]

    rec_orders = []
    for o in recent_orders:
        rec_orders.append(
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

    return {
        "stats": [
            { "id": 1, "label": 'Total Users', "value": total_users, "icon": '👤', "color": 'blue'},
            { "id": 2, "label": 'Total Hospitals', "value": total_hospitals, "icon": '🏥', "color": 'green'},
            { "id": 3, "label": 'Total Vendors', "value": total_vendors, "icon": '🏬', "color": 'orange'},
            { "id": 4, "label": 'Total Drugs', "value": total_drugs, "icon": '💊', "color": 'red'},
        ],
        "recent_orders": rec_orders,
        "chartData": [
            {"name": "January", "orders": Order.objects.filter(created_at__month=1).count()},
            {"name": "February", "orders": Order.objects.filter(created_at__month=2).count()},
            {"name": "March", "orders": Order.objects.filter(created_at__month=3).count()},
            {"name": "April", "orders": Order.objects.filter(created_at__month=4).count()},
            {"name": "May", "orders": Order.objects.filter(created_at__month=5).count()},
            {"name": "June", "orders": Order.objects.filter(created_at__month=6).count()},
            {"name": "July", "orders": Order.objects.filter(created_at__month=7).count()},
            {"name": "August", "orders": Order.objects.filter(created_at__month=8).count()},
            {"name": "September", "orders": Order.objects.filter(created_at__month=9).count()},
            {"name": "October", "orders": Order.objects.filter(created_at__month=10).count()},
            {"name": "November", "orders": Order.objects.filter(created_at__month=11).count()},
            {"name": "December", "orders": Order.objects.filter(created_at__month=12).count()},
        ],
        "statusData": [
            {"name": "Shipped", "value": Order.objects.filter(status="SHIPPED").count()},
            {"name": "Delivered", "value": Order.objects.filter(status="DELIVERED").count()},
            {"name": "Pending", "value": Order.objects.filter(status="PENDING").count()},
        ]
    }