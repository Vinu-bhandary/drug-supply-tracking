from django.db import models


class Location(models.Model):
    id = models.CharField(primary_key=True, max_length=100)
    name = models.CharField(max_length=150)
    type = models.CharField(max_length=100)
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=50)
    country = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class User(models.Model):
    id = models.CharField(primary_key=True, max_length=100)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    role = models.CharField(max_length=50)
    location_id = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.username


class Drug(models.Model):
    id = models.CharField(primary_key=True, max_length=100)
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    strength = models.CharField(max_length=100)
    unit = models.CharField(max_length=50)
    reorder_point = models.IntegerField()

    def __str__(self):
        return self.name
