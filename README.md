# SkyCheck-Frontend

Interfaz de usuario del proyecto SkyCheck, una aplicación web enfocada en mostrar condiciones del clima y del cielo mediante componentes visuales interactivos.

## Descripción

SkyCheck-Frontend es la parte visual del sistema SkyCheck.  
Permite consultar y visualizar información como:

- Temperatura, viento, humedad y probabilidad de lluvia.  
- Estados del cielo (despejado, nublado, etc.).  
- Datos meteorológicos obtenidos desde el backend.  

Su objetivo es ofrecer una experiencia clara y atractiva para el usuario final.

## Tecnologías

| Tipo | Herramienta |
|------|--------------|
| Lenguaje principal | TypeScript |
| Framework | React + Vite |
| Estilos | CSS / Tailwind / Custom styles |
| Librerías | React Router, Axios (o fetch), Componentes personalizados |
| Control de versiones | Git / GitHub |

## Instalación y ejecución

1. Clonar el repositorio
   ```bash
   git clone https://github.com/libiaf/SkyCheck-Frontend.git
   cd SkyCheck-Frontend

## Instalación y uso

Para instalar las dependencias, ejecuta el comando `npm install` en la terminal dentro del directorio del proyecto.  
Luego, configura el entorno creando un archivo `.env` en la raíz del repositorio con las variables necesarias, por ejemplo:  
`VITE_API_URL=https://api.skycheck.example.com`.

Una vez configurado, inicia el servidor de desarrollo con `npm run dev`.  
Si deseas generar la versión optimizada para producción, usa `npm run build`.

## Estructura del proyecto

El proyecto está organizado de la siguiente manera:

El directorio `SkyCheck-Frontend/` contiene las carpetas principales.  
Dentro de `src/` se encuentran los recursos y componentes del frontend:

- `assets/`: iconos e imágenes utilizadas en la interfaz.  
- `components/`: componentes reutilizables, como `Probability` o `WeatherCard`.  
- `pages/`: vistas principales de la aplicación.  
- `styles/`: archivos de estilos globales.  
- `App.tsx`: punto de entrada principal.  
- `main.tsx`: archivo donde se renderiza React.

Además, incluye archivos de configuración como `package.json`, `tsconfig.json` y `README.md`.

## Scripts disponibles

El proyecto cuenta con los siguientes comandos:

- `npm run dev`: inicia el servidor local de desarrollo.  
- `npm run build`: genera la versión optimizada para producción.  
- `npm run preview`: permite visualizar la build de producción localmente.  
- `npm run lint`: analiza el código en busca de errores o malas prácticas.

## Licencia

SkyCheck © 2025 by Zuleyca Balles, Regina Orduño, Mariana Carrillo, Libia Flores, Diana Escalante, and Mariana Islas is licensed under CC BY-ND 4.0
