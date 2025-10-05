import React from "react";
import "../styles/Alerts.css";
import AlertIcon from "../assets/AlertIcon.png";

interface AlertsProps {
  title?: string;
  items: string[];          // textos de alertas, e.g. ["Warning: …", "Warning: …"]
  className?: string;       // opcional para ajustes externos
}

const Alerts: React.FC<AlertsProps> = ({ title = "Alerts", items, className }) => {
  return (
    <div className={`alerts-card ${className ?? ""}`}>
      <div className="alerts-card__header">
        <img src={AlertIcon} alt="" aria-hidden="true" className="alerts-card__icon-img" />
        <span className="alerts-card__title">{title}</span>
      </div>

      <ul className="alerts-card__list">
        {items.map((t, i) => (
          <li className="alert-item" key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
};

export default Alerts;
