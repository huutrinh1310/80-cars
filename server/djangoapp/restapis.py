# Uncomment the imports below before you add the function code
import requests
import os
from urllib.parse import quote
from dotenv import load_dotenv

load_dotenv()

backend_url = os.getenv(
    'backend_url', default="http://localhost:3030")
sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default="http://localhost:5050/")

def get_request(endpoint, **kwargs):
    params = ""
    if(kwargs):
        for key,value in kwargs.items():
            params=params+key+"="+value+"&"

    request_url = backend_url + endpoint
    if params:
        request_url += "?" + params.rstrip("&")

    print("GET from {} ".format(request_url))
    try:
        # Call get method of requests library with URL and parameters
        response = requests.get(request_url)
        return response.json()
    except:
        # If any error occurs
        print("Network exception occurred")

# Add code for get requests to back end

def analyze_review_sentiments(text):
    # Add code for retrieving sentiments
    request_url = sentiment_analyzer_url + "analyze/" + quote(text, safe="")
    try:
        response = requests.get(request_url)
        return response.json()
    except:
        print("Network exception occurred")

def post_review(data_dict):
    request_url = backend_url+"/insert_review"
    try:
        response = requests.post(request_url,json=data_dict)
        print(response.json())
        return response.json()
    except:
        print("Network exception occurred")

