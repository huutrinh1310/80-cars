# Introduction

- This is a project web application about the Car models, including many functions such as:
+ Authentication/ Authorization.
+ Showing a dealers list
+ Inventory detail page
+ Feedback Inventory


# Getting started

This project was bootstrapped with React Vite App, and BE is Djangoapp and MongoDB

## Start MongoDB

First ensure that you already installed Docker

```
cd 80-cars/server/database
```

Step 1: Build

```
docker build . -t nodeapp
```

Step 2: Start

```
docker-compose up # or docker compose up
```

## Build FE to get a latest version of FE

```
cd 80-cars/server/frontend
```

pnpm 
```
pnpm run build # or pnpm build
```

## Start server

### Run the command given below to set up the Django environment:

```
pip install virtualenv
virtualenv djangoenv
source djangoenv/bin/activate
```

### Install the required packages by running the command given below.
```
python3 -m pip install -U -r requirements.txt

```
### Run the command given below to perform model migration.
```
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver
```

