from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.hashers import make_password

# Adjust these imports to your real app labels
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

        # ========== 2. USERS ==========
        self.stdout.write("Creating users...")

        admin, _ = User.objects.get_or_create(
            id="user-admin-01",
            defaults=dict(
                username="admin",
                email="admin@dst.com",
                password_hash=make_password("admin123"),  # for demo only – use set_password in real auth
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

        # ========== 3. DRUGS ==========
        self.stdout.write("Creating drugs...")

        paracetamol, _ = Drug.objects.get_or_create(
            id="DRUG-PCM-500",
            defaults=dict(
                name="Paracetamol 500mg",
                category="Analgesic",
                strength="500mg",
                unit="tablets",
                reorder_point=500,
            ),
        )

        metformin, _ = Drug.objects.get_or_create(
            id="DRUG-MET-500",
            defaults=dict(
                name="Metformin 500mg",
                category="Diabetic Care",
                strength="500mg",
                unit="tablets",
                reorder_point=300,
            ),
        )

        amoxicillin, _ = Drug.objects.get_or_create(
            id="DRUG-AMOX-250",
            defaults=dict(
                name="Amoxicillin 250mg",
                category="Antibiotic",
                strength="250mg",
                unit="capsules",
                reorder_point=400,
            ),
        )

        lisinopril, _ = Drug.objects.get_or_create(
            id="DRUG-LISI-10",
            defaults=dict(
                name="Lisinopril 10mg",
                category="Cardiovascular",
                strength="10mg",
                unit="tablets",
                reorder_point=200,
            ),
        )

        # ========== 4. BATCHES ==========
        self.stdout.write("Creating batches...")

        batch_pcm, _ = Batch.objects.get_or_create(
            id="BATCH-PCM-001",
            defaults=dict(
                drug_id=paracetamol,
                batch_number="PCM-2024-001",
                mfg_date=today - timedelta(days=180),
                exp_date=today + timedelta(days=365),
                blockchain_hash="0xPCMbatch001",
                qr_code_data="PCM-2024-001|DRUG-PCM-500",
            ),
        )

        batch_met, _ = Batch.objects.get_or_create(
            id="BATCH-MET-001",
            defaults=dict(
                drug_id=metformin,
                batch_number="MET-2024-001",
                mfg_date=today - timedelta(days=200),
                exp_date=today + timedelta(days=550),
                blockchain_hash="0xMETbatch001",
                qr_code_data="MET-2024-001|DRUG-MET-500",
            ),
        )

        batch_amox, _ = Batch.objects.get_or_create(
            id="BATCH-AMOX-001",
            defaults=dict(
                drug_id=amoxicillin,
                batch_number="AMOX-2024-001",
                mfg_date=today - timedelta(days=150),
                exp_date=today + timedelta(days=300),
                blockchain_hash="0xAMOXbatch001",
                qr_code_data="AMOX-2024-001|DRUG-AMOX-250",
            ),
        )

        batch_lisi, _ = Batch.objects.get_or_create(
            id="BATCH-LISI-001",
            defaults=dict(
                drug_id=lisinopril,
                batch_number="LISI-2024-001",
                mfg_date=today - timedelta(days=120),
                exp_date=today + timedelta(days=400),
                blockchain_hash="0xLISIbatch001",
                qr_code_data="LISI-2024-001|DRUG-LISI-10",
            ),
        )

        # ========== 5. INVENTORY ==========
        self.stdout.write("Creating inventory...")

        inv1, _ = Inventory.objects.get_or_create(
            id="INV-001",
            defaults=dict(
                location_id=hosp_mum,
                drug_id=paracetamol,
                batch_id=batch_pcm,
                qty_on_hand=1200,
                exp_date=batch_pcm.exp_date,
            ),
        )

        inv2, _ = Inventory.objects.get_or_create(
            id="INV-002",
            defaults=dict(
                location_id=hosp_mum,
                drug_id=metformin,
                batch_id=batch_met,
                qty_on_hand=800,
                exp_date=batch_met.exp_date,
            ),
        )

        inv3, _ = Inventory.objects.get_or_create(
            id="INV-003",
            defaults=dict(
                location_id=hosp_blr,
                drug_id=amoxicillin,
                batch_id=batch_amox,
                qty_on_hand=500,
                exp_date=batch_amox.exp_date,
            ),
        )

        inv4, _ = Inventory.objects.get_or_create(
            id="INV-004",
            defaults=dict(
                location_id=hosp_blr,
                drug_id=lisinopril,
                batch_id=batch_lisi,
                qty_on_hand=300,
                exp_date=batch_lisi.exp_date,
            ),
        )

        # ========== 6. ORDERS + ORDER ITEMS ==========
        self.stdout.write("Creating orders and order items...")

        order1, _ = Order.objects.get_or_create(
            id="ORD-001",
            defaults=dict(
                order_number="ORD-2024-0001",
                from_location=hosp_mum,
                to_location=vendor_delhi,
                status="PENDING",
                shipped_at=None,
                delivered_at=None,
                carrier_name="",
                tracking_number="",
                created_by=hosp_user,
                created_at=timezone.now() - timedelta(days=5),
            ),
        )

        order2, _ = Order.objects.get_or_create(
            id="ORD-002",
            defaults=dict(
                order_number="ORD-2024-0002",
                from_location=hosp_blr,
                to_location=vendor_delhi,
                status="SHIPPED",
                shipped_at=timezone.now() - timedelta(days=2),
                delivered_at=None,
                carrier_name="BlueDart Express",
                tracking_number="BD123456789",
                created_by=hosp_user,
                created_at=timezone.now() - timedelta(days=4),
            ),
        )

        order3, _ = Order.objects.get_or_create(
            id="ORD-003",
            defaults=dict(
                order_number="ORD-2024-0003",
                from_location=hosp_mum,
                to_location=vendor_delhi,
                status="DELIVERED",
                shipped_at=timezone.now() - timedelta(days=5),
                delivered_at=timezone.now() - timedelta(days=2),
                carrier_name="DHL Logistics",
                tracking_number="DHL987654321",
                created_by=hosp_user,
                created_at=timezone.now() - timedelta(days=7),
            ),
        )

        # Order items
        OrderItem.objects.get_or_create(
            id="ORDITEM-001",
            defaults=dict(
                order_id=order1,
                drug_id=paracetamol,
                qty=200,
            ),
        )
        OrderItem.objects.get_or_create(
            id="ORDITEM-002",
            defaults=dict(
                order_id=order1,
                drug_id=metformin,
                qty=300,
            ),
        )
        OrderItem.objects.get_or_create(
            id="ORDITEM-003",
            defaults=dict(
                order_id=order2,
                drug_id=amoxicillin,
                qty=500,
            ),
        )
        OrderItem.objects.get_or_create(
            id="ORDITEM-004",
            defaults=dict(
                order_id=order3,
                drug_id=lisinopril,
                qty=300,
            ),
        )

        # ========== 7. CONSUMPTION RECORDS ==========
        self.stdout.write("Creating consumption records...")

        ConsumptionRecord.objects.get_or_create(
            id="CONS-001",
            defaults=dict(
                recorded_by=hosp_user,
                drug_id=paracetamol,
                location_id=hosp_mum,
                batch_id=batch_pcm,
                qty_consumed=150,
                consumption_date=today,
            ),
        )

        ConsumptionRecord.objects.get_or_create(
            id="CONS-002",
            defaults=dict(
                recorded_by=hosp_user,
                drug_id=metformin,
                location_id=hosp_mum,
                batch_id=batch_met,
                qty_consumed=80,
                consumption_date=today - timedelta(days=1),
            ),
        )

        # ========== 8. ALERTS ==========
        self.stdout.write("Creating alerts...")

        Alert.objects.get_or_create(
            id="ALERT-001",
            defaults=dict(
                type="LOW_STOCK",
                location_id=hosp_blr,
                drug_id=lisinopril,
                batch_id=batch_lisi,
                message="Lisinopril stock below reorder point at Fortis Bengaluru.",
                is_read=False,
                created_at=timezone.now() - timedelta(hours=6),
            ),
        )

        Alert.objects.get_or_create(
            id="ALERT-002",
            defaults=dict(
                type="EXPIRY_WARNING",
                location_id=hosp_blr,
                drug_id=amoxicillin,
                batch_id=batch_amox,
                message="Amoxicillin batch expiring in 30 days at Fortis Bengaluru.",
                is_read=False,
                created_at=timezone.now() - timedelta(days=2),
            ),
        )

        # ========== 9. FORECASTS ==========
        self.stdout.write("Creating forecasts...")

        Forecast.objects.get_or_create(
            id="FORECAST-001",
            defaults=dict(
                drug_id=paracetamol,
                location_id=hosp_mum,
                forecast_date=today + timedelta(days=30),
                predicted_qty=250,
            ),
        )

        Forecast.objects.get_or_create(
            id="FORECAST-002",
            defaults=dict(
                drug_id=metformin,
                location_id=hosp_blr,
                forecast_date=today + timedelta(days=30),
                predicted_qty=180,
            ),
        )

        # ========== 10. BLOCKCHAIN TRANSACTIONS ==========
        self.stdout.write("Creating blockchain transactions...")

        BlockchainTransaction.objects.get_or_create(
            id="BTX-001",
            defaults=dict(
                batch_id=batch_pcm,
                tx_hash="0xPCMbatch001",
                tx_type="BATCH_CREATION",
                created_at=batch_pcm.mfg_date,
            ),
        )

        BlockchainTransaction.objects.get_or_create(
            id="BTX-002",
            defaults=dict(
                batch_id=batch_met,
                tx_hash="0xMETbatch001",
                tx_type="BATCH_CREATION",
                created_at=batch_met.mfg_date,
            ),
        )

        BlockchainTransaction.objects.get_or_create(
            id="BTX-003",
            defaults=dict(
                batch_id=batch_amox,
                tx_hash="0xAMOXbatch001",
                tx_type="BATCH_CREATION",
                created_at=batch_amox.mfg_date,
            ),
        )

        BlockchainTransaction.objects.get_or_create(
            id="BTX-004",
            defaults=dict(
                batch_id=batch_lisi,
                tx_hash="0xLISIbatch001",
                tx_type="BATCH_CREATION",
                created_at=batch_lisi.mfg_date,
            ),
        )

        self.stdout.write(self.style.SUCCESS("✅ Seeding completed successfully."))
