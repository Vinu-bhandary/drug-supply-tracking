
from ninja import Router
from .schemas import LocationOut, LocationCreate, LocationUpdate, DrugOut, DrugCreate, DrugUpdate, UserOut, UserCreate, UserUpdate, SuccessResponse, ErrorResponse
from .models import Location, Drug, User
from SupplyApp.models import Order, Batch
from InventoryApp.models import Inventory
from django.contrib.auth.hashers import check_password, make_password
import json
from django.utils import timezone
import datetime
from dateutil.relativedelta import relativedelta
from django.db.models import Count
from django.db.models.functions import TruncMonth

router = Router()
router1 = Router()


def get_last_12_months_orders(qs):
    now = datetime.datetime.now()
    start_date = now - relativedelta(months=11)

    data = (
        qs.filter(created_at__gte=start_date)
        .annotate(month=TruncMonth('created_at'))
        .values('month')
        .annotate(count=Count('id'))
        .order_by('month')
    )

    data_map = {
        item['month'].strftime("%Y-%m"): item['count']
        for item in data
    }

    chart_data = []

    for i in range(11, -1, -1):
        target_date = now - relativedelta(months=i)
        key = target_date.strftime("%Y-%m")

        chart_data.append({
            "name": target_date.strftime("%b %Y"),
            "orders": data_map.get(key, 0)
        })

    return chart_data


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

@router.get("/vendors/", response=list[LocationOut])
def list_vendors(request):
    return Location.objects.filter(type="Vendor")                               

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

    return {
        "stats": [
            { "id": 1, "label": 'Total Users', "value": total_users, "icon": '👤', "color": 'blue'},
            { "id": 2, "label": 'Total Hospitals', "value": total_hospitals, "icon": '🏥', "color": 'green'},
            { "id": 3, "label": 'Total Vendors', "value": total_vendors, "icon": '🏬', "color": 'orange'},
            { "id": 4, "label": 'Total Drugs', "value": total_drugs, "icon": '💊', "color": 'red'},
        ],
        "chartData": get_last_12_months_orders(Order.objects.all()),
        "statusData": [
            {"name": "Shipped", "value": Order.objects.filter(status="SHIPPED").count()},
            {"name": "Delivered", "value": Order.objects.filter(status="DELIVERED").count()+Order.objects.filter(status="IN-INVENTORY").count()},
            {"name": "Pending", "value": Order.objects.filter(status="PENDING").count()},
            {"name": "Cancelled", "value": Order.objects.filter(status="CANCELLED").count()},
        ]
    }


@router.get("/hospitalDashboard/{loc_id}", response=dict)
def hospDashboard(request,loc_id:str):
    orders = Order.objects.filter(from_location = loc_id)
    drugs = Inventory.objects.filter(location_id=loc_id)
    shipped=0
    delivered=0
    cancelled = 0
    pending = 0
    exp=0
    for ord in orders:
        if ord.status == "PENDING":
            pending+=1
        elif ord.status == "SHIPPED":
            shipped+=1
        elif ord.status == "DELIVERED" or ord.status == "IN-INVENTORY":
            delivered+=1
        elif ord.status == "CANCELLED":
            cancelled+=1
    for dr in drugs:
        if dr.exp_date-datetime.date.today()<=datetime.timedelta(days=30):
            exp+=1
    
    return {
        "stats": [
            { "id": 1, "label": 'Total orders', "value": orders.count(), "icon": '', "color": 'blue'},
            { "id": 2, "label": 'Total drugs', "value": Inventory.objects.filter(location_id = loc_id).count(), "icon": '🏥', "color": 'green'},
            { "id": 3, "label": 'Near expiry', "value": exp, "icon": '🏬', "color": 'orange'},
            { "id": 4, "label": 'To Be Added Inventory', "value": orders.filter(status="DELIVERED").count(), "icon": '💊', "color": 'red'},
        ],
        "chartData": get_last_12_months_orders(orders),
        "statusData": [
            {"name": "Pending", "value": pending},
            {"name": "Shipped", "value": shipped},
            {"name": "Delivered", "value": delivered},
            {"name": "Cancelled", "value": cancelled},
        ]
    }

@router.get("/vendorDashboard/{loc_id}", response=dict)
def vendDashboard(request,loc_id:str):
    orders = Order.objects.filter(to_location = loc_id)
    inv = Inventory.objects.filter(location_id=loc_id)
    pending, shipped, delivered, cancelled = 0, 0, 0, 0
    for ord in orders:
        if ord.status == "PENDING":
            pending+=1
        elif ord.status == "SHIPPED":
            shipped+=1
        elif ord.status == "DELIVERED" or ord.status == "IN-INVENTORY":
            delivered+=1
        elif ord.status == "CANCELLED":
            cancelled+=1
    
    return {
        "stats": [
            { "id": 1, "label": 'Total orders', "value": Order.objects.filter(to_location = loc_id).count(), "icon": '', "color": 'blue'},
            { "id": 2, "label": 'Pending orders', "value": pending, "icon": '🏥', "color": 'green'},
            { "id": 6, "label": 'Total batches', "value": Batch.objects.count(), "icon": '💊', "color": 'purple'},
            { "id": 4, "label": 'Near Expiry', "value": inv.filter(exp_date__lte=datetime.date.today() + datetime.timedelta(days=30)).count(), "icon": '💊', "color": 'red'},
        ],
        "chartData": get_last_12_months_orders(orders),
        "statusData": [
            {"name": "Pending", "value": pending},
            {"name": "Shipped", "value": shipped},
            {"name": "Delivered", "value": delivered},
            {"name": "Cancelled", "value": cancelled},
        ]
    }