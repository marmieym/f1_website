# 🏎️ F1 Stats

A small website that shows the current Formula 1 season: driver standings, a driver comparison tool, and the race calendar.

Built with Flask (Python) and plain HTML, CSS and JavaScript. Data comes from the free [Jolpica F1 API](https://api.jolpi.ca).

## Features

- **Standings:** current driver standings with team, points and wins
- **Compare:** pick two drivers and see their stats side by side
- **Schedule:** the full race calendar for the season

## How to run

1. Clone the project and go into the folder:
   ```
   git clone https://github.com/marmieym/f1-stats.git
   cd f1-stats
   ```
2. Create and activate a virtual environment:
   ```
   python3 -m venv venv
   source venv/bin/activate
   ```
   On Windows, use `venv\Scripts\activate` instead.
3. Install the requirements:
   ```
   pip install -r requirements.txt
   ```
4. Start the app:
   ```
   python app.py
   ```
5. Open http://127.0.0.1:5000 in your browser.

## Project structure

```
├── app.py            # Flask server and API routes
├── requirements.txt  # Python packages
├── templates/
│   └── index.html    # The page
└── static/
    ├── style.css     # Styling
    └── script.js     # Fetches data and updates the page
```

## API routes

| Route | What it returns |
|---|---|
| `/api/standings` | Current driver standings |
| `/api/schedule` | Race calendar |
| `/api/compare?d1=ID&d2=ID` | Stats for two drivers |

## Credits

Race data from the [Jolpica F1 API](https://api.jolpi.ca).
