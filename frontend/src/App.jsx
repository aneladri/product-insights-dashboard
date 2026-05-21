import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

function App() {
  const [summary, setSummary] = useState(null);
  const [insights, setInsights] = useState([]);
  const [features, setFeatures] = useState(null);
  const [dailyMetrics, setDailyMetrics] = useState([]);

  useEffect(() => {
    fetch("https://product-insights-dashboard.onrender.com/metrics/summary")
      .then((res) => res.json())
      .then((data) => setSummary(data));

    fetch("https://product-insights-dashboard.onrender.com/metrics/features")
      .then((res) => res.json())
      .then((data) => setFeatures(data));

    fetch("https://product-insights-dashboard.onrender.com/metrics/daily")
      .then((res) => res.json())
      .then((data) => setDailyMetrics(data));

    fetch("https://product-insights-dashboard.onrender.com/insights")
      .then((res) => res.json())
      .then((data) => setInsights(data.insights));
  }, []);

  if (!summary || !features) {
    return <p>Loading dashboard...</p>;
  }

  const featureChartData = [
    { name: "Feature A", usage: features.feature_a_usage },
    { name: "Feature B", usage: features.feature_b_usage },
    { name: "Feature C", usage: features.feature_c_usage },
  ];

  return (
    <div className="container">
      <h1>📊 Product Insights Dashboard</h1>

      <div className="stats-grid">
        <div className="card">
          <h3>Total Signups</h3>
          <p>{summary.total_signups}</p>
        </div>

        <div className="card">
          <h3>Avg Active Users</h3>
          <p>{summary.average_active_users}</p>
        </div>

        <div className="card">
          <h3>Total Revenue</h3>
          <p>${summary.total_revenue}</p>
        </div>

        <div className="card">
          <h3>Churn Rate</h3>
          <p>{summary.churn_rate_percent}%</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="section">
          <h2>Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="section">
          <h2>Active Users Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="active_users" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="section">
        <h2>Feature Usage</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={featureChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="usage" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="section">
        <h2>🧠 Product Insights:</h2>
        <ul>
          {insights.map((insight, index) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;