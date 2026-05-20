// Configuration
const CONFIG = {
    // Knoxville, TN coordinates
    latitude: 35.9646,
    longitude: -83.9277,
    openMeteoUrl: 'https://api.open-meteo.com/v1/forecast',
    noaaDiscussionUrl: 'https://api.weather.gov/products/types/AFD/locations/mrx',
    updateInterval: 600000, // 10 minutes
};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    updateWeatherData();
    // Update weather data every 10 minutes
    setInterval(updateWeatherData, CONFIG.updateInterval);
});

/**
 * Fetch and display current weather conditions
 */
async function updateWeatherData() {
    try {
        await Promise.all([
            updateCurrentConditions(),
            updateForecast(),
            updateNOAADiscussion(),
        ]);
    } catch (error) {
        console.error('Error updating weather data:', error);
    }
}

/**
 * Update current weather conditions from Open-Meteo API
 */
async function updateCurrentConditions() {
    try {
        const response = await fetch(
            `${CONFIG.openMeteoUrl}?latitude=${CONFIG.latitude}&longitude=${CONFIG.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,dew_point_2m,visibility,uv_index&timezone=America/Chicago`
        );
        
        if (!response.ok) throw new Error('Failed to fetch current conditions');
        
        const data = await response.json();
        const current = data.current;
        
        // Update DOM elements
        document.getElementById('currentTemp').textContent = Math.round(current.temperature_2m) + '°';
        document.getElementById('feelsLike').textContent = Math.round(current.apparent_temperature) + '°';
        document.getElementById('humidity').textContent = current.relative_humidity_2m + '%';
        document.getElementById('windSpeed').textContent = Math.round(current.wind_speed_10m) + ' mph';
        document.getElementById('windDir').textContent = getWindDirection(current.wind_direction_10m);
        document.getElementById('pressure').textContent = (current.pressure_msl / 33.864).toFixed(2) + '"';
        document.getElementById('dewPoint').textContent = Math.round(current.dew_point_2m) + '°';
        document.getElementById('visibility').textContent = Math.round(current.visibility / 1609.34) + ' mi';
        document.getElementById('uvIndex').textContent = Math.round(current.uv_index);
        
        // Update weather description and icon
        const { description, icon } = getWeatherDescription(current.weather_code);
        document.getElementById('weatherDesc').textContent = description;
        document.getElementById('weatherIcon').textContent = icon;
        
        // Update timestamp
        const now = new Date();
        document.getElementById('updateTime').textContent = `Last Updated: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        
        // Check for alerts (would need NWS API for actual alerts)
        checkForAlerts();
        
    } catch (error) {
        console.error('Error updating current conditions:', error);
    }
}

/**
 * Update 7-day forecast
 */
async function updateForecast() {
    try {
        const response = await fetch(
            `${CONFIG.openMeteoUrl}?latitude=${CONFIG.latitude}&longitude=${CONFIG.longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=America/Chicago&forecast_days=7`
        );
        
        if (!response.ok) throw new Error('Failed to fetch forecast');
        
        const data = await response.json();
        const daily = data.daily;
        
        // Clear existing forecast cards
        const forecastGrid = document.getElementById('forecastGrid');
        forecastGrid.innerHTML = '';
        
        // Create forecast cards for each day
        for (let i = 0; i < daily.time.length; i++) {
            const date = new Date(daily.time[i]);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            const { description, icon } = getWeatherDescription(daily.weather_code[i]);
            
            const card = document.createElement('div');
            card.className = 'forecast-card';
            card.innerHTML = `
                <div class="forecast-day">${dayName}</div>
                <div class="forecast-date">${dateStr}</div>
                <div class="forecast-icon">${icon}</div>
                <div class="forecast-temps">
                    <div class="temp-high">${Math.round(daily.temperature_2m_max[i])}°</div>
                    <div class="temp-low">${Math.round(daily.temperature_2m_min[i])}°</div>
                </div>
                <div class="forecast-desc">${description}</div>
                <div class="forecast-chance">💧 ${daily.precipitation_probability_max[i]}%</div>
                <div style="font-size: 0.85rem; color: var(--text-light); opacity: 0.7; margin-top: 8px;">Wind: ${Math.round(daily.wind_speed_10m_max[i])} mph</div>
            `;
            forecastGrid.appendChild(card);
        }
    } catch (error) {
        console.error('Error updating forecast:', error);
    }
}

/**
 * Fetch and display NOAA Forecast Discussion
 */
async function updateNOAADiscussion() {
    try {
        const response = await fetch(CONFIG.noaaDiscussionUrl);
        
        if (!response.ok) throw new Error('Failed to fetch NOAA discussion');
        
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
            const latest = data.features[0];
            const properties = latest.properties;
            
            // Extract the discussion text from the product text
            let discussionText = properties.productText || 'No discussion available';
            
            // Clean up the text - remove some header info
            discussionText = discussionText
                .split('\n')
                .slice(10) // Skip initial headers
                .join('\n')
                .trim();
            
            document.getElementById('discussionContent').innerHTML = 
                `<p>${escapeHtml(discussionText)}</p>`;
            
            // Update timestamp
            const issuedTime = new Date(properties.issuedTime);
            document.getElementById('discussionTime').textContent = 
                `Issued: ${issuedTime.toLocaleDateString()} at ${issuedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
    } catch (error) {
        console.error('Error fetching NOAA discussion:', error);
        document.getElementById('discussionContent').innerHTML = 
            '<p>Unable to load NOAA Forecast Discussion at this time. Please check back later.</p>';
    }
}

/**
 * Check for weather alerts from NWS
 */
async function checkForAlerts() {
    try {
        // Get NWS grid point data first
        const pointsResponse = await fetch(`https://api.weather.gov/points/${CONFIG.latitude},${CONFIG.longitude}`);
        
        if (!pointsResponse.ok) return;
        
        const pointsData = await pointsResponse.json();
        const forecastUrl = pointsData.properties.forecast;
        
        // Get forecast which includes alerts
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) return;
        
        // For alerts, we'd need to check another endpoint
        // This is a simplified version - in production use the alerts API
        
    } catch (error) {
        console.error('Error checking for alerts:', error);
    }
}

/**
 * Convert weather code to description and emoji
 * Based on WMO Weather interpretation codes
 */
function getWeatherDescription(code) {
    const descriptions = {
        0: { description: 'Clear Sky', icon: '☀️' },
        1: { description: 'Mainly Clear', icon: '🌤️' },
        2: { description: 'Partly Cloudy', icon: '⛅' },
        3: { description: 'Overcast', icon: '☁️' },
        45: { description: 'Foggy', icon: '🌫️' },
        48: { description: 'Depositing Rime Fog', icon: '🌫️' },
        51: { description: 'Light Drizzle', icon: '🌧️' },
        53: { description: 'Moderate Drizzle', icon: '🌧️' },
        55: { description: 'Dense Drizzle', icon: '🌧️' },
        61: { description: 'Slight Rain', icon: '🌧️' },
        63: { description: 'Moderate Rain', icon: '🌧️' },
        65: { description: 'Heavy Rain', icon: '⛈️' },
        71: { description: 'Slight Snow', icon: '❄️' },
        73: { description: 'Moderate Snow', icon: '❄️' },
        75: { description: 'Heavy Snow', icon: '❄️' },
        80: { description: 'Slight Rain Showers', icon: '🌦️' },
        81: { description: 'Moderate Rain Showers', icon: '🌦️' },
        82: { description: 'Violent Rain Showers', icon: '⛈️' },
        85: { description: 'Slight Snow Showers', icon: '🌨️' },
        86: { description: 'Heavy Snow Showers', icon: '🌨️' },
        95: { description: 'Thunderstorm', icon: '⛈️' },
        96: { description: 'Thunderstorm with Hail', icon: '⛈️' },
        99: { description: 'Thunderstorm with Hail', icon: '⛈️' },
    };
    
    return descriptions[code] || { description: 'Unknown', icon: '🌐' };
}

/**
 * Convert wind direction degrees to cardinal direction
 */
function getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                       'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Optional: Add smooth scrolling for navigation links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
