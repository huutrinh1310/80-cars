# Uncomment the required imports before adding the code

from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import logout
from django.contrib import messages
from datetime import datetime

from django.http import JsonResponse
from django.contrib.auth import login, authenticate
import logging
import json
from django.views.decorators.csrf import csrf_exempt
from .restapis import get_request, analyze_review_sentiments, post_review


# Get an instance of a logger
logger = logging.getLogger(__name__)


# Create your views here.

# Create a `login_request` view to handle sign in request
@csrf_exempt
def login_user(request):
    # Get username and password from request.POST dictionary
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    # Try to check if provide credential can be authenticated
    user = authenticate(username=username, password=password)
    data = {"userName": username}
    if user is not None:
        # If user is valid, call login method to login current user
        login(request, user)
        data = {"userName": username, "status": "Authenticated"}
    return JsonResponse(data)

# Create a `logout_request` view to handle sign out request
def logout_request(request):
    logout(request)
    data = {"username": "", "status": "Not Authenticated"}
    return JsonResponse(data)

# Create a `registration` view to handle sign up request
@csrf_exempt
def registration(request):
    # Get username and password from request.POST dictionary
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    email = data['email']
    firstName = data['firstName']
    lastName = data['lastName']
    
    # Check if user exists
    user_exist = False
    email_exist = False
    try:
        User.objects.get(username=username)
        user_exist = True
    except:
        logger.debug("{} is a new user".format(username))
    try:
        User.objects.get(email=email)
        email_exist = True
    except:
        logger.debug("{} is a new email".format(email))
    # If it is a new user
    if not user_exist and not email_exist:
        # Create user in auth_user table
        user = User.objects.create_user(username=username, password=password, email=email, first_name=firstName, last_name=lastName)
        login(request, user)
        data = {"userName": username, "status": "Authenticated"}
        return JsonResponse(data)
    else:
        data = {"userName": username, "status": "User or email already exists"}
        return JsonResponse(data)

def get_cars(request):
    inventory = get_request("/fetchInventory") or []
    cars = []
    for car in inventory:
        cars.append({
            "CarModel": car.get("model", ""),
            "CarMake": car.get("make", ""),
            "id": car.get("id"),
            "year": car.get("year"),
            "mileage": car.get("mileage"),
            "bodyType": car.get("bodyType"),
            "dealer_id": car.get("dealer_id"),
        })
    print(inventory)
    return JsonResponse({"CarModels":cars})

def get_cars_detail(_request, car_id):
    # Call get_cars_from_cf method to get cars from cloudant
    endpoint = "/fetchInventory/" + str(car_id)
    cars = get_request(endpoint)
    return JsonResponse({"status":200,"cars":cars})

# # Update the `get_dealerships` view to render the index page with
# a list of dealerships
#Update the `get_dealerships` render list of dealerships all by default, particular state if state is passed
def get_dealerships(_request, state="All"):
    if(state == "All"):
        endpoint = "/fetchDealers"
    else:
        endpoint = "/fetchDealers/"+state
    dealerships = get_request(endpoint)
    return JsonResponse({"status":200,"dealers":dealerships})

def get_dealer_details(_request, dealer_id):
    if(dealer_id):
        endpoint = "/fetchDealer/"+str(dealer_id)
        dealership = get_request(endpoint)
        return JsonResponse({"status":200,"dealer":dealership})
    else:
        return JsonResponse({"status":400,"message":"Bad Request"})

def get_dealer_reviews(request, dealer_id):
    # if dealer id has been provided
    if(dealer_id):
        endpoint = "/fetchReviews/dealer/"+str(dealer_id)
        reviews = get_request(endpoint)
        for review_detail in reviews:
            response = analyze_review_sentiments(review_detail['review'])
            print(response)
            review_detail['sentiment'] = response['sentiment']
        return JsonResponse({"status":200,"reviews":reviews})
    else:
        return JsonResponse({"status":400,"message":"Bad Request"})

# Create a `get_dealer_details` view to render the dealer details
# def get_dealer_details(request, dealer_id):
# ...


def add_review(request):
    if(request.user.is_anonymous == False):
        data = json.loads(request.body)
        try:
            response = post_review(data)
            
            if response['status'] == 200:
                return JsonResponse({"status":200, "message":"Review posted successfully"})
            else: 
                return JsonResponse({"status":400, "message":"Error in posting review"})
        except:
            return JsonResponse({"status":401,"message":"Error in posting review"})
    else:
        return JsonResponse({"status":403,"message":"Unauthorized"})
