# SkyCheck-Frontend

User interface of the **SkyCheck** project, a web application focused on displaying weather and sky conditions through interactive visual components.

## Description

**SkyCheck-Frontend** is the visual part of the SkyCheck system.  
It allows users to consult and visualize information such as:

- Temperature, wind, humidity, and probability of rain.  
- Sky states (clear, cloudy, etc.).  
- Meteorological data obtained from the backend.  

Its goal is to offer a clear and visually appealing experience for the end user.

## Technologies

| Type | Tool |
|------|------|
| Main language | TypeScript |
| Framework | React + Vite |
| Styles | CSS / Tailwind / Custom styles |
| Libraries | React Router, Axios (or fetch), Custom components |
| Version control | Git / GitHub |

## Installation and Execution

1. Clone the repository  
   ```bash
   git clone https://github.com/libiaf/SkyCheck-Frontend.git
   cd SkyCheck-Frontend

## Installation and Usage

To install the dependencies, run the command `npm install` in the terminal of the root directory of this project.  
Then, set up the environment by creating a `.env` file in the root of the repository with the required variables, for example:   
`VITE_API_URL=https://api.skycheck.example.com`.

Once configured, start the development server with `npm run dev`. 
If you want to generate the optimized production version, use `npm run build`.

## Project Structure

The project is organized as follows:

The SkyCheck-Frontend/ directory contains the main folders.

Inside src/ you’ll find the resources and components of the frontend:
- assets/: icons and images used in the interface.
- components/: reusable components, such as Probability or WeatherCard.
- pages/: main views of the application.
- styles/: global style files.
- App.tsx: main entry point.
- main.tsx: file where React is rendered.

It also includes configuration files such as package.json, tsconfig.json, and README.md.

## Available Scripts

The project includes the following commands:
- npm run dev: starts the local development server.
- npm run build: generates the optimized production version.
- npm run preview: allows you to preview the production build locally.
- npm run lint: analyzes the code for errors or bad practices.

## Licence

SkyCheck © 2025 by Zuleyca Balles, Regina Orduño, Mariana Carrillo, Libia Flores, Diana Escalante, and Mariana Islas is licensed under CC BY-ND 4.0
