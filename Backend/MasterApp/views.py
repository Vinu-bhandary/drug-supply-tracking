# from django.db import models
# from MasterApp.models import User, Location, Drug
# from django.contrib.auth.hashers import check_password
# from MasterApp.models import User
# from ninja import NinjaAPI

# seed_api = NinjaAPI(urls_namespace="seed_api")

# def login_user(email: str, password: str):
#     """
#     Login function:
#     - Takes email + password
#     - Fetches user from DB
#     - Compares raw password with hashed password_hash field
#     - Returns the user object if correct else None
#     """
#     try:
#         user = User.objects.get(email=email)
#     except User.DoesNotExist:
#         return None

#     if check_password(password, user.password_hash):
#         return user  # login success
    
#     return None  # login failed


# # User CRUD
# @seed_api.post('/user')
# def create_user(data):
#     return User.objects.create(**data)

# @seed_api.get('/user/{user_id}')
# def read_user(user_id):
#     return User.objects.get(id=user_id)

# def update_user(user_id, data):
#     obj = User.objects.get(id=user_id)
#     for k, v in data.items():
#         setattr(obj, k, v)
#     obj.save()
#     return obj

# def delete_user(user_id):
#     obj = User.objects.get(id=user_id)
#     return obj.delete()


# # Location CRUD
# def create_location(data):
#     return Location.objects.create(**data)

# def read_location(location_id):
#     return Location.objects.get(id=location_id)

# def update_location(location_id, data):
#     obj = Location.objects.get(id=location_id)
#     for k, v in data.items():
#         setattr(obj, k, v)
#     obj.save()
#     return obj

# def delete_location(location_id):
#     obj = Location.objects.get(id=location_id)
#     return obj.delete()


# # Drug CRUD
# def create_drug(data):
#     return Drug.objects.create(**data)

# def read_drug(drug_id):
#     return Drug.objects.get(id=drug_id)

# def update_drug(drug_id, data):
#     obj = Drug.objects.get(id=drug_id)
#     for k, v in data.items():
#         setattr(obj, k, v)
#     obj.save()
#     return obj

# def delete_drug(drug_id):
#     obj = Drug.objects.get(id=drug_id)
#     return obj.delete()


# views.py or api.py
from ninja import Router
from .schemas import LocationOut, LocationCreate, DrugOut, UserOut, DrugCreate, UserCreate, SuccessResponse, ErrorResponse
from .models import Location, Drug, User
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
        return 200, {"message": "Login successful", "data": {"user_id": user.id, "username": user.username, "email": user.email, "role": user.role, "location_id": user.location_id.id}}
    
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

# Drug endpoints
@router.get("/drugs/", response=list[DrugOut])
def list_drugs(request):
    return Drug.objects.all()

@router.post("/drugs/", response=DrugOut)
def create_drug(request, payload: DrugCreate):
    drug = Drug.objects.create(**payload.dict())
    return drug

# User endpoints
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
                "location_id": u.location_id.id if u.location_id else None
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
