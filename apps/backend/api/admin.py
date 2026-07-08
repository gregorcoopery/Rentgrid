from django.contrib import admin
from api.models import User, Listing, Inspection, Reservation, MaintenanceRequest, Message, WorkflowEvent

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'role', 'email', 'onboarding_complete', 'verification_status')
    search_fields = ('name', 'email', 'clerk_id')
    list_filter = ('role', 'onboarding_complete', 'verification_status')

@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'listing_type', 'segment', 'owner', 'annual_price', 'status')
    search_fields = ('name', 'location', 'university')
    list_filter = ('listing_type', 'segment', 'status')

@admin.register(Inspection)
class InspectionAdmin(admin.ModelAdmin):
    list_display = ('id', 'listing', 'tenant', 'scheduled_for', 'status')
    list_filter = ('status', 'scheduled_for')

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('id', 'listing', 'tenant', 'amount', 'status', 'payment_status')
    list_filter = ('status', 'payment_status')

@admin.register(MaintenanceRequest)
class MaintenanceRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'listing', 'tenant', 'title', 'priority', 'status')
    list_filter = ('priority', 'status')

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'thread_id', 'from_user', 'to_user', 'subject', 'read', 'created_at')
    list_filter = ('read', 'created_at')

@admin.register(WorkflowEvent)
class WorkflowEventAdmin(admin.ModelAdmin):
    list_display = ('id', 'kind', 'actor', 'target_id', 'status', 'created_at')
    list_filter = ('kind', 'status', 'created_at')
