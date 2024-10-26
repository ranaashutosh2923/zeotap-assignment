// App.js
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
// components/WeatherChart.js
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// components/CityWeatherCard.js
const CityWeatherCard = ({ weatherData }) => {
  if (!weatherData) return null;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-2">{weatherData.city}</h3>
      <div className="space-y-2">
        <p>Temperature: {weatherData.temp}°C</p>
        <p>Feels Like: {weatherData.feels_like}°C</p>
        <p>Weather: {weatherData.main}</p>
        <p>Humidity: {weatherData.humidity}%</p>
        <p>Wind Speed: {weatherData.wind_speed} m/s</p>
      </div>
    </div>
  );
};



// WeatherChart.js
const WeatherChart = ({ historicalData }) => {
  const formatData = (data) => {
    // Sort data by timestamp to ensure correct chronological order
    const sortedData = [...data].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return sortedData.map(item => {
      const date = new Date(item.timestamp);
      return {
        // Format timestamp to show both date and time
        time: `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })}`,
        temp: item.temp,
        feels_like: item.feels_like,
        humidity: item.humidity,
        wind_speed: item.wind_speed
      };
    });
  };

  const formattedData = formatData(historicalData);

  return (
    <div className="w-full overflow-x-auto">
      <LineChart 
        width={1000} 
        height={400} 
        data={formattedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="time" 
          angle={-45}
          textAnchor="end"
          height={80}
          interval="preserveStartEnd"
        />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="temp" 
          stroke="#8884d8" 
          name="Temperature °C"
          dot={false}
        />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="feels_like" 
          stroke="#82ca9d" 
          name="Feels Like °C"
          dot={false}
        />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="humidity" 
          stroke="#ffc658" 
          name="Humidity %"
          dot={false}
        />
        <Line 
          yAxisId="right"
          type="monotone" 
          dataKey="wind_speed" 
          stroke="#ff7300" 
          name="Wind Speed m/s"
          dot={false}
        />
      </LineChart>
    </div>
  );
};

// components/WeatherSummary.js
// WeatherSummary.js
const WeatherSummary = ({ summaryData, selectedCity }) => {
  if (!summaryData || !selectedCity) return null;

  // Find the summary for the selected city
  const citySummary = summaryData.find(summary => summary.city === selectedCity);

  if (!citySummary) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="font-semibold">Average Temperature</h3>
        <p>{citySummary.avgTemp?.toFixed(1)}°C</p>
      </div>
      <div>
        <h3 className="font-semibold">Maximum Temperature</h3>
        <p>{citySummary.maxTemp?.toFixed(1)}°C</p>
      </div>
      <div>
        <h3 className="font-semibold">Minimum Temperature</h3>
        <p>{citySummary.minTemp?.toFixed(1)}°C</p>
      </div>
      <div>
        <h3 className="font-semibold">Dominant Weather</h3>
        <p>{citySummary.dominantCondition}</p>
      </div>
      <div>
        <h3 className="font-semibold">Average Humidity</h3>
        <p>{citySummary.avgHumidity?.toFixed(1)}%</p>
      </div>
      <div>
        <h3 className="font-semibold">Average Wind Speed</h3>
        <p>{citySummary.avgWindSpeed?.toFixed(1)} m/s</p>
      </div>
    </div>
  );
}

