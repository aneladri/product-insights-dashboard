from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from pathlib import Path

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = Path("../data/product_metrics.csv")

def load_data():
    return pd.read_csv(DATA_PATH)

@app.get("/")
def home():
    return {"message": "Product Insights API is running"}

@app.get("/metrics/summary")
def get_summary():
    df = load_data()

    total_signups = int(df["signups"].sum())
    avg_active_users = round(float(df["active_users"].mean()), 2)
    total_revenue = float(df["revenue"].sum())
    total_churned = int(df["churned_users"].sum())

    churn_rate = round((total_churned / avg_active_users) * 100, 2)

    return {
        "total_signups": total_signups,
        "average_active_users": avg_active_users,
        "total_revenue": total_revenue,
        "churn_rate_percent": churn_rate,
    }

@app.get("/metrics/daily")
def get_daily_metrics():
    df = load_data()
    return df.to_dict(orient="records")

@app.get("/metrics/features")
def get_feature_usage():
    df = load_data()

    return {
        "feature_a_usage": int(df["feature_a_usage"].sum()),
        "feature_b_usage": int(df["feature_b_usage"].sum()),
        "feature_c_usage": int(df["feature_c_usage"].sum()),
    }

@app.get("/insights")
def get_insights():
    df = load_data()

    insights = []

    revenue_growth = df["revenue"].iloc[-1] - df["revenue"].iloc[0]
    if revenue_growth > 0:
        insights.append(f"Revenue increased by ${revenue_growth} over the period.")

    best_signup_day = df.loc[df["signups"].idxmax()]
    insights.append(
        f"Highest signups occurred on {best_signup_day['date']} with {int(best_signup_day['signups'])} signups."
    )

    feature_totals = {
        "Feature A": int(df["feature_a_usage"].sum()),
        "Feature B": int(df["feature_b_usage"].sum()),
        "Feature C": int(df["feature_c_usage"].sum()),
    }

    top_feature = max(feature_totals, key=feature_totals.get)
    insights.append(f"{top_feature} is the most used feature.")

    return {"insights": insights}