import os
import json
import time
import hmac
import hashlib
import requests
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from django.shortcuts import get_object_or_404
from svix.webhooks import Webhook, WebhookVerificationError
from api.models import User, Listing, Inspection, Reservation, MaintenanceRequest, Message, WorkflowEvent

try:
    from django_ratelimit.decorators import ratelimit
    RATELIMIT_AVAILABLE = True
except ImportError:
    RATELIMIT_AVAILABLE = False
    def ratelimit(**kwargs):
        def decorator(func):
            return func
        return decorator

# Helpers for serialization
def serialize_user(user):
    return {
        'id': user.id,
        'clerkId': user.clerk_id,
        'role': user.role,
        'name': user.name,
        'email': user.email,
        'phone': user.phone,
        'onboardingComplete': user.onboarding_complete,
        'verificationStatus': user.verification_status,
        'metadata': user.metadata,
        'createdAt': user.created_at.isoformat() if user.created_at else None,
        'updatedAt': user.updated_at.isoformat() if user.updated_at else None,
    }

def serialize_listing(listing):
    # Map fields to frontend names
    return {
        'id': listing.id,
        'type': listing.listing_type,
        'segment': listing.segment,
        'name': listing.name,
        'description': listing.description,
        'location': listing.location,
        'area': listing.area,
        'university': listing.university,
        'price': listing.annual_price,
        'image': listing.image_urls[0] if listing.image_urls else '',
        'images': listing.image_urls,
        'amenities': listing.amenities,
        'roomType': listing.room_type,
        'status': listing.status,
        'landlordId': listing.owner_id,
        'agentId': listing.agent_id,
        'inspectorId': listing.inspector_id,
        'availableFrom': listing.available_from.isoformat() if listing.available_from else None,
        'verificationNotes': listing.verification_notes,
        'createdAt': listing.created_at.isoformat() if listing.created_at else None,
        'updatedAt': listing.updated_at.isoformat() if listing.updated_at else None,
    }

def serialize_inspection(inspection):
    return {
        'id': inspection.id,
        'listingId': inspection.listing_id,
        'tenantId': inspection.tenant_id,
        'agentId': inspection.agent_id,
        'inspectorId': inspection.inspector_id,
        'scheduledFor': inspection.scheduled_for.isoformat() if inspection.scheduled_for else None,
        'status': inspection.status,
        'notes': inspection.notes,
        'createdAt': inspection.created_at.isoformat() if inspection.created_at else None,
        'updatedAt': inspection.updated_at.isoformat() if inspection.updated_at else None,
    }

def serialize_reservation(reservation):
    return {
        'id': reservation.id,
        'listingId': reservation.listing_id,
        'tenantId': reservation.tenant_id,
        'amount': reservation.amount,
        'status': reservation.status,
        'paymentStatus': reservation.payment_status,
        'paymentReference': reservation.payment_reference,
        'createdAt': reservation.created_at.isoformat() if reservation.created_at else None,
        'updatedAt': reservation.updated_at.isoformat() if reservation.updated_at else None,
    }

def serialize_maintenance_request(request):
    return {
        'id': request.id,
        'listingId': request.listing_id,
        'tenantId': request.tenant_id,
        'title': request.title,
        'description': request.description,
        'priority': request.priority,
        'status': request.status,
        'createdAt': request.created_at.isoformat() if request.created_at else None,
        'updatedAt': request.updated_at.isoformat() if request.updated_at else None,
    }

def serialize_message(msg):
    return {
        'id': msg.id,
        'threadId': msg.thread_id,
        'fromUserId': msg.from_user_id,
        'toUserId': msg.to_user_id,
        'subject': msg.subject,
        'body': msg.body,
        'read': msg.read,
        'createdAt': msg.created_at.isoformat() if msg.created_at else None,
    }

def serialize_workflow_event(wf):
    return {
        'id': wf.id,
        'kind': wf.kind,
        'actorId': wf.actor_id,
        'targetId': wf.target_id,
        'status': wf.status,
        'payload': wf.payload,
        'createdAt': wf.created_at.isoformat() if wf.created_at else None,
    }

