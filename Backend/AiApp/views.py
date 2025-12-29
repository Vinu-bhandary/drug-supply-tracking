from django.db import models
from AiApp.models import Forecast
from MasterApp.models import Drug, Location


def create_forecast(data):
    return Forecast.objects.create(**data)

def read_forecast(forecast_id):
    return Forecast.objects.get(id=forecast_id)

def update_forecast(forecast_id, data):
    obj = Forecast.objects.get(id=forecast_id)
    for k, v in data.items():
        setattr(obj, k, v)
    obj.save()
    return obj

def delete_forecast(forecast_id):
    obj = Forecast.objects.get(id=forecast_id)
    return obj.delete()




#-------------------------------------
import datetime

import numpy as np
import pandas as pd
from django.db.models import Sum
from sklearn.ensemble import RandomForestRegressor
from django.utils import timezone

from InventoryApp.models import ConsumptionRecord
from .models import Forecast


def _build_training_dataframe(start_date=None, end_date=None):

    qs = ConsumptionRecord.objects.all()

    if start_date:
        qs = qs.filter(consumption_date__gte=start_date)
    if end_date:
        qs = qs.filter(consumption_date__lte=end_date)


    data = (
        qs.values("drug_id", "location_id", "consumption_date")
            .annotate(total_qty=Sum("qty_consumed"))
            .order_by("drug_id", "location_id", "consumption_date")
    )

    if not data:
        return None

    df = pd.DataFrame(list(data))
    df.rename(columns={"consumption_date": "date"}, inplace=True)


    df["date"] = pd.to_datetime(df["date"])
    df["year"] = df["date"].dt.year
    df["month"] = df["date"].dt.month
    df["day"] = df["date"].dt.day
    df["dayofweek"] = df["date"].dt.dayofweek


    df = df.sort_values(["drug_id", "location_id", "date"])


    def add_lags(group):
        group = group.copy()
        group["lag_1"] = group["total_qty"].shift(1)
        group["lag_7"] = group["total_qty"].shift(7)
        group["rolling_7_mean"] = group["total_qty"].rolling(window=7).mean()
        return group

    df = df.groupby(["drug_id", "location_id"], group_keys=False).apply(add_lags)


    df = df.dropna(subset=["lag_1", "lag_7", "rolling_7_mean"])

    return df


def train_random_forest_model(df):
    feature_cols = [
        "drug_id", "location_id",
        "year", "month", "day", "dayofweek",
        "lag_1", "lag_7", "rolling_7_mean",
    ]
    X = df[feature_cols]
    y = df["total_qty"]

    model = RandomForestRegressor(
        n_estimators=300,
        max_depth=12,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X, y)

    return model, feature_cols


def _create_future_frame_for_pair(drug_id, location_id, last_date, periods=7):
    future_dates = [last_date + datetime.timedelta(days=i) for i in range(1, periods + 1)]
    fdf = pd.DataFrame({
        "drug_id": [drug_id] * periods,
        "location_id": [location_id] * periods,
        "date": pd.to_datetime(future_dates),
    })
    fdf["year"] = fdf["date"].dt.year
    fdf["month"] = fdf["date"].dt.month
    fdf["day"] = fdf["date"].dt.day
    fdf["dayofweek"] = fdf["date"].dt.dayofweek
    return fdf


def generate_forecasts_for_range(days_ahead=7):
    df = _build_training_dataframe()
    if df is None or df.empty:
        return 0


    model, feature_cols = train_random_forest_model(df)

    created_count = 0


    pairs = df[["drug_id", "location_id"]].drop_duplicates()

    for _, row in pairs.iterrows():
        d_id = row["drug_id"]
        l_id = row["location_id"]


        sub = df[(df["drug_id"] == d_id) & (df["location_id"] == l_id)].copy()
        if sub.empty:
            continue

        last_date = sub["date"].max()


        future = _create_future_frame_for_pair(d_id, l_id, last_date, periods=days_ahead)


        last_row = sub.sort_values("date").iloc[-1]
        future["lag_1"] = last_row["total_qty"]

        last_7 = sub.sort_values("date").tail(7)["total_qty"]
        rolling_7 = float(last_7.mean())
        future["lag_7"] = rolling_7
        future["rolling_7_mean"] = rolling_7


        X_future = future[feature_cols]
        preds = model.predict(X_future)
        future["predicted_qty"] = np.maximum(preds.round().astype(int), 0)


        for _, fr in future.iterrows():
            Forecast.objects.update_or_create(
                id=f"{d_id}_{l_id}_{fr['date'].date()}",
                defaults={
                    "drug_id_id": d_id,
                    "location_id_id": l_id,
                    "forecast_date": fr["date"].date(),
                    "predicted_qty": int(fr["predicted_qty"]),
                },
            )
            created_count += 1

    return created_count
