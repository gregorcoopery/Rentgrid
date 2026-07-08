from django.urls import path
from api import views

urlpatterns = [
    path('health', views.health, name='health'),
    path('marketplace', views.marketplace, name='marketplace'),
    path('listings', views.listings_list, name='listings_list'),
    path('listings/<str:listing_id>', views.listing_detail, name='listing_detail'),
    path('workflows', views.workflows, name='workflows'),
    path('onboarding', views.onboarding, name='onboarding'),
    path('payments', views.payments, name='payments'),
    path('notifications', views.notifications, name='notifications'),
    path('analytics', views.analytics, name='analytics'),
    path('dashboard/<str:role>', views.dashboard, name='dashboard'),
    path('webhooks/clerk', views.clerk_webhook, name='clerk_webhook'),
    path('payments/webhook', views.payments_webhook, name='payments_webhook'),
]