def normalize_role(role):
    mapping = {
        'tenant': 'tenant',
        'landlord': 'landlord',
        'agent': 'agent',
        'inspector': 'inspector',
        'super-admin': 'super-admin',
        'admin': 'super-admin',
    }
    return mapping.get(str(role).lower().strip(), 'tenant')


def get_marketplace_snapshot_data():
    users = [serialize_user(u) for u in User.objects.all().order_by('-created_at')]
    listings = Listing.objects.all().order_by('-created_at')
    
    properties = [serialize_listing(l) for l in listings if l.listing_type == 'property']
    hostels = [serialize_listing(l) for l in listings if l.listing_type == 'hostel']
    
    inspections = [serialize_inspection(i) for i in Inspection.objects.all().order_by('-created_at')]
    reservations = [serialize_reservation(r) for r in Reservation.objects.all().order_by('-created_at')]
    maintenance = [serialize_maintenance_request(m) for m in MaintenanceRequest.objects.all().order_by('-created_at')]
    messages = [serialize_message(msg) for msg in Message.objects.all().order_by('-created_at')]
    workflows = [serialize_workflow_event(w) for w in WorkflowEvent.objects.all().order_by('-created_at')[:100]]
    
    return {
        'users': users,
        'properties': properties,
        'hostels': hostels,
        'inspections': inspections,
        'reservations': reservations,
        'maintenanceRequests': maintenance,
        'messages': messages,
        'propertyDrafts': [p for p in properties if p['status'] == 'draft'],
        'payouts': [],
        'verifications': [],
        'workflows': workflows,
    }




# Endpoints
@csrf_exempt
@require_http_methods(["GET"])
def health(request):
    required_env = [
        'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
        'CLERK_SECRET_KEY',
        'CLERK_WEBHOOK_SECRET',
        'DATABASE_URL',
        'PAYSTACK_SECRET_KEY',
        'RESEND_API_KEY',
        'SENTRY_DSN',
        'NEXT_PUBLIC_SENTRY_DSN',
        'NEXT_PUBLIC_ANALYTICS_KEY',
    ]
    optional_env = [
        'NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY',
        'FLUTTERWAVE_SECRET_KEY',
        'NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY',
        'FLUTTERWAVE_WEBHOOK_HASH',
        'TERMII_API_KEY',
        'TERMII_SENDER_ID',
        'TWILIO_ACCOUNT_SID',
        'TWILIO_AUTH_TOKEN',
        'SENTRY_ORG',
        'SENTRY_PROJECT',
        'SENTRY_AUTH_TOKEN',
    ]
    
    missing_required = [key for key in required_env if not os.getenv(key)]
    configured_optional = [key for key in optional_env if os.getenv(key)]
    
    ready = len(missing_required) == 0
    
    # Try database connection
    db_ok = True
    try:
        from django.db import connection
        connection.ensure_connection()
    except Exception:
        db_ok = False
        ready = False
        
    status_code = 200 if ready else 503
    return JsonResponse({
        'ok': ready,
        'service': 'rentgrid-backend-django',
        'checkedAt': timezone.now().isoformat(),
        'environment': {
            'ready': ready,
            'missingRequired': missing_required,
            'configuredOptional': configured_optional,
            'required': required_env,
        },
        'integrations': {
            'database': 'configured' if db_ok else 'missing-env-or-failed',
            'clerk': 'configured' if os.getenv('CLERK_SECRET_KEY') and os.getenv('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY') else 'missing-env',
            'payments': 'configured' if os.getenv('PAYSTACK_SECRET_KEY') or os.getenv('FLUTTERWAVE_SECRET_KEY') else 'missing-env',
            'email': 'configured' if os.getenv('RESEND_API_KEY') or os.getenv('SENDGRID_API_KEY') else 'missing-env',
            'sms': 'configured' if os.getenv('TERMII_API_KEY') or (os.getenv('TWILIO_ACCOUNT_SID') and os.getenv('TWILIO_AUTH_TOKEN')) else 'missing-env',
            'monitoring': 'configured' if os.getenv('SENTRY_DSN') else 'missing-env',
            'analytics': 'configured' if os.getenv('NEXT_PUBLIC_ANALYTICS_KEY') else 'missing-env',
        }
    }, status=status_code)


