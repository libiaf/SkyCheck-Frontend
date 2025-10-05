import Sun from "../assets/Sun.svg"; 
import "../styles/UVindex.css";

interface UVindiceProps {
  uvIndex: number;     // valor del índice UV (0 - 11+)
  level: string;       // descripción ("Low", "Moderate", "High", etc.)
}

const UVindice: React.FC<UVindiceProps> = ({ uvIndex, level }) => {
  // Normalizamos el UV en una escala 0 - 100 para la barra
  const progress = Math.min((uvIndex / 11) * 100, 100);

  return (
    <div className="uvindice glass shadow-md">
      {/* Icono y título */}
      <div className="uvindice-header">
        <img src={Sun} alt="Sun Icon" className="uvindice-icon" />
        <span className="uvindice-title">UV Index</span>
      </div>

      {/* Valor + Barra */}
      <div className="uvindice-content">
        <span className="uvindice-value">{uvIndex}</span>
        <span className="uvindice-level">{level}</span>

        <div className="uvindice-bar">
          <div 
            className="uvindice-marker" 
            style={{ left: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default UVindice;

