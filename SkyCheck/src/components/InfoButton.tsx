type InfoButtonProps = {
  title: string;
  imgSrc: string;   // ruta o URL de la imagen
  imgAlt?: string;
};

export default function InfoButton({ title, imgSrc, imgAlt }: InfoButtonProps) {
  const handleClick = () => {
    const newWindow = window.open("", "_blank"); // abre nueva pestaña
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              body {
                font-family: "Source Serif 4", serif;
                background: #f5f7fb;
                margin: 0;
                padding: 1rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              }
              h1 { font-size: 1.5rem; color: #333; }
              img {
                max-width: 90%;
                height: auto;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,.15);
                margin-top: 1rem;
              }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            <img src="${imgSrc}" alt="${imgAlt ?? title}" />
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  return (
    <button
      onClick={handleClick}
      title="Abrir información"
      style={{
        width: 36, height: 36, borderRadius: 12,
        border: "1px solid rgba(0,0,0,.15)",
        background: "white",
        boxShadow: "0 2px 6px rgba(0,0,0,.12)",
        cursor: "pointer",
        display: "grid", placeItems: "center", fontWeight: 700
      }}
    >
      i
    </button>
  );
}
