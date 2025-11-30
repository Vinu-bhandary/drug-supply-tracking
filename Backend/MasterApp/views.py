from django.db import models
from MasterApp.models import User, Location, Drug

# User CRUD
def create_user(data):
    return User.objects.create(**data)

def read_user(user_id):
    return User.objects.get(id=user_id)

def update_user(user_id, data):
    obj = User.objects.get(id=user_id)
    for k, v in data.items():
        setattr(obj, k, v)
    obj.save()
    return obj

def delete_user(user_id):
    obj = User.objects.get(id=user_id)
    return obj.delete()


# Location CRUD
def create_location(data):
    return Location.objects.create(**data)

def read_location(location_id):
    return Location.objects.get(id=location_id)

def update_location(location_id, data):
    obj = Location.objects.get(id=location_id)
    for k, v in data.items():
        setattr(obj, k, v)
    obj.save()
    return obj

def delete_location(location_id):
    obj = Location.objects.get(id=location_id)
    return obj.delete()


# Drug CRUD
def create_drug(data):
    return Drug.objects.create(**data)

def read_drug(drug_id):
    return Drug.objects.get(id=drug_id)

def update_drug(drug_id, data):
    obj = Drug.objects.get(id=drug_id)
    for k, v in data.items():
        setattr(obj, k, v)
    obj.save()
    return obj

def delete_drug(drug_id):
    obj = Drug.objects.get(id=drug_id)
    return obj.delete()
