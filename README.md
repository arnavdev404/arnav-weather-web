# Arnav Weather Web

A responsive weather application built with HTML, CSS, Vanilla JavaScript, Node.js, Express, and the OpenWeather API.

## Features

- Dashboard with current weather details
- Hourly weather forecast
- Five-day forecast
- City search and recent searches
- Air-quality information
- Favorite cities saved in the browser
- Settings for units, theme, time format, and location
- Animated weather icons sized safely inside their cards
- Responsive desktop sidebar, tablet rail, and mobile bottom navigation
- Light and dark modes with saved preference
- Secure server-side OpenWeather API key
- Netlify Functions and Render deployment support

## API key

Only one API key is required: `OPENWEATHER_API_KEY` from OpenWeather.

Create a free OpenWeather account, open your API keys page, and copy your key. Keep it in `.env`; never paste it into `index.html` or any file inside `scripts/`.

## Run locally on Windows

1. Extract the ZIP.
2. Open the extracted project folder.
3. Double-click `SETUP-WINDOWS.bat`.
4. Paste your OpenWeather key into `.env`:

```env
OPENWEATHER_API_KEY=your_real_openweather_api_key
PORT=5055
```

5. Save `.env`.
6. Double-click `START-WEBSITE.bat`.
7. Open `http://localhost:5055`.

## Run from PowerShell

```powershell
npm config set registry https://registry.npmjs.org/
npm install
Copy-Item .env.example .env
notepad .env
npm start
```

Then open:

```text
http://localhost:5055
```

Do not open `index.html` directly. The Node server is needed for secure API requests.

## Project structure

```text
arnav-weather-web/
├── index.html
├── server.js
├── package.json
├── package-lock.json
├── .env.example
├── netlify.toml
├── render.yaml
├── styles/
├── scripts/
├── assets/
└── netlify/functions/
```

## Render deployment

- Runtime: Node
- Build command: `npm ci`
- Start command: `npm start`
- Environment variable: `OPENWEATHER_API_KEY`

## Netlify deployment

Connect the repository to Netlify and add this environment variable:

```text
OPENWEATHER_API_KEY=your_real_openweather_api_key
```

The included Netlify Function securely proxies weather requests.

## Troubleshooting

### `package.json` not found

Run npm commands inside the folder that directly contains `package.json`.

```powershell
Get-ChildItem package.json
```

### Old UI appears

Stop old servers with `Ctrl + C`, close old tabs, and open:

```text
http://localhost:5055
```

Use `Ctrl + Shift + R` once to force a fresh reload.

### API key error

Confirm `.env` is beside `server.js` and contains:

```env
OPENWEATHER_API_KEY=your_real_key
PORT=5055
```

## Author

Made with love by **Arnav**.
