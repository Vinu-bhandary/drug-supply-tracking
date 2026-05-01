from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.hashers import make_password
import random



from MasterApp.models import User, Location, Drug
from InventoryApp.models import Inventory, Alert, ConsumptionRecord
from SupplyApp.models import Order, OrderItem, Batch
from AiApp.models import Forecast
from BlockchainApp.models import BlockchainTransaction


class Command(BaseCommand):
    help = "Seed database with sample data for drug supply tracking system"

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("Seeding database..."))

        today = timezone.now().date()

        # ========== 1. LOCATIONS ==========
        self.stdout.write("Creating locations...")

        hosp_mum, _ = Location.objects.get_or_create(
            id="HOSP-MUM-01",
            defaults=dict(
                name="City General Hospital, Mumbai",
                type="Hospital",
                address_line1="123 Medical Plaza",
                address_line2="Downtown",
                city="Mumbai",
                state="Maharashtra",
                postal_code="400001",
                country="India",
            ),
        )

        hosp_blr, _ = Location.objects.get_or_create(
            id="HOSP-BLR-01",
            defaults=dict(
                name="Fortis Hospital, Bengaluru",
                type="Hospital",
                address_line1="456 Health Park",
                address_line2="Electronic City",
                city="Bengaluru",
                state="Karnataka",
                postal_code="560100",
                country="India",
            ),
        )

        hosp_delhi, _ = Location.objects.get_or_create(
            id="HOSP-DEL-01",
            defaults=dict(
                name="Apollo Hospital, New Delhi",
                type="Hospital",
                address_line1="789 Delhi Medical Center",
                address_line2="Connaught Place",
                city="New Delhi",
                state="Delhi",
                postal_code="110001",
                country="India",
            ),
        )

        vendor_delhi, _ = Location.objects.get_or_create(
            id="VEND-DEL-01",
            defaults=dict(
                name="MedSupply Distributors, Delhi",
                type="Vendor",
                address_line1="789 Pharma Hub",
                address_line2=None,
                city="New Delhi",
                state="Delhi",
                postal_code="110001",
                country="India",
            ),
        )

        vendor_mum, _ = Location.objects.get_or_create(
            id="VEND-MUM-01",
            defaults=dict(
                name="PharmaCare Wholesalers, Mumbai",
                type="Vendor",
                address_line1="101 Medical Trade Center",
                address_line2=None,
                city="Mumbai",
                state="Maharashtra",
                postal_code="400002",
                country="India",
            ),
        )

        # ========== 2. USERS ==========
        self.stdout.write("Creating users...")

        admin, _ = User.objects.get_or_create(
            id="user-admin-01",
            defaults=dict(
                username="admin",
                email="admin@dst.com",
                password_hash=make_password("admin123"),
                role="ADMIN",
                location_id=None,
            ),
        )

        hosp_user, _ = User.objects.get_or_create(
            id="user-hosp-01",
            defaults=dict(
                username="hosp_mumbai",
                email="hospital@citygeneral.com",
                password_hash=make_password("hospital123"),
                role="HOSPITAL",
                location_id=hosp_mum,
            ),
        )

        hosp_user_blr, _ = User.objects.get_or_create(
            id="user-hosp-02",
            defaults=dict(
                username="hosp_bengaluru",
                email="hospital@fortis.com",
                password_hash=make_password("hospital123"),
                role="HOSPITAL",
                location_id=hosp_blr,
            ),
        )

        vendor_user, _ = User.objects.get_or_create(
            id="user-vendor-01",
            defaults=dict(
                username="vendor_medsupply",
                email="admin@medsupply.com",
                password_hash=make_password("vendor123"),
                role="VENDOR",
                location_id=vendor_delhi,
            ),
        )

        # ========== 3. DRUGS (15 rows) ==========
        self.stdout.write("Creating drugs...")

        drugs_data = [
            ("DRUG-PCM-500", "Paracetamol 500mg", "Analgesic", "500mg", "tablets", 500),
            ("DRUG-MET-500", "Metformin 500mg", "Diabetic Care", "500mg", "tablets", 300),
            ("DRUG-AMOX-250", "Amoxicillin 250mg", "Antibiotic", "250mg", "capsules", 400),
            ("DRUG-LISI-10", "Lisinopril 10mg", "Cardiovascular", "10mg", "tablets", 200),
            ("DRUG-ASP-500", "Aspirin 500mg", "Analgesic", "500mg", "tablets", 350),
            ("DRUG-IBU-400", "Ibuprofen 400mg", "Analgesic", "400mg", "tablets", 450),
            ("DRUG-OMEP-20", "Omeprazole 20mg", "Gastro", "20mg", "capsules", 280),
            ("DRUG-LORA-10", "Loratadine 10mg", "Antihistamine", "10mg", "tablets", 320),
            ("DRUG-CEFT-500", "Ceftriaxone 500mg", "Antibiotic", "500mg", "injection", 150),
            ("DRUG-CIPRO-500", "Ciprofloxacin 500mg", "Antibiotic", "500mg", "tablets", 220),
            ("DRUG-DOLO-650", "Paracetamol 650mg", "Analgesic", "650mg", "tablets", 380),
            ("DRUG-ATEN-50", "Atenolol 50mg", "Cardiovascular", "50mg", "tablets", 240),
            ("DRUG-AMLODIP-5", "Amlodipine 5mg", "Cardiovascular", "5mg", "tablets", 260),
            ("DRUG-ATORVA-20", "Atorvastatin 20mg", "Lipid Lowering", "20mg", "tablets", 290),
            ("DRUG-RANITID-150", "Ranitidine 150mg", "Gastro", "150mg", "tablets", 310),
        ]

        drugs = {}
        for drug_id, name, category, strength, unit, reorder_point in drugs_data:
            drug, _ = Drug.objects.get_or_create(
                id=drug_id,
                defaults=dict(
                    name=name,
                    category=category,
                    strength=strength,
                    unit=unit,
                    reorder_point=reorder_point,
                ),
            )
            drugs[drug_id] = drug

        # ========== 4. BATCHES (15 rows) ==========
        self.stdout.write("Creating batches...")

        batches = {}
        batch_counter = 1
        for drug_id, drug in drugs.items():
            batch_id = f"BATCH-{drug_id.split('-')[1]}-001"
            batch, _ = Batch.objects.get_or_create(
                id=batch_id,
                defaults=dict(
                    drug_id=drug,
                    batch_number=f"{drug_id.split('-')[1]}-2024-001",
                    mfg_date=today - timedelta(days=random.randint(100, 250)),
                    exp_date=today + timedelta(days=random.randint(200, 550)),
                    blockchain_hash=f"0x{drug_id.split('-')[1].upper()}batch001",
                    qr_code_data=f"{drug_id.split('-')[1]}-2024-001|{drug_id}",
                ),
            )
            batches[batch_id] = batch

        # ========== 5. INVENTORY (15 rows) ==========
        self.stdout.write("Creating inventory...")

        locations = [hosp_mum, hosp_blr, hosp_delhi]
        inv_counter = 1
        for batch_id, batch in list(batches.items())[:15]:
            location = locations[inv_counter % len(locations)]
            Inventory.objects.get_or_create(
                id=f"INV-{inv_counter:03d}",
                defaults=dict(
                    location_id=location,
                    drug_id=batch.drug_id,
                    batch_id=batch,
                    qty_on_hand=random.randint(200, 2000),
                    exp_date=batch.exp_date,
                ),
            )
            inv_counter += 1

        # ========== 6. ORDERS + ORDER ITEMS (15 orders) ==========
        self.stdout.write("Creating orders and order items...")

        order_statuses = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"]
        hospital_locations = [hosp_mum, hosp_blr, hosp_delhi]
        vendor_locations = [vendor_delhi, vendor_mum]

        for order_num in range(1, 16):
            order_id = f"ORD-{order_num:03d}"
            from_loc = random.choice(hospital_locations)
            to_loc = random.choice(vendor_locations)
            status = random.choice(order_statuses)
            created_days_ago = random.randint(5, 20)  # Changed from 1-20 to 5-20 for safe calculation

            shipped_at = None
            delivered_at = None
            cancelled_at = None

            order_block_hash = f"BTX-{order_id}-T001"
            shipped_block_hash = None
            delivered_block_hash = None
            cancelled_block_hash = None
            
            if status in ["SHIPPED", "DELIVERED"]:
                shipped_days_ago = random.randint(1, max(1, created_days_ago - 2))
                shipped_at = timezone.now() - timedelta(days=shipped_days_ago)
                shipped_block_hash = f"BTX-{order_id}-T002"
            
            if status == "DELIVERED" and shipped_at:
                delivered_days_ago = random.randint(1, max(1, shipped_days_ago - 1))
                delivered_at = shipped_at - timedelta(days=delivered_days_ago)
                delivered_block_hash = f"BTX-{order_id}-T003"
            
            if status == "CANCELLED" and shipped_at:
                cancelled_days_ago = random.randint(1, max(1, shipped_days_ago - 1))
                cancelled_at = shipped_at - timedelta(days=cancelled_days_ago)
                cancelled_block_hash = f"BTX-{order_id}-T004"
            elif status == "CANCELLED":
                cancelled_days_ago = random.randint(1,max(1, created_days_ago - 2))
                cancelled_at = timezone.now() - timedelta(days=cancelled_days_ago)
                cancelled_block_hash = f"BTX-{order_id}-T004"

            order, _ = Order.objects.get_or_create(
                id=order_id,
                defaults=dict(
                    order_number=f"ORD-2024-{order_num:04d}",
                    from_location=from_loc,
                    to_location=to_loc,
                    status=status,
                    shipped_at=shipped_at,
                    delivered_at=delivered_at,
                    carrier_name=random.choice(["BlueDart", "DHL", "FedEx", "Ecom Express", ""]),
                    tracking_number=f"TRK{random.randint(100000000, 999999999)}" if status != "PENDING" else "",
                    created_by=random.choice([hosp_user, hosp_user_blr]),
                    created_at=timezone.now() - timedelta(days=created_days_ago),
                    order_block_hash = order_block_hash,
                    shipped_block_hash = shipped_block_hash,
                    delivered_block_hash = delivered_block_hash,
                    cancelled_at = cancelled_at,
                    cancelled_block_hash = cancelled_block_hash,
                ),
            )

            # Order items (2-4 items per order)
            drugs_list = list(drugs.values())
            num_items = random.randint(2, 4)
            batches_list = list(batches.values())
            for item_idx in range(num_items):
                OrderItem.objects.get_or_create(
                    id=f"ORDITEM-{order_num:03d}-{item_idx + 1:02d}",
                    defaults=dict(
                        order_id=order,
                        drug_id=random.choice(drugs_list),
                        batch_id = random.choice(batches_list),
                        qty=random.randint(100, 1000),
                    ),
                )


        # ========== 7. CONSUMPTION RECORDS (15 rows) ==========
        self.stdout.write("Creating consumption records...")

        drugs_list = list(drugs.values())
        

        for cons_num in range(1, 16):
            ConsumptionRecord.objects.get_or_create(
                id=f"CONS-{cons_num:03d}",
                defaults=dict(
                    recorded_by=random.choice([hosp_user, hosp_user_blr]),
                    drug_id=random.choice(drugs_list),
                    location_id=random.choice(hospital_locations),
                    batch_id=random.choice(batches_list),
                    qty_consumed=random.randint(10, 200),
                    consumption_date=today - timedelta(days=random.randint(0, 15)),
                ),
            )

        # ========== 8. ALERTS (15 rows) ==========
        self.stdout.write("Creating alerts...")

        alert_types = ["LOW_STOCK", "EXPIRY_WARNING", "DELAYED_SHIPMENT", "QUALITY_CHECK"]
        alert_messages = {
            "LOW_STOCK": "Stock below reorder point at {location}.",
            "EXPIRY_WARNING": "Batch expiring in 30 days at {location}.",
            "DELAYED_SHIPMENT": "Shipment delayed at {location}.",
            "QUALITY_CHECK": "Quality check pending for {drug} at {location}.",
        }

        for alert_num in range(1, 16):
            alert_type = random.choice(alert_types)
            location = random.choice(hospital_locations)
            drug = random.choice(drugs_list)
            batch = random.choice(batches_list)

            message = alert_messages[alert_type].format(location=location.name, drug=drug.name)

            Alert.objects.get_or_create(
                id=f"ALERT-{alert_num:03d}",
                defaults=dict(
                    type=alert_type,
                    location_id=location,
                    drug_id=drug,
                    batch_id=batch,
                    message=message,
                    is_read=random.choice([True, False]),
                    created_at=timezone.now() - timedelta(days=random.randint(0, 10), hours=random.randint(0, 23)),
                ),
            )

        # ========== 9. FORECASTS (15 rows) ==========
        self.stdout.write("Creating forecasts...")

        for forecast_num in range(1, 16):
            Forecast.objects.get_or_create(
                id=f"FORECAST-{forecast_num:03d}",
                defaults=dict(
                    drug_id=random.choice(drugs_list),
                    location_id=random.choice(hospital_locations),
                    forecast_date=today + timedelta(days=random.randint(7, 90)),
                    predicted_qty=random.randint(100, 500),
                ),
            )

        # ========== 10. BLOCKCHAIN TRANSACTIONS (15 rows) ==========
        self.stdout.write("Creating blockchain transactions...")

        tx_types = ["BATCH_CREATION", "ORDER_SHIPMENT", "DELIVERY_CONFIRMED", "QUALITY_VERIFIED"]
        batches_list = list(batches.values())

        for btx_num in range(1, 16):
            batch = batches_list[btx_num - 1] if btx_num <= len(batches_list) else random.choice(batches_list)

            BlockchainTransaction.objects.get_or_create(
                id=f"BTX-{btx_num:03d}",
                defaults=dict(
                    batch_id=batch,
                    tx_hash=f"0x{batch.drug_id.id.split('-')[1].upper()}batch{btx_num:03d}",
                    tx_type=random.choice(tx_types),
                    created_at=batch.mfg_date + timedelta(days=random.randint(0, 10)),
                ),
            )

        self.stdout.write(self.style.SUCCESS("✅ Seeding completed successfully with 15 rows per section!"))
