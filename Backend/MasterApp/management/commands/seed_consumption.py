from django.core.management.base import BaseCommand
from datetime import datetime, timedelta
import random

from InventoryApp.models import ConsumptionRecord
from MasterApp.models import Drug, Location, User
from SupplyApp.models import Batch


class Command(BaseCommand):
    help = "Seed consumption data for ML training"

    def handle(self, *args, **kwargs):

        DAYS = 60
        START_DATE = datetime(2026, 3, 1)

        drugs = Drug.objects.all()
        locations = Location.objects.filter(type="Hospital")
        user = User.objects.first()
        batches = list(Batch.objects.all())

        if not drugs or not locations:
            self.stdout.write(self.style.ERROR("No drugs or locations found"))
            return

        # Optional: clear old data
        ConsumptionRecord.objects.all().delete()

        count = 0

        for drug in drugs:
            for location in locations:
                for i in range(DAYS):

                    date = START_DATE + timedelta(days=i)

                    base = random.randint(20, 50)

                    # Weekly pattern (weekend higher demand)
                    if date.weekday() in [5, 6]:
                        base += random.randint(5, 15)

                    # Random spikes (simulate sudden demand)
                    if random.random() < 0.1:
                        base += random.randint(20, 40)

                    qty = max(5, base)

                    ConsumptionRecord.objects.create(
                        id=f"CON-{drug.id}-{location.id}-{i}",
                        drug_id=drug,
                        location_id=location,
                        batch_id=random.choice(batches) if batches else None,
                        qty_consumed=qty,
                        recorded_by=user,
                        consumption_date=date
                    )

                    count += 1

        self.stdout.write(self.style.SUCCESS(f"Inserted {count} consumption records"))