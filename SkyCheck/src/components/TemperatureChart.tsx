import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import ThermometerIcon from "../assets/Temperature.svg";
import "../styles/TemperatureChart.css";

export type TempPoint = {
  dateISO: string;   
  highC: number;     
  lowC: number;      
};

type Props = {
  title?: string;
  data: TempPoint[];
};

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

const LOCALE = "es-MX";
const fmtDayLong = new Intl.DateTimeFormat(LOCALE, { weekday: "long" });
const fmtDayNum  = new Intl.DateTimeFormat(LOCALE, { day: "2-digit" });
const fmtMonth   = new Intl.DateTimeFormat(LOCALE, { month: "short" });

const VISIBLE_COUNT = 6;

const TemperatureChartCJ: React.FC<Props> = ({ title = "Temperature", data }) => {
  const visible = useMemo(
    () => (data.length <= VISIBLE_COUNT ? data : data.slice(-VISIBLE_COUNT)),
    [data]
  );

  const labels = useMemo(
    () =>
      visible.map((d) => {
        const dt = new Date(d.dateISO);
        return `${fmtDayLong.format(dt)} ${fmtDayNum.format(dt)}`;
      }),
    [visible]
  );

  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Max (°C)",
          data: visible.map((d) => d.highC),
          borderColor: "#c03a2b",
          backgroundColor: "#e94e3c",
          pointBackgroundColor: "#e94e3c",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 7,
          tension: 0.35,
        },
        {
          label: "Min (°C)",
          data: visible.map((d) => d.lowC),
          borderColor: "#2563eb",
          backgroundColor: "#3b82f6",
          pointBackgroundColor: "#3b82f6",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 7,
          tension: 0.35,
        },
      ],
    }),
    [labels, visible]
  );

  const { yMin, yMax } = useMemo(() => {
    if (!visible.length) return { yMin: 0, yMax: 1 };
    const highs = visible.map((d) => d.highC);
    const lows  = visible.map((d) => d.lowC);
    const min = Math.min(...lows);
    const max = Math.max(...highs);
    return { yMin: Math.floor(min - 4), yMax: Math.ceil(max + 4) };
  }, [visible]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { right: 24, left: 8, top: 0, bottom: 0 } }, 
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: { usePointStyle: true, pointStyle: "circle" },
        },
        tooltip: {
          callbacks: {
            title: (items: any[]) => {
              const idx = items[0].dataIndex;
              const d = new Date(visible[idx].dateISO);
              return `${fmtDayLong.format(d)} ${fmtDayNum.format(d)} ${fmtMonth.format(d)}`;
            },
            label: (item: any) => `${item.dataset.label}: ${item.formattedValue}°C`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            maxRotation: 0,
            autoSkip: false,
            font: { size: 12 },
            color: "#2b2b2b",
          },
        },
        y: {
          min: yMin,
          max: yMax,
          grid: { color: "rgba(0,0,0,0.06)" },
          ticks: { color: "#6b7280", stepSize: 2 },
          border: { display: false },
        },
      },
      elements: {
        line: { borderWidth: 2 },
        point: { hitRadius: 12, hoverBorderWidth: 2 },
      },
    }),
    [visible, yMin, yMax]
  );

  return (
    <div className="tempCard">
      <div className="tempHeader">
        <img src={ThermometerIcon} alt="" aria-hidden="true" className="tempIconImg" />
        <h3 className="tempTitle">{title}</h3>
      </div>

      <div className="chartWrap" style={{ height: 280 }}>
        <Line data={chartData} options={options} />
      </div>

      <div className="legend">
      </div>
    </div>
  );
};

export default TemperatureChartCJ;