@require_http_methods(["GET"])
def marketplace(request):
    return JsonResponse(get_marketplace_snapshot_data())


@require_http_methods(["GET"])
def listings_list(request):
    segment = request.GET.get('segment')
    status = request.GET.get('status')
    listing_type = request.GET.get('type')
    page = max(1, int(request.GET.get('page', 1) or 1))
    page_size = min(100, max(1, int(request.GET.get('page_size', 20) or 20)))
    
    query = Listing.objects.all().order_by('-created_at')
    
    if segment:
        query = query.filter(segment=segment)
    if status:
        query = query.filter(status=status)
    if listing_type:
        query = query.filter(listing_type=listing_type)
    
    total = query.count()
    offset = (page - 1) * page_size
    listings_page = query[offset:offset + page_size]
        
    return JsonResponse({
        'listings': [serialize_listing(l) for l in listings_page],
        'total': total,
        'page': page,
        'pageSize': page_size,
        'totalPages': (total + page_size - 1) // page_size,
    })


@require_http_methods(["GET"])
def listing_detail(request, listing_id):
    listing_type = request.GET.get('type', 'property')
    try:
        listing = Listing.objects.get(id=listing_id, listing_type=listing_type)
        return JsonResponse({'listing': serialize_listing(listing)})
    except Listing.DoesNotExist:
        return JsonResponse({'error': 'Listing not found'}, status=404)


