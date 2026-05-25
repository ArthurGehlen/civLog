"use client";

// Components
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const LeaderboardChart = ({ players }) => {
  if (!players || players.length === 0) return null;
  const sorted = [...players].sort((a, b) => b.wins - a.wins);

  const barColor = (i) => {
    if (i === 0) return "#C9A84C";
    if (i === 1) return "#A0A0A8";
    if (i === 2) return "#3D3010";
    return "#2A2A2E";
  };

  const data = {
    labels: sorted.map((p) => p.name),
    datasets: [
      {
        label: "Vitórias",
        data: sorted.map((p) => p.wins),
        backgroundColor: sorted.map((_, i) => barColor(i)),
        borderColor: sorted.map((_, i) => barColor(i)),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  return (
    <div style={{ height: sorted.length * 48 + 80 }}>
      <Bar
        data={data}
        options={{
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#1C1C20",
              borderColor: "#2A2A2E",
              borderWidth: 1,
              titleColor: "#E8E8E8",
              bodyColor: "#A0A0A8",
            },
          },

          scales: {
            x: {
              color: "#666666",
              beginAtZero: true,
              grid: { color: "rgba(42,42,46,0.8)" },
              border: { color: "#2A2A2E" },
              ticks: {
                color: "#666666",
                precision: 0,
              },
            },
            y: {
              grid: { display: false },
              border: { color: "#2A2A2E" },
              ticks: { color: "#E8E8E8" },
            },
          },
        }}
      />
    </div>
  );
};

export default LeaderboardChart;
