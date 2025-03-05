import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import { useState, useEffect } from "react";
import Axios from "axios";
import logo from "./img/logo.svg";



function App() {

  const API_KEY = process.env.REACT_APP_APIKEY;
  const BASE_URL = process.env.REACT_APP_APIBASE;

  const center = {
    lat: -26.1887,
    lng: 28.0412,
  };

  const [data, setData] = useState(null);

  const [position, setPosition] = useState(center);
  const [citySearch, setCitySearch] = useState("");
  const [city, setCity] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [weatherCondition, setWeatherCondition] = useState(null);
  const [weatherDescription, setWeatherDescription] = useState(null);
  const [wind, setWind] = useState(null);
  const [icon, setIcon] = useState(null);
  const [location, setLocation] = useState([-26.1887, 28.0412]);

  useEffect(() => {
    Axios.get(
      `${BASE_URL}/data/2.5/forecast?lat=${position.lat}&lon=${position.lng}&appid=${API_KEY}`
    )
      .then((response) => {
        const data = response.data;
        setData(data);
        setCity(data.city.name);
        setTemperature(data.list[0].main.temp);
        setWeatherCondition(data.list[0].weather[0].main);
        setWeatherDescription(data.list[0].weather[0].description);
        setIcon(data.list[0].weather[0].icon);
        setWind(data.list[0].wind.speed);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [position.lat, position.lon]);

  // Updates the map center

  const UpdateMapCenter = ({ location }) => {
    const map = useMap();

    useEffect(() => {
      map.setView(location, 13);
    }, [location, map]);

    return null;
  };

  // Handle marker drag event
  const handleDragEnd = (e) => {
    const marker = e.target;
    if (marker != null) {
      const newPosition = marker.getLatLng();
      setPosition(newPosition);
      setLocation([newPosition.lat, newPosition.lng]);
    }
  };

  // Geocoding API to convert city name to coordinates
  const geocodeCity = async (city) => {
    try {
      await Axios.get(
        `${BASE_URL}/geo/1.0/direct?q=${city}&limit=1&appid=e0d6356329d6891299a0e2ed3a0a7bf0`
      ).then((response) => {
        const data = response.data;

        if (data.length === 0) {
          alert("City not found!");
          return;
        }

        setPosition({ lat: data[0].lat, lng: data[0].lon });
        setLocation([data[0].lat, data[0].lon]);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Search for city
  const handleSearch = (e) => {
    e.preventDefault();
    geocodeCity(citySearch);
  };


  // Costume Icon
  const customeIcon = new Icon({
    iconUrl: require("./img/location.png"),
    iconSize: [60, 60],
  });

  return (
    <div className="App">
      <div className="sidebar">
        <div className="logo">
          <img src={logo} alt="Logo" width="50%" />
        </div>

        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            placeholder="Search city..."
            className="search-input"
          />
          <button type="submit" className="Search-button">
            <span className="material-symbols-outlined">search</span>
          </button>
        </form>

        {city && (
          <h1>
            <span className="material-symbols-outlined">apartment</span> {city}
          </h1>
        )}

        {icon && (
          <img
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            alt={weatherDescription}
            className="weather-icon"
          />
        )}

        <div className="weather-info">
          <div>
            {temperature && (
              <div>
                <p>
                  <span className="material-symbols-outlined">
                    device_thermostat
                  </span>
                  <span> {(temperature - 273.15).toFixed(1)}°C</span>
                </p>
              </div>
            )}

            {wind && (
              <p>
                <span className="material-symbols-outlined">air</span>{" "}
                {(wind * 3.6).toFixed(1)} km/h
                {/* <span> ({wind} m/s)</span>*/}
              </p>
            )}
          </div>

          <div>
            {weatherCondition && (
              <p>
                <strong>{weatherCondition}</strong>
              </p>
            )}

            {weatherDescription && <p className="desc">{weatherDescription}</p>}
          </div>
        </div>
      </div>

      <div className="main-content">
        <MapContainer center={location} zoom={13} scrollWheelZoom={true}>
          <UpdateMapCenter location={location} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            position={position}
            icon={customeIcon}
            draggable={true}
            eventHandlers={{ dragend: handleDragEnd }}
          >
            <Popup className="popup">
              <div className="sidebar-mobile">
                <form onSubmit={handleSearch} className="search-bar">
                  <input
                    type="text"
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    placeholder="Search city..."
                    className="search-input"
                  />
                  <button type="submit" className="Search-button">
                    <span className="material-symbols-outlined">search</span>
                  </button>
                </form>

                {city && (
                  <h1>
                    <span className="material-symbols-outlined">apartment</span>{" "}
                    {city}
                  </h1>
                )}

                {icon && (
                  <img
                    src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                    alt={weatherDescription}
                    className="weather-icon"
                  />
                )}

                <div className="weather-info">
                  <div>
                    {temperature && (
                      <div>
                        <p>
                          <span className="material-symbols-outlined">
                            device_thermostat
                          </span>
                          <span> {(temperature - 273.15).toFixed(1)}°C</span>
                        </p>
                      </div>
                    )}

                    {wind && (
                      <p>
                        <span className="material-symbols-outlined">air</span>{" "}
                        {(wind * 3.6).toFixed(1)} km/h
                      </p>
                    )}
                  </div>

                  <div>
                    {weatherCondition && (
                      <p>
                        <strong>{weatherCondition}</strong>
                      </p>
                    )}

                    {weatherDescription && (
                      <p className="desc">{weatherDescription}</p>
                    )}
                  </div>
                </div>
              </div>
            </Popup>
            <Tooltip>Drag Me</Tooltip>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default App;