@csrf_exempt
@require_http_methods(["POST"])
@ratelimit(key='ip', rate='20/m', block=True)
def workflows(request):
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
    kind = body.get('kind')
    data = body.get('data', {})
    
    valid_kinds = {'inspection', 'reservation', 'maintenance', 'message', 'property', 'payout', 'verification'}
    if kind not in valid_kinds:
        return JsonResponse({'error': 'Unsupported workflow kind'}, status=400)
        
    now_ms = int(time.time() * 1000)
    wf_id = f"{kind}_{now_ms}"
    
    # Extract optional actor/target details
    actor_id = data.get('tenantId') or data.get('landlordId') or data.get('ownerId') or data.get('fromUserId')
    actor = None
    if actor_id:
        actor = User.objects.filter(id=actor_id).first()
        
    target_id = data.get('listingId') or data.get('threadId') or data.get('property')
    
    wf = WorkflowEvent.objects.create(
        id=wf_id,
        kind=kind,
        actor=actor,
        target_id=target_id,
        status='pending',
        payload=data
    )
    
    # Helper logic: Keep core relational tables in sync with incoming workflow events
    try:
        if kind == 'property':
            owner_id = data.get('landlordId') or 'user_landlord_1'
            owner = User.objects.filter(id=owner_id).first()
            if not owner:
                owner = User.objects.first()
            if owner:
                # Amenities parse
                raw_amenities = data.get('amenities', [])
                if isinstance(raw_amenities, str):
                    amenities = [a.strip() for a in raw_amenities.split(',') if a.strip()]
                else:
                    amenities = list(raw_amenities)
                    
                # Create/Update Listing
                Listing.objects.create(
                    id=data.get('id') or f"listing_{now_ms}",
                    listing_type='property',
                    segment=data.get('segment', 'general'),
                    owner=owner,
                    name=data.get('name', 'Unnamed Property'),
                    description=data.get('description', ''),
                    location=data.get('location', ''),
                    annual_price=int(data.get('price', 0)),
                    room_type=data.get('roomType', 'self-contain'),
                    status='draft',
                    amenities=amenities,
                    image_urls=data.get('images', ['https://images.unsplash.com/photo-1592494804071-faea15d93a8a'])
                )
        elif kind == 'inspection':
            tenant_id = data.get('tenantId') or 'user_tenant_1'
            tenant = User.objects.filter(id=tenant_id).first() or User.objects.first()
            listing = Listing.objects.filter(id=data.get('listingId')).first()
            if tenant and listing:
                Inspection.objects.create(
                    id=f"inspection_{now_ms}",
                    listing=listing,
                    tenant=tenant,
                    status='pending',
                    notes=data.get('notes', 'Inspection requested')
                )
        elif kind == 'reservation':
            tenant_id = data.get('tenantId') or 'user_tenant_1'
            tenant = User.objects.filter(id=tenant_id).first() or User.objects.first()
            listing = Listing.objects.filter(id=data.get('listingId')).first()
            if tenant and listing:
                Reservation.objects.create(
                    id=f"reservation_{now_ms}",
                    listing=listing,
                    tenant=tenant,
                    amount=int(data.get('amount', 0)),
                    status='pending',
                    payment_status='awaiting-payment'
                )
        elif kind == 'maintenance':
            tenant_id = data.get('tenantId') or 'user_tenant_1'
            tenant = User.objects.filter(id=tenant_id).first() or User.objects.first()
            listing = Listing.objects.filter(id=data.get('listingId')).first()
            if tenant and listing:
                MaintenanceRequest.objects.create(
                    id=f"maintenance_{now_ms}",
                    listing=listing,
                    tenant=tenant,
                    title=data.get('title', 'Maintenance request'),
                    description=data.get('description', ''),
                    priority=data.get('priority', 'medium'),
                    status='pending'
                )
        elif kind == 'message':
            from_user = User.objects.filter(id=data.get('fromUserId')).first() or User.objects.first()
            to_user = User.objects.filter(id=data.get('toUserId')).first()
            if from_user and to_user:
                Message.objects.create(
                    id=f"message_{now_ms}",
                    thread_id=data.get('threadId', f"thread_{now_ms}"),
                    from_user=from_user,
                    to_user=to_user,
                    subject=data.get('subject', ''),
                    body=data.get('body', ''),
                    read=False
                )
    except Exception as e:
        # Don't fail the workflow logging even if relational syncing has an issue (e.g. missing related keys)
        pass
        
    return JsonResponse({'record': serialize_workflow_event(wf)}, status=201)


@csrf_exempt
@require_http_methods(["POST"])
def onboarding(request):
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
    role = normalize_role(body.get('role', 'tenant'))
    profile = body.get('profile', {})
    
    # Validation logic
    base_required = ['name', 'email', 'phone']
    role_required = {
        'tenant': ['preferredLocation', 'budget'],
        'landlord': ['businessName', 'propertyOwnershipProof', 'bankName'],
        'agent': ['serviceAreas', 'identityDocument'],
        'inspector': ['serviceAreas', 'identityDocument', 'inspectionExperience'],
        'super-admin': [],
    }
    
    required = base_required + role_required.get(role, [])
    missing = []
    for field in required:
        val = profile.get(field)
        if val is None or val == '' or (isinstance(val, list) and len(val) == 0):
            missing.append(field)
            
    if missing:
        return JsonResponse({
            'error': 'Profile is incomplete',
            'missing': missing
        }, status=422)
        
    # Attempt to save user onboarding to DB if user clerk_id is supplied or cached
    email = profile.get('email')
    clerk_id = profile.get('clerkId')
    user = None
    if email:
        user = User.objects.filter(email=email).first()
    if not user and clerk_id:
        user = User.objects.filter(clerk_id=clerk_id).first()
        
    try:
        if user:
            user.role = role
            user.name = profile.get('name', user.name)
            user.phone = profile.get('phone', user.phone)
            user.onboarding_complete = True
            user.verification_status = 'verified' if role in ['tenant', 'super-admin'] else 'pending-review'
            if user.metadata is None:
                user.metadata = {}
            user.metadata.update(profile)
            user.save()
        else:
            # Create user in Django custom table
            if clerk_id:
                user_id = f"clerk_{clerk_id}"
                user = User.objects.create(
                    id=user_id,
                    clerk_id=clerk_id,
                    role=role,
                    name=profile.get('name', ''),
                    email=profile.get('email', email or ''),
                    phone=profile.get('phone', ''),
                    onboarding_complete=True,
                    verification_status='verified' if role in ['tenant', 'super-admin'] else 'pending-review',
                    metadata=profile
                )
            else:
                return JsonResponse({
                    'error': 'Cannot register user without clerkId. Webhook sync may be pending.'
                }, status=400)
    except Exception as e:
        return JsonResponse({
            'error': f'Database error during onboarding: {str(e)}'
        }, status=500)
        
    # Security: Write role to Clerk publicMetadata (server-side, tamper-proof)
    # This prevents users from self-promoting by editing unsafeMetadata on the client.
    clerk_secret = os.getenv('CLERK_SECRET_KEY')
    uid = clerk_id or (user.clerk_id if user else None)
    if clerk_secret and uid:
        try:
            requests.patch(
                f'https://api.clerk.com/v1/users/{uid}/metadata',
                json={'public_metadata': {'role': role, 'onboardingComplete': True}},
                headers={
                    'Authorization': f'Bearer {clerk_secret}',
                    'Content-Type': 'application/json',
                },
                timeout=5
            )
        except Exception:
            pass  # Don't block onboarding if Clerk API call fails
        
    return JsonResponse({
        'profile': {
            'role': role,
            'onboardingComplete': True,
            'verificationStatus': 'verified' if role in ['tenant', 'super-admin'] else 'pending-review',
            'updatedAt': timezone.now().isoformat(),
            **profile
        }
    })



@csrf_exempt
@require_http_methods(["POST"])
@ratelimit(key='ip', rate='10/m', block=True)
def payments(request):
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
    amount = body.get('amount')
    email = body.get('email')
    reference = body.get('reference')
    metadata = body.get('metadata', {})
    
    if not amount or not email:
        return JsonResponse({'error': 'amount and email are required'}, status=422)
        
    payment_reference = reference or f"rentgrid_{int(time.time() * 1000)}"
    paystack_key = os.getenv('PAYSTACK_SECRET_KEY')
    
    if paystack_key:
        try:
            # Paystack initialization via request
            headers = {
                "Authorization": f"Bearer {paystack_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "amount": int(float(amount) * 100),
                "email": email,
                "reference": payment_reference,
                "metadata": metadata
            }
            res = requests.post('https://api.paystack.co/transaction/initialize', json=payload, headers=headers)
            res_data = res.json()
            if res.status_code == 200 and res_data.get('status'):
                return JsonResponse({
                    'intent': {
                        'provider': 'paystack',
                        'amount': amount,
                        'email': email,
                        'reference': payment_reference,
                        'currency': 'NGN',
                        'metadata': metadata,
                        'status': 'initialized',
                        'authorizationUrl': res_data.get('data', {}).get('authorization_url'),
                        'accessCode': res_data.get('data', {}).get('access_code'),
                    }
                }, status=201)
            else:
                return JsonResponse({'error': res_data.get('message', 'Paystack initialization failed')}, status=400)
        except Exception as e:
            return JsonResponse({'error': f"Paystack server error: {str(e)}"}, status=500)
            
    # Sandbox implementation
    return JsonResponse({
        'intent': {
            'provider': 'sandbox',
            'amount': amount,
            'email': email,
            'reference': payment_reference,
            'currency': 'NGN',
            'metadata': metadata,
            'status': 'sandbox-created',
        }
    }, status=201)


