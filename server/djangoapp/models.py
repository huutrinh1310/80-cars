# Uncomment the following imports before adding the Model code

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


# Create your models here.

class CarMake(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name


class CarModel(models.Model):
    make = models.ForeignKey(CarMake, on_delete=models.CASCADE)
    model = models.CharField(max_length=100)
    CAR_TYPES = [
        ('SEDAN', 'Sedan'),
        ('SUV', 'SUV'),
        ('WAGON', 'Wagon'),
        # Add more choices as required
    ]
    type = models.CharField(max_length=10, choices=CAR_TYPES, default='SUV')
    year = models.IntegerField(
        default=2023,
        validators=[MaxValueValidator(2023), MinValueValidator(2015)],
    )
    dealer_id = models.IntegerField()
    mileage = models.IntegerField(default=0, validators=[MinValueValidator(0)])

    def __str__(self):
        return self.model


class Dealer(models.Model):
    id = models.AutoField(primary_key=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    st = models.CharField(max_length=100)
    address = models.CharField(max_length=200)
    zip_code = models.CharField(max_length=20)
    lat = models.FloatField()
    long = models.FloatField()
    short_name = models.CharField(max_length=100)
    full_name = models.CharField(max_length=100)

    def __str__(self):
        return self.full_name
