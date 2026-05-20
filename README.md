# EastTNWXNet - East Tennessee Weather Network

A modern, news-channel themed weather website dedicated to providing hyper-local weather information for East Tennessee.

## Features

### 🌡️ Current Weather Conditions
- Real-time temperature, humidity, and wind data
- "Feels like" temperature
- Pressure, dew point, and visibility
- UV Index tracking
- Animated weather icons
- Last update timestamp

### 📡 Live Weather Radar
- Embedded Windy.com radar showing real-time precipitation
- Centered on Knoxville, TN
- Zoom capabilities for detailed view
- Live radar refresh

### 🗓️ 7-Day Forecast
- Extended outlook for East Tennessee
- Daily high/low temperatures
- Weather condition descriptions
- Precipitation probability
- Wind speed forecasts
- Responsive card layout

### 📰 NOAA Forecast Discussion
- Official National Weather Service discussion
- Updated forecast analysis
- Issued timestamp
- Real-time data from NWS API

### 🎨 News-Channel Themed Design
- Professional dark theme with accent colors
- Breaking news-style update banner
- Card-based layout mimicking broadcast graphics
- Smooth animations and transitions
- Fully responsive for mobile and desktop
- Accessibility optimized

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **APIs Used**:
  - [Open-Meteo API](https://open-meteo.com/) - Current conditions and 7-day forecast
  - [Windy.com Embed](https://www.windy.com/) - Live weather radar
  - [National Weather Service API](https://api.weather.gov/) - NOAA Forecast Discussion
  - [Google Maps API](https://maps.googleapis.com/) - Optional for additional mapping features

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for API calls
- (Optional) Google Maps API key for enhanced features

### Installation

1. Clone the repository:
```bash
git clone https://github.com/brennonb7273/easttnwxnet.git
cd easttnwxnet
```

2. Open `index.html` in your web browser or serve it with a local web server:
```bash
python -m http.server 8000
# or
npx http-server
```

3. (Optional) Add your Google Maps API key:
   - Get a key from [Google Cloud Console](https://console.cloud.google.com/)
   - Replace `YOUR_GOOGLE_MAPS_API_KEY` in `index.html`

### Local Development

The project uses no build tools or dependencies - it's pure HTML, CSS, and JavaScript. Simply edit the files and refresh your browser to see changes.

## File Structure

```
easttnwxnet/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── app.js              # Weather data fetching and DOM manipulation
└── README.md           # This file
```

## How It Works

### Data Flow

1. **Current Conditions**: Every 10 minutes (configurable), `app.js` fetches current weather from Open-Meteo API
2. **7-Day Forecast**: Daily forecast data is fetched and displayed in a responsive card grid
3. **NOAA Discussion**: Latest forecast discussion is retrieved from NWS API
4. **Radar**: Embedded Windy.com widget provides live radar

### Key JavaScript Functions

- `updateWeatherData()` - Main function that orchestrates all data updates
- `updateCurrentConditions()` - Fetches and displays current weather
- `updateForecast()` - Fetches and displays 7-day forecast
- `updateNOAADiscussion()` - Fetches and displays NWS forecast discussion
- `getWeatherDescription(code)` - Converts WMO weather codes to descriptions
- `getWindDirection(degrees)` - Converts degrees to cardinal directions

## Configuration

Edit the `CONFIG` object in `app.js` to customize:

```javascript
const CONFIG = {
    latitude: 35.9646,           // Knoxville, TN
    longitude: -83.9277,         // Can be changed to any location
    openMeteoUrl: '...',         // Open-Meteo API endpoint
    noaaDiscussionUrl: '...',    // NWS API endpoint
    updateInterval: 600000,      // Update every 10 minutes (in milliseconds)
};
```

## Customization

### Change Location
Update the `latitude` and `longitude` in `app.js` to forecast for a different location:
```javascript
latitude: YOUR_LATITUDE,
longitude: YOUR_LONGITUDE,
```

### Update Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #1a1a2e;
    --accent-color: #e94560;
    --accent-orange: #ff6b35;
    /* ... more colors ... */
}
```

### Update Refresh Interval
Change `updateInterval` in the `CONFIG` object (value in milliseconds):
```javascript
updateInterval: 300000,  // 5 minutes instead of 10
```

## API Credits

- **Open-Meteo**: Free weather API with global coverage
- **Windy.com**: Weather radar and visualization
- **National Weather Service**: Official US weather data
- **Icons**: Emoji weather icons (no additional dependencies)

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

This project is open source and available for personal and commercial use.

## Support & Contributing

If you find bugs or have feature suggestions, please open an issue on GitHub.

## Future Enhancements

- [ ] Multiple location support
- [ ] User-saved favorite locations
- [ ] Weather alerts notification system
- [ ] Hourly forecast detail
- [ ] Air quality index (AQI)
- [ ] Sunrise/sunset times
- [ ] Historical weather data
- [ ] PWA (Progressive Web App) support
- [ ] Dark/Light theme toggle
- [ ] Social media sharing

---

**EastTNWXNet** - Your source for East Tennessee weather. Stay informed, stay safe! 🌤️
