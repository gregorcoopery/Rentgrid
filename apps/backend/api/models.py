from django.db import models
from django.contrib.postgres.fields import ArrayField

class User(models.Model):
    ROLE_CHOICES = [
        ('tenant', 'Tenant'),
        ('landlord', 'Landlord'),
        ('agent', 'Agent'),
        ('inspector', 'Inspector'),
        ('super-admin', 'Super Admin'),
    ]
    VERIFICATION_CHOICES = [
        ('pending-review', 'Pending Review'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    ]

    id = models.CharField(max_length=255, primary_key=True)
    clerk_id = models.CharField(max_length=255, unique=True)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    phone = models.CharField(max_length=50, null=True, blank=True)
    onboarding_complete = models.BooleanField(default=False)
    verification_status = models.CharField(max_length=50, choices=VERIFICATION_CHOICES, default='pending-review')
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return f"{self.name} ({self.role})"


class Listing(models.Model):
    TYPE_CHOICES = [
        ('property', 'Property'),
        ('hostel', 'Hostel'),
    ]
    SEGMENT_CHOICES = [
        ('general', 'General'),
        ('student', 'Student'),
    ]
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending-review', 'Pending Review'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    ]

    id = models.CharField(max_length=255, primary_key=True)
    listing_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    segment = models.CharField(max_length=50, choices=SEGMENT_CHOICES)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')
    agent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='agent_listings')
    inspector = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='inspector_listings')
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    location = models.CharField(max_length=255)
    area = models.CharField(max_length=255, null=True, blank=True)
    university = models.CharField(max_length=255, null=True, blank=True)
    annual_price = models.IntegerField()
    room_type = models.CharField(max_length=100)
    amenities = ArrayField(models.TextField(), default=list, blank=True)
    image_urls = ArrayField(models.TextField(), default=list, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='draft')
    available_from = models.DateField(null=True, blank=True)
    verification_notes = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'listings'

    def __str__(self):
        return f"{self.name} ({self.listing_type})"


class Inspection(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('flagged', 'Flagged'),
    ]

    id = models.CharField(max_length=255, primary_key=True)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='inspections')
    tenant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tenant_inspections')
    agent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='agent_inspections')
    inspector = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='inspector_inspections')
    scheduled_for = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'inspections'


class Reservation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('flagged', 'Flagged'),
    ]

    id = models.CharField(max_length=255, primary_key=True)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='reservations')
    tenant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservations')
    amount = models.IntegerField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    payment_status = models.CharField(max_length=100, default='awaiting-payment')
    payment_reference = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'reservations'


class MaintenanceRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('flagged', 'Flagged'),
    ]

    id = models.CharField(max_length=255, primary_key=True)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='maintenance_requests')
    tenant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='maintenance_requests')
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    priority = models.CharField(max_length=50, default='medium')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'maintenance_requests'


class Message(models.Model):
    id = models.CharField(max_length=255, primary_key=True)
    thread_id = models.CharField(max_length=255)
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    subject = models.CharField(max_length=255, null=True, blank=True)
    body = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'messages'


class WorkflowEvent(models.Model):
    id = models.CharField(max_length=255, primary_key=True)
    kind = models.CharField(max_length=100)
    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='workflow_events')
    target_id = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=100, default='pending')
    payload = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'workflow_events'