const AlertConfig = ({ thresholds, onUpdateThresholds }) => {
  const [config, setConfig] = useState(thresholds);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateThresholds(config);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">High Temperature Alert (°C)</label>
            <input
              type="number"
              value={config.maxTemp}
              onChange={(e) => setConfig({ ...config, maxTemp: parseFloat(e.target.value) })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Low Temperature Alert (°C)</label>
            <input
              type="number"
              value={config.minTemp}
              onChange={(e) => setConfig({ ...config, minTemp: parseFloat(e.target.value) })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Update Alert Thresholds
        </button>
      </form>
    </div>
  );
};

// components/WeatherAlerts.js
const WeatherAlerts = ({ alerts }) => {
  return (
    <div className="space-y-2">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg ${
            alert.type === 'high' ? 'bg-red-100' : 'bg-blue-100'
          }`}
        >
          <p className="font-medium">{alert.message}</p>
          <p className="text-sm text-gray-600">
            {new Date(alert.timestamp).toLocaleString()}
          </p>
          <p className="text-sm">{alert.city}</p>
        </div>
      ))}
    </div>
  );
};

// HistoricalTrends.js
const HistoricalTrends = ({ data, selectedCity }) => {
  if (!data || !selectedCity) return null;

  // Filter data for selected city
  const cityData = data.filter(item => item.city === selectedCity);

  const chartData = cityData.map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    avgTemp: item.avgTemp,
    maxTemp: item.maxTemp,
    minTemp: item.minTemp
  }));

  return (
    <div className="w-full overflow-x-auto">
      <LineChart width={800} height={400} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="avgTemp" stroke="#8884d8" name="Average Temp" />
        <Line type="monotone" dataKey="maxTemp" stroke="#ff0000" name="Max Temp" />
        <Line type="monotone" dataKey="minTemp" stroke="#00ff00" name="Min Temp" />
      </LineChart>
    </div>
  );
};

// components/CitySelector.js
const CitySelector = ({ cities, selectedCity, onCityChange }) => {
  return (
    <div className="w-full max-w-xs">
      <select
        value={selectedCity}
        onChange={(e) => onCityChange(e.target.value)}
        className="w-full p-2 border rounded bg-white shadow-sm"
      >
        <option value="">Select a city</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </div>
  );
};



const CITIES = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

const App = () => {
  const [latestWeather, setLatestWeather] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [historicalData, setHistoricalData] = useState([]);
  const [dailySummaries, setDailySummaries] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [thresholds, setThresholds] = useState({
    maxTemp: 35,
    minTemp: 10
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch latest weather
        const latestResponse = await fetch('http://localhost:5001/api/weather/latest');
        const latestData = await latestResponse.json();
        setLatestWeather(Object.values(latestData));
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch weather data');
        setLoading(false);
      }
    };

    fetchInitialData();
    const interval = setInterval(fetchInitialData, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Fetch data for selected city
  useEffect(() => {
    const fetchCityData = async () => {
      if (!selectedCity) return;

      try {
        setLoading(true);
        // Fetch historical data for selected city
        const historicalResponse = await fetch(
          `http://localhost:5001/api/weather/historical?city=${selectedCity}&days=7`
        );
        const historicalData = await historicalResponse.json();
        setHistoricalData(historicalData);

        // Fetch daily summary for selected city
        const summaryResponse = await fetch(
          `http://localhost:5001/api/weather/summary?city=${selectedCity}`
        );
        const summaryData = await summaryResponse.json();
        setDailySummaries(summaryData);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch city data:', err);
        setError('Failed to fetch city data');
        setLoading(false);
      }
    };

    fetchCityData();
  }, [selectedCity]);

  // Check for alerts based on thresholds
  useEffect(() => {
    const checkAlerts = () => {
      latestWeather.forEach(cityData => {
        if (cityData.temp > thresholds.maxTemp) {
          setAlerts(prev => [
            {
              type: 'high',
              message: `High temperature alert: ${cityData.temp}°C`,
              city: cityData.city,
              timestamp: new Date()
            },
            ...prev.slice(0, 9) // Keep only last 10 alerts
          ]);
        }
        if (cityData.temp < thresholds.minTemp) {
          setAlerts(prev => [
            {
              type: 'low',
              message: `Low temperature alert: ${cityData.temp}°C`,
              city: cityData.city,
              timestamp: new Date()
            },
            ...prev.slice(0, 9)
          ]);
        }
      });
    };

    checkAlerts();
  }, [latestWeather, thresholds]);

  const handleUpdateThresholds = async (newThresholds) => {
    try {
      await fetch('http://localhost:5001/api/weather/thresholds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newThresholds),
      });
      setThresholds(newThresholds);
    } catch (err) {
      console.error('Failed to update thresholds:', err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center mb-8">Weather Monitoring Dashboard</h1>
        
        {/* Current Weather Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {latestWeather.map((cityData) => (
            <CityWeatherCard key={cityData.city} weatherData={cityData} />
          ))}
        </div>

        {/* Alert Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertConfig 
              thresholds={thresholds} 
              onUpdateThresholds={handleUpdateThresholds} 
            />
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Weather Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <WeatherAlerts alerts={alerts} />
          </CardContent>
        </Card>

        {/* City Selection and Data Display */}
{/* City Selection and Data Display */}
          <Card>
          <CardHeader>
            <CardTitle>City Weather Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <CitySelector
                cities={CITIES}
                selectedCity={selectedCity}
                onCityChange={setSelectedCity}
              />

              {selectedCity ? (
                <>
                  {/* Historical Trends */}
                  {historicalData.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Detailed Weather Trends - {selectedCity}
                        <span className="text-sm font-normal ml-2 text-gray-600">
                          Last {historicalData.length} readings
                        </span>
                      </h3>
                      <WeatherChart historicalData={historicalData} />
                    </div>
                  )}

                  {/* Daily Summary */}
                  {dailySummaries.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Daily Weather Summary - {selectedCity}</h3>
                      <WeatherSummary summaryData={dailySummaries} selectedCity={selectedCity} />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Please select a city to view detailed weather analysis
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;