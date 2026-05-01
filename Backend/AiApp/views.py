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


from django.db import models
from AiApp.models import Forecast
from MasterApp.models import Drug, Location
from InventoryApp.models import ConsumptionRecord  

import uuid
import datetime
import numpy as np
import pandas as pd
from django.db.models import Sum
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error

DEFAULT_MAX_CAPACITY = 100  


def _load_base_dataframe():
    """
    Load data from ConsumptionRecord and aggregate qty_consumed
    per (drug, location, date) with basic name/metadata.
    """
    qs = (
        ConsumptionRecord.objects
        .values(
            "drug_id",
            "drug_id__name",
            "location_id",
            "location_id__name",
            "consumption_date",
        )
        .annotate(total_qty=Sum("qty_consumed"))
        .order_by("drug_id", "location_id", "consumption_date")
    )

    if not qs:
        return None

    df = pd.DataFrame.from_records(qs)
    if df.empty:
        return None

    df.rename(
        columns={
            "consumption_date": "date",
            "drug_id__name": "drug_name",
            "location_id__name": "location_name",
        },
        inplace=True,
    )
    df["date"] = pd.to_datetime(df["date"])
    df["drug_category"] = ""
    df["drug_form"] = ""
    df["location_region"] = ""
    df["location_country"] = ""
    return df


def _build_training_dataframe(start_date=None, end_date=None):
    df = _load_base_dataframe()
    if df is None or df.empty:
        return None, None

    if start_date:
        df = df[df["date"] >= pd.to_datetime(start_date)]
    if end_date:
        df = df[df["date"] <= pd.to_datetime(end_date)]

    df_model = df[
        [
            "drug_id",
            "location_id",
            "date",
            "total_qty",
        ]
    ].copy()
    df_model["drug_code"] = df_model["drug_id"].astype("category").cat.codes
    df_model["location_code"] = df_model["location_id"].astype("category").cat.codes
    if df_model.empty:
        return None, None

    df_model["year"] = df_model["date"].dt.year
    df_model["month"] = df_model["date"].dt.month
    df_model["day"] = df_model["date"].dt.day
    df_model["dayofweek"] = df_model["date"].dt.dayofweek

    df_model = df_model.sort_values(["drug_id", "location_id", "date"])

    def add_lags(group):
        group = group.copy()
        group["lag_1"] = group["total_qty"].shift(1)
        group["lag_7"] = group["total_qty"].shift(7)
        group["rolling_7_mean"] = group["total_qty"].rolling(window=7).mean()
        return group

    df_model = (
        df_model.groupby(["drug_id", "location_id"], group_keys=False)
        .apply(add_lags)
    )

    df_model = df_model.dropna(subset=["lag_1", "lag_7", "rolling_7_mean"])

    meta_cols = [
        "drug_id",
        "drug_name",
        "drug_category",
        "drug_form",
        "location_id",
        "location_name",
        "location_region",
        "location_country",
    ]
    df_meta = df[meta_cols].drop_duplicates()

    return df_model, df_meta


def _train_xgb_model(df_model):
    feature_cols = [
        "drug_code",
        "location_code",
        "year",
        "month",
        "day",
        "dayofweek",
        "lag_1",
        "lag_7",
        "rolling_7_mean",
    ]
    X = df_model[feature_cols]
    y = df_model["total_qty"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, shuffle=False
    )

    model = XGBRegressor(
        objective="reg:squarederror",
        n_estimators=400,
        max_depth=8,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    print("Model evaluation on hold-out set:")
    print(f"  RMSE: {rmse:.2f}")
    print(f"  R²:   {r2:.3f}")

    return model, feature_cols


def _create_future_frame_for_pair(drug_id, location_id, last_date, periods=7):
    future_dates = [
        last_date + datetime.timedelta(days=i) for i in range(1, periods + 1)
    ]
    fdf = pd.DataFrame(
        {
            "drug_id": [drug_id] * periods,
            "location_id": [location_id] * periods,
            "date": pd.to_datetime(future_dates),
        }
    )
    fdf["year"] = fdf["date"].dt.year
    fdf["month"] = fdf["date"].dt.month
    fdf["day"] = fdf["date"].dt.day
    fdf["dayofweek"] = fdf["date"].dt.dayofweek
    return fdf




def generate_and_store_forecasts(days_ahead=7):
    """
    Train from ConsumptionRecord and store Forecast rows.
    Call this from a view, shell, or background task.
    """
    df_model, df_meta = _build_training_dataframe()
    if df_model is None or df_model.empty:
        print("No training data after feature engineering.")
        return 0

    model, feature_cols = _train_xgb_model(df_model)

    total_rows = 0
    pairs = df_model[["drug_id", "location_id"]].drop_duplicates()

    for _, row in pairs.iterrows():
        d_id = row["drug_id"]
        l_id = row["location_id"]

        sub = df_model[
            (df_model["drug_id"] == d_id)
            & (df_model["location_id"] == l_id)
        ].copy()
        if sub.empty:
            continue

        last_date = sub["date"].max()

        future = _create_future_frame_for_pair(
            d_id, l_id, last_date, periods=days_ahead
        )
        future["drug_code"] = sub["drug_code"].iloc[0]
        future["location_code"] = sub["location_code"].iloc[0]

        last_row = sub.sort_values("date").iloc[-1]
        future["lag_1"] = last_row["total_qty"]

        last_7 = sub.sort_values("date").tail(7)["total_qty"]
        rolling_7 = float(last_7.mean())
        future["lag_7"] = rolling_7
        future["rolling_7_mean"] = rolling_7

        X_future = future[feature_cols]
        preds = model.predict(X_future)
        future["predicted_qty"] = np.maximum(
            np.round(preds).astype(int), 0
        )

        future = future.merge(
            df_meta,
            on=["drug_id", "location_id"],
            how="left",
        )

        for _, fr in future.iterrows():
            Forecast.objects.create(
                id=f"FC-{uuid.uuid4()}",
                drug_id=Drug.objects.get(id=fr["drug_id"]),
                location_id=Location.objects.get(id=fr["location_id"]),
                forecast_date=fr["date"].date(),
                predicted_qty=int(fr["predicted_qty"]),
            )
            total_rows += 1

    print(f"Total forecast rows stored: {total_rows}")
    return total_rows



