
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


@router.get("/drugs/", response=list[DrugOut])
def list_drugs(request):
    return Drug.objects.all()

@router.post("/drugs/", response=DrugOut)
def create_drug(request, payload: DrugCreate):
    drug = Drug.objects.create(**payload.dict())
    return drug


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