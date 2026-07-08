from django.core.management.base import BaseCommand
from django.utils import timezone
from api.models import User, Listing, Inspection, Reservation, MaintenanceRequest, Message, WorkflowEvent

class Command(BaseCommand):
    help = 'Seeds the RentGrid database with initial mock data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')

        # 1. Clear existing data
        WorkflowEvent.objects.all().delete()
        Message.objects.all().delete()
        MaintenanceRequest.objects.all().delete()
        Reservation.objects.all().delete()
        Inspection.objects.all().delete()
        Listing.objects.all().delete()
        User.objects.all().delete()

        # 2. Seed Users
        users_data = [
            {
                'id': 'user_tenant_1',
                'clerk_id': 'seed_tenant',
                'role': 'tenant',
                'name': 'Ada Tenant',
                'email': 'ada@example.com',
                'phone': '+2348001234567',
                'onboarding_complete': True,
                'verification_status': 'verified',
            },
            {
                'id': 'user_landlord_1',
                'clerk_id': 'seed_landlord',
                'role': 'landlord',
                'name': 'Kemi Landlord',
                'email': 'kemi@example.com',
                'phone': '+2348002222222',
                'onboarding_complete': True,
                'verification_status': 'verified',
                'metadata': {
                    'bank': {
                        'bankName': 'GTBank',
                        'accountName': 'Kemi Properties Ltd',
                        'accountNumberLast4': '1290',
                    }
                }
            },
            {
                'id': 'user_agent_1',
                'clerk_id': 'seed_agent',
                'role': 'agent',
                'name': 'Michael Agent',
                'email': 'michael@example.com',
                'phone': '+2348003333333',
                'onboarding_complete': True,
                'verification_status': 'verified',
                'metadata': {'serviceAreas': ['Lekki', 'Yaba', 'Akoka']}
            },
            {
                'id': 'user_inspector_1',
                'clerk_id': 'seed_inspector',
                'role': 'inspector',
                'name': 'Chika Inspector',
                'email': 'chika@example.com',
                'phone': '+2348004444444',
                'onboarding_complete': True,
                'verification_status': 'verified',
                'metadata': {'serviceAreas': ['Lagos Mainland', 'Lagos Island']}
            },
        ]

        users = {}
        for u in users_data:
            user = User.objects.create(**u)
            users[user.id] = user

        self.stdout.write(f"Seeded {len(users)} users.")

        # 3. Seed Listings (Properties)
        properties_data = [
            {
                'id': '1',
                'listing_type': 'property',
                'segment': 'general',
                'name': 'Luxury 2-Bed Apartment',
                'location': 'Lekki Phase 1, Lagos',
                'area': 'lagos_island',
                'annual_price': 3500000,
                'amenities': ['power', 'security', 'parking', 'water'],
                'room_type': '2bed',
                'owner': users['user_landlord_1'],
                'agent': users['user_agent_1'],
                'inspector': users['user_inspector_1'],
                'status': 'verified',
                'available_from': '2026-08-01',
                'verification_notes': 'Address, photos, utilities, and ownership documents verified.',
                'image_urls': ['https://images.unsplash.com/photo-1592494804071-faea15d93a8a']
            },
            {
                'id': '2',
                'listing_type': 'property',
                'segment': 'student',
                'name': 'Royal Heights Hostel',
                'location': 'Akoka, Lagos',
                'area': 'lagos_mainland',
                'university': 'unilag',
                'annual_price': 150000,
                'amenities': ['wifi', 'power', 'security'],
                'room_type': 'self-contain',
                'owner': users['user_landlord_1'],
                'agent': users['user_agent_1'],
                'inspector': users['user_inspector_1'],
                'status': 'verified',
                'available_from': '2026-07-20',
                'verification_notes': 'Student proximity and safety checks completed.',
                'image_urls': ['https://images.unsplash.com/photo-1683229284577-4e697f2cbe19']
            },
            {
                'id': '3',
                'listing_type': 'property',
                'segment': 'general',
                'name': 'Cozy Studio Flat',
                'location': 'Yaba, Lagos',
                'area': 'lagos_mainland',
                'annual_price': 800000,
                'amenities': ['power', 'water'],
                'room_type': 'self-contain',
                'owner': users['user_landlord_1'],
                'agent': users['user_agent_1'],
                'inspector': users['user_inspector_1'],
                'status': 'pending-review',
                'available_from': '2026-07-18',
                'verification_notes': 'Awaiting final water and power evidence.',
                'image_urls': ['https://images.unsplash.com/photo-1658040713006-926bad583a73']
            },
            {
                'id': '4',
                'listing_type': 'property',
                'segment': 'student',
                'name': "Scholar's Lodge",
                'location': 'Bodija, Ibadan',
                'area': 'ibadan',
                'university': 'ui',
                'annual_price': 95000,
                'amenities': ['wifi', 'security', 'water'],
                'room_type': 'single',
                'owner': users['user_landlord_1'],
                'status': 'verified',
                'available_from': '2026-09-01',
                'verification_notes': 'Verified for student rental standards.',
                'image_urls': ['https://images.unsplash.com/photo-1629079447838-3d78840ee8cf']
            },
        ]

        listings = {}
        for p in properties_data:
            listing = Listing.objects.create(**p)
            listings[listing.id] = listing

        # 4. Seed Listings (Hostels - Unique ID to prevent primary key collision)
        hostels_data = [
            {
                'id': 'hostel_1',
                'listing_type': 'hostel',
                'segment': 'student',
                'name': 'Royal Heights',
                'location': 'Akoka, Lagos',
                'university': 'unilag',
                'annual_price': 120000,
                'amenities': ['wifi', 'power', 'security'],
                'room_type': 'self-contain',
                'owner': users['user_landlord_1'],
                'agent': users['user_agent_1'],
                'inspector': users['user_inspector_1'],
                'status': 'verified',
                'image_urls': ['https://images.unsplash.com/photo-1683229284577-4e697f2cbe19']
            },
            {
                'id': 'hostel_2',
                'listing_type': 'hostel',
                'segment': 'student',
                'name': "Scholar's Lodge",
                'location': 'Bodija, Ibadan',
                'university': 'ui',
                'annual_price': 95000,
                'amenities': ['wifi', 'security', 'water'],
                'room_type': 'shared',
                'owner': users['user_landlord_1'],
                'status': 'verified',
                'image_urls': ['https://images.unsplash.com/photo-1680210851458-b7dc5685e06e']
            },
            {
                'id': 'hostel_3',
                'listing_type': 'hostel',
                'segment': 'student',
                'name': 'Campus View Apartments',
                'location': 'Ile-Ife, Osun',
                'university': 'oau',
                'annual_price': 85000,
                'amenities': ['wifi', 'power', 'parking'],
                'room_type': 'apartment',
                'owner': users['user_landlord_1'],
                'status': 'verified',
                'image_urls': ['https://images.unsplash.com/photo-1657639754502-3c138cb24b4c']
            },
            {
                'id': 'hostel_4',
                'listing_type': 'hostel',
                'segment': 'student',
                'name': 'Elite Residence',
                'location': 'Yaba, Lagos',
                'university': 'unilag',
                'annual_price': 150000,
                'amenities': ['wifi', 'power', 'security', 'kitchen'],
                'room_type': 'single',
                'owner': users['user_landlord_1'],
                'status': 'verified',
                'image_urls': ['https://images.unsplash.com/photo-1658040713006-926bad583a73']
            },
            {
                'id': 'hostel_5',
                'listing_type': 'hostel',
                'segment': 'student',
                'name': 'Student Haven',
                'location': 'Nsukka, Enugu',
                'university': 'unn',
                'annual_price': 75000,
                'amenities': ['wifi', 'water', 'security'],
                'room_type': 'shared',
                'owner': users['user_landlord_1'],
                'status': 'verified',
                'image_urls': ['https://images.unsplash.com/photo-1531904300735-5f40721f712f']
            },
        ]

        for h in hostels_data:
            listing = Listing.objects.create(**h)
            listings[listing.id] = listing

        self.stdout.write(f"Seeded {len(properties_data) + len(hostels_data)} listings.")

        # 5. Seed Inspections
        Inspection.objects.create(
            id='inspection_1',
            listing=listings['1'],
            tenant=users['user_tenant_1'],
            agent=users['user_agent_1'],
            inspector=users['user_inspector_1'],
            scheduled_for=timezone.now() + timezone.timedelta(days=1),
            status='confirmed',
            notes='Tenant requested morning viewing.'
        )
        Inspection.objects.create(
            id='inspection_2',
            listing=listings['2'],
            tenant=users['user_tenant_1'],
            agent=users['user_agent_1'],
            inspector=users['user_inspector_1'],
            scheduled_for=timezone.now() + timezone.timedelta(days=2),
            status='pending',
            notes='Awaiting landlord confirmation.'
        )

        # 6. Seed Reservations
        Reservation.objects.create(
            id='reservation_1',
            listing=listings['1'],
            tenant=users['user_tenant_1'],
            amount=350000,
            status='pending',
            payment_status='awaiting-payment'
        )

        # 7. Seed Maintenance requests
        MaintenanceRequest.objects.create(
            id='maintenance_1',
            listing=listings['1'],
            tenant=users['user_tenant_1'],
            title='Kitchen sink leak',
            priority='medium',
            status='pending'
        )

        # 8. Seed Messages
        Message.objects.create(
            id='message_1',
            thread_id='thread_1',
            from_user=users['user_tenant_1'],
            to_user=users['user_landlord_1'],
            subject='Inspection availability',
            body='Can I inspect the Lekki apartment on Wednesday morning?',
            read=False
        )

        self.stdout.write("Database seeding complete!")