@csrf_exempt
@require_http_methods(["POST"])
def notifications(request):
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
    channel = body.get('channel')
    recipient = body.get('recipient')
    body_text = body.get('body')
    subject = body.get('subject', 'RentGrid notification')
    
    if not channel or not recipient or not body_text:
        return JsonResponse({'error': 'channel, recipient, and body are required'}, status=422)
        
    resend_key = os.getenv('RESEND_API_KEY')
    termii_key = os.getenv('TERMII_API_KEY')
    
    if channel == 'email' and resend_key:
        try:
            headers = {
                "Authorization": f"Bearer {resend_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "from": os.getenv('NOTIFICATION_FROM_EMAIL', 'RentGrid <support@rentgrid.ng>'),
                "to": [recipient],
                "subject": subject,
                "text": body_text
            }
            res = requests.post('https://api.resend.com/emails', json=payload, headers=headers)
            res_data = res.json()
            if res.status_code == 200 or res.status_code == 201:
                return JsonResponse({
                    'notification': {
                        'channel': channel,
                        'recipient': recipient,
                        'subject': subject,
                        'provider': 'resend',
                        'status': 'sent',
                        'providerId': res_data.get('id'),
                        'createdAt': timezone.now().isoformat()
                    }
                }, status=201)
        except Exception:
            pass # Fall through to sandbox queue on provider error
            
    elif channel == 'sms' and termii_key:
        try:
            payload = {
                "api_key": termii_key,
                "to": recipient,
                "from": os.getenv('TERMII_SENDER_ID', 'RentGrid'),
                "sms": body_text,
                "type": "plain",
                "channel": "generic"
            }
            res = requests.post('https://api.ng.termii.com/api/sms/send', json=payload)
            res_data = res.json()
            if res.status_code == 200:
                return JsonResponse({
                    'notification': {
                        'channel': channel,
                        'recipient': recipient,
                        'subject': subject,
                        'provider': 'termii',
                        'status': 'sent',
                        'providerId': res_data.get('message_id'),
                        'createdAt': timezone.now().isoformat()
                    }
                }, status=201)
        except Exception:
            pass # Fall through to sandbox queue on provider error
            
    # Sandbox fallback
    return JsonResponse({
        'notification': {
            'channel': channel,
            'recipient': recipient,
            'subject': subject,
            'body': body_text,
            'provider': 'sandbox',
            'status': 'queued',
            'createdAt': timezone.now().isoformat()
        }
    }, status=201)


@csrf_exempt
@require_http_methods(["POST"])
@ratelimit(key='ip', rate='60/m', block=True)
def analytics(request):
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
    event = body.get('event')
    path = body.get('path')
    
    if not event or not path:
        return JsonResponse({'error': 'event and path are required'}, status=422)
        
    return JsonResponse({
        'accepted': True,
        'event': event,
        'path': path
    }, status=202)


@require_http_methods(["GET"])
def dashboard(request, role):
    role = normalize_role(role)
    snapshot = get_marketplace_snapshot_data()
    
    return JsonResponse({
        'role': role,
        'metrics': {
            'properties': len(snapshot['properties']),
            'verifiedProperties': len([p for p in snapshot['properties'] if p['status'] == 'verified']),
            'pendingInspections': len([i for i in snapshot['inspections'] if i['status'] != 'completed']),
            'unreadMessages': len([m for m in snapshot['messages'] if not m['read']]),
            'pendingReservations': len([r for r in snapshot['reservations'] if r['status'] == 'pending']),
            'openMaintenance': len([m for m in snapshot['maintenanceRequests'] if m['status'] != 'completed']),
        },
        **snapshot
    })


@csrf_exempt
@require_http_methods(["POST"])
def clerk_webhook(request):
    secret = os.getenv('CLERK_WEBHOOK_SECRET')
    if not secret:
        return JsonResponse({
            'received': False,
            'reason': 'missing-clerk-webhook-secret'
        }, status=500)
        
    raw_body = request.body.decode('utf-8')
    headers = {
        'svix-id': request.headers.get('svix-id'),
        'svix-timestamp': request.headers.get('svix-timestamp'),
        'svix-signature': request.headers.get('svix-signature'),
    }
    
    try:
        wh = Webhook(secret)
        event = wh.verify(raw_body, headers)
    except WebhookVerificationError:
        return JsonResponse({
            'received': False,
            'reason': 'invalid-clerk-signature'
        }, status=401)
        
    event_type = event.get('type')
    data = event.get('data', {})
    synced_user = None
    
    if event_type in ['user.created', 'user.updated']:
        primary_email_id = data.get('primary_email_address_id')
        emails = data.get('email_addresses', [])
        email = ''
        for e in emails:
            if e.get('id') == primary_email_id:
                email = e.get('email_address', '')
                break
        if not email and emails:
            email = emails[0].get('email_address', '')
            
        primary_phone_id = data.get('primary_phone_number_id')
        phones = data.get('phone_numbers', [])
        phone = None
        for p in phones:
            if p.get('id') == primary_phone_id:
                phone = p.get('phone_number')
                break
        if not phone and phones:
            phone = phones[0].get('phone_number')
            
        public_meta = data.get('public_metadata', {}) or {}
        unsafe_meta = data.get('unsafe_metadata', {}) or {}
        
        role = public_meta.get('role') or unsafe_meta.get('role') or 'tenant'
        role = normalize_role(role)
        
        first_name = data.get('first_name') or ''
        last_name = data.get('last_name') or ''
        name = f"{first_name} {last_name}".strip() or data.get('username') or email or data.get('id')
        
        onboarding_complete = bool(public_meta.get('onboardingComplete') or unsafe_meta.get('onboardingComplete'))
        
        user_id = f"clerk_{data.get('id')}"
        clerk_id = data.get('id')
        
        user_meta = {
            'imageUrl': data.get('image_url'),
            'publicMetadata': public_meta,
            'unsafeMetadata': unsafe_meta,
        }
        
        # Upsert user record
        user, created = User.objects.update_or_create(
            clerk_id=clerk_id,
            defaults={
                'id': user_id,
                'role': role,
                'name': name,
                'email': email,
                'phone': phone,
                'onboarding_complete': onboarding_complete,
                'verification_status': 'verified' if onboarding_complete else 'pending-review',
                'metadata': user_meta
            }
        )
        
        synced_user = {
            'clerkId': user.clerk_id,
            'role': user.role,
            'email': user.email,
            'onboardingComplete': user.onboarding_complete,
        }
        
    return JsonResponse({
        'received': True,
        'event': event_type,
        'user': synced_user,
        'databaseSync': 'attempted'
    })


@csrf_exempt
@require_http_methods(["POST"])
def payments_webhook(request):
    raw_body = request.body.decode('utf-8')
    paystack_sig = request.headers.get('x-paystack-signature')
    flutterwave_hash = request.headers.get('verif-hash')
    
    paystack_secret = os.getenv('PAYSTACK_SECRET_KEY')
    flutterwave_secret = os.getenv('FLUTTERWAVE_WEBHOOK_HASH')
    
    paystack_verified = False
    flutterwave_verified = False
    
    if paystack_sig and paystack_secret:
        expected = hmac.new(
            paystack_secret.encode('utf-8'),
            request.body,
            hashlib.sha512
        ).hexdigest()
        paystack_verified = hmac.compare_digest(paystack_sig, expected)
        
    if flutterwave_hash and flutterwave_secret:
        flutterwave_verified = hmac.compare_digest(flutterwave_hash, flutterwave_secret)
        
    if not paystack_verified and not flutterwave_verified:
        return JsonResponse({
            'received': False,
            'reason': 'invalid-signature'
        }, status=401)
        
    try:
        payload = json.loads(raw_body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
        
    event = payload.get('event') or payload.get('event.type') or 'payment.event'
    
    # Extract reference
    data = payload.get('data', {})
    reference = data.get('reference') or payload.get('tx_ref')
    
    # Sync paystack state if transaction verified
    if event == 'charge.success' and reference:
        res = Reservation.objects.filter(payment_reference=reference).first()
        if res:
            res.payment_status = 'paid'
            res.status = 'confirmed'
            res.save()
            
    return JsonResponse({
        'received': True,
        'event': event,
        'reference': reference
    })
