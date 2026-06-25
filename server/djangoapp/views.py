import json
import logging

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .restapis import analyze_review_sentiments, get_request, post_review


logger = logging.getLogger(__name__)


@csrf_exempt
@require_http_methods(["POST"])
def login_user(request):
    try:
        data = json.loads(request.body or b"{}")
    except json.JSONDecodeError:
        return JsonResponse(
            {"status": "Bad Request", "error": "Invalid JSON body"},
            status=400,
        )

    username = data.get("userName") or data.get("username")
    password = data.get("password")

    if not username or not password:
        return JsonResponse(
            {
                "status": "Bad Request",
                "error": "Username and password are required",
            },
            status=400,
        )

    user = authenticate(username=username, password=password)
    if user is None:
        return JsonResponse(
            {
                "status": "Unauthorized",
                "error": "Invalid username or password",
            },
            status=401,
        )

    login(request, user)
    return JsonResponse(
        {
            "status": "Authenticated",
            "userName": user.username,
            "firstName": user.first_name,
            "lastName": user.last_name,
            "email": user.email,
            "access_token": request.session.session_key,
        },
        status=200,
    )


@csrf_exempt
@require_http_methods(["POST"])
def logout_request(request):
    logout(request)
    return JsonResponse({"status": "Not Authenticated"}, status=200)


@csrf_exempt
@require_http_methods(["POST"])
def registration(request):
    try:
        data = json.loads(request.body or b"{}")
    except json.JSONDecodeError:
        return JsonResponse(
            {"status": "Bad Request", "error": "Invalid JSON body"},
            status=400,
        )

    username = data.get("userName") or data.get("username")
    password = data.get("password")
    email = data.get("email")
    first_name = data.get("firstName", "")
    last_name = data.get("lastName", "")

    if not username or not password or not email:
        return JsonResponse(
            {
                "status": "Bad Request",
                "error": "Username, password, and email are required",
            },
            status=400,
        )

    if User.objects.filter(username=username).exists():
        return JsonResponse(
            {"status": "Conflict", "error": "Username already exists"},
            status=409,
        )

    if User.objects.filter(email=email).exists():
        return JsonResponse(
            {"status": "Conflict", "error": "Email already exists"},
            status=409,
        )

    user = User.objects.create_user(
        username=username,
        password=password,
        email=email,
        first_name=first_name,
        last_name=last_name,
    )
    login(request, user)
    return JsonResponse(
        {
            "status": "Authenticated",
            "userName": user.username,
            "firstName": user.first_name,
            "lastName": user.last_name,
            "email": user.email,
            "access_token": request.session.session_key,
        },
        status=201,
    )


def get_cars(request):
    inventory = get_request("/fetchInventory") or []
    cars = []
    for car in inventory:
        cars.append(
            {
                "CarModel": car.get("model", ""),
                "CarMake": car.get("make", ""),
                "id": car.get("id"),
                "year": car.get("year"),
                "mileage": car.get("mileage"),
                "bodyType": car.get("bodyType"),
                "dealer_id": car.get("dealer_id"),
            }
        )
    print(inventory)
    return JsonResponse({"CarModels": cars})


def get_cars_detail(_request, car_id):
    endpoint = "/fetchInventory/" + str(car_id)
    cars = get_request(endpoint)
    return JsonResponse({"status": 200, "cars": cars})


def get_dealerships(_request, state="All"):
    if state == "All":
        endpoint = "/fetchDealers"
    else:
        endpoint = "/fetchDealers/" + state
    dealerships = get_request(endpoint)
    return JsonResponse({"status": 200, "dealers": dealerships})


def get_dealer_details(_request, dealer_id):
    if dealer_id:
        endpoint = "/fetchDealer/" + str(dealer_id)
        dealership = get_request(endpoint)
        return JsonResponse({"status": 200, "dealer": dealership})
    return JsonResponse({"status": 400, "message": "Bad Request"})


def get_dealer_reviews(request, dealer_id):
    if dealer_id:
        endpoint = "/fetchReviews/dealer/" + str(dealer_id)
        reviews = get_request(endpoint) or []
        for review_detail in reviews:
            response = analyze_review_sentiments(review_detail["review"])
            print(response)
            review_detail["sentiment"] = (
                response.get("sentiment", "neutral") if response else "neutral"
            )
        return JsonResponse({"status": 200, "reviews": reviews})
    return JsonResponse({"status": 400, "message": "Bad Request"})


def add_review(request):
    if request.user.is_anonymous:
        return JsonResponse(
            {"status": 403, "error": "Unauthorized"},
            status=403,
        )

    if request.method != "POST":
        return JsonResponse(
            {"status": 405, "error": "Method not allowed"},
            status=405,
        )

    try:
        data = json.loads(request.body or b"{}")
    except json.JSONDecodeError:
        return JsonResponse(
            {"status": 400, "error": "Invalid JSON body"},
            status=400,
        )

    try:
        response = post_review(data)
    except Exception:
        logger.exception("Failed to forward review to backend API")
        return JsonResponse(
            {"status": 502, "error": "Review service unavailable"},
            status=502,
        )

    if response and response.get("status") == 200:
        return JsonResponse(
            {"status": 200, "message": "Review posted successfully"},
            status=200,
        )

    return JsonResponse(
        {
            "status": 400,
            "error": "Error in posting review",
            "details": response,
        },
        status=400,
    )
