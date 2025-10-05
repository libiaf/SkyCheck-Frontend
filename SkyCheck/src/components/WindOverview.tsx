import Arrow from "../assets/Arrow.svg";
import Wind from "../assets/Wind.svg";
import "../styles/WindOverview.css";

interface WindOverviewProps {
  velocity: number;   // km/h
  direction: number;  // en grados (0 = Norte, 90 = Este, etc.)
  gusts: number;      // km/h
}

const WindOverview: React.FC<WindOverviewProps> = ({ velocity, direction, gusts }) => {
  return (
    <div className="wind-overview glass shadow-md">
      <h2 className="wind-title">
        <img src={Wind} alt="Wind Icon" className="wind-icon" />
        Wind Overview
      </h2>

      <div className="wind-grid">
        {/* Velocidad */}
        <div className="wind-item">
          <div className="wind-card">
            <span className="wind-value">{velocity}</span>
            <span className="wind-unit">km/h</span>
          </div>
          <span className="wind-label">Wind Velocity</span>
        </div>

        {/* Dirección */}
        <div className="wind-item">
          <div className="wind-card">
            <img 
              src={Arrow} 
              alt="Wind Direction" 
              className="wind-arrow"
              style={{ transform: `rotate(${direction}deg)` }}
            />
            <span className="wind-unit"> </span>
          </div>
          <span className="wind-label">Wind Direction</span>
        </div>

        {/* Ráfagas */}
        <div className="wind-item">
          <div className="wind-card">
            <span className="wind-value">{gusts}</span>
            <span className="wind-unit">km/h</span>
          </div>
          <span className="wind-label">Wind Gusts</span>
        </div>
      </div>
    </div>
  );
};

export default WindOverview;


