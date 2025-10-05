import { useState } from "react";
import type { FormEvent } from "react";
import logo from '../assets/logo.png'
import "../styles/header.css";

type HeaderProps = {
  title?: string;
  placeholder?: string;
  defaultQuery?: string;
  onSearch?: (q: string) => void;   // se dispara al submit
  onChangeQuery?: (q: string) => void; // si quieres escuchar cambios mientras escribe
  onInfoClick?: () => void;
};

const Header = ({
  title = "SkyCheck",
  placeholder = "Buscar ciudad o coordenadas…",
  defaultQuery = "",
  onSearch,
  onChangeQuery,
  onInfoClick
}: HeaderProps) => {
  const [query, setQuery] = useState(defaultQuery);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch?.(query.trim());
  };

  return (
    <header className="app-header glass">
        <div className="header-box glass">
            <div className="brand" aria-label="Aplicación">
              <img src={logo} alt="Logo" className="brand-logo" />
              <span className="brand-title">{title}</span>
            </div>

            <form className="search" role="search" onSubmit={handleSubmit}>
                <span className="search-icon" aria-hidden="true">
                {/* Lupa SVG */}
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <path
                    d="M21 21l-4.2-4.2m1.2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    />
                </svg>
                </span>

                <input
                className="search-input"
                type="search"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    onChangeQuery?.(e.target.value);
                }}
                placeholder={placeholder}
                aria-label="Buscar ciudad o coordenadas"
                />
            </form>
        </div>

        {/* Botón info ahora está separado */}
        <div
            className="info-btn"
            aria-label="Información"
        >i
        </div>
    </header>

  );
};

export default Header;