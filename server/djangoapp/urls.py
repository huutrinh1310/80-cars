from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from . import views

app_name = 'djangoapp'
urlpatterns = [
    path(route='login', view=views.login_user, name='page login'),
    path(route='logout', view=views.logout_request, name='page logout'),
    path(route='register', view=views.registration, name='page registration'),

    path(route='get_cars', view=views.get_cars, name='api get_cars'),
    path(
        route='get_cars/<int:car_id>',
        view=views.get_cars_detail,
        name='api get_cars_detail',
    ),
    path(
        route='get_dealers',
        view=views.get_dealerships,
        name='api get_dealers',
    ),
    path(
        route='get_dealers/<str:state>',
        view=views.get_dealerships,
        name='api get_dealers_by_state',
    ),

    path(
        route='dealer/<int:dealer_id>',
        view=views.get_dealer_details,
        name='dealer_details',
    ),
    path(
        route='reviews/dealer/<int:dealer_id>',
        view=views.get_dealer_reviews,
        name='dealer_details',
    ),

    path(route='add_review', view=views.add_review, name='api add_review'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
