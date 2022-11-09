import { FormEvent, useContext, useEffect, useState } from "react";
import { LocationContext } from "../utils/context";
import { LocationCoords, SearchData, WeatherData } from "../utils/types";
import { RiSearchLine, RiDropFill } from "react-icons/ri";
import { WiCloudy, WiStrongWind } from "react-icons/wi";

import "../styles/global.scss";
import "../styles/LandingPage.scss";

import api from "../services/api";
import search from "../services/search";
import { DebounceInput } from "react-debounce-input";
import { MotionBox } from "../components/MotionBox";

import dayBg from "../assets/images/Backgrounds/day_bg.jpg";
import nightBg from "../assets/images/Backgrounds/night_bg.jpg";
import snowyBg from "../assets/images/Backgrounds/snowy_day_bg.webp";
import thunderstormBg from "../assets/images/Backgrounds/thunderstorm_bg.jpg";
import hazeNightBg from "../assets/images/Backgrounds/haze_night_bg.jpg";
import hazeDayBg from "../assets/images/Backgrounds/haze_day_bg.jpg";
import cloudyDayBg from "../assets/images/Backgrounds/cloudy_day_bg.png";
import cloudyNightBg from "../assets/images/Backgrounds/cloudy_night_bg.jpg";
import rainyBg from "../assets/images/Backgrounds/rainy_bg.webp";
import initialIcon from "../assets/images/icons/04.svg";

const LandingPage = () => {
  const dadosInicias: WeatherData = {
    coord: {
      lon: 0,
      lat: 0,
    },
    weather: [
      {
        main: "initial",
        description: "-",
        icon: "",
      },
    ],
    main: {
      temp: 0,
      feels_like: 0,
      temp_min: 0,
      temp_max: 0,
      pressure: 0,
      humidity: 0,
    },
    wind: {
      speed: 0,
    },
    clouds: {
      all: 0,
    },
    dt: 0,
    sys: {
      country: "-",
    },
    timezone: 0,
    name: "-",
  };

  const [city, setCity] = useState<string>();
  const [data, setData] = useState<WeatherData>(dadosInicias);
  const [results, setResults] = useState<SearchData>();
  const [valid, setValid] = useState(true);
  const [position, setPosition] = useState<LocationCoords>({ lat: 0, lon: 0 });
  const { location, setLocation } = useContext(LocationContext);
  useEffect(() => {
    if (!location) {
      getLocation();
    } else {
      handleCityByCoordinates(location.lat, location.lon);
      setPosition({ lat: location.lat, lon: location.lon });
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (position.lat !== 0 || position.lon !== 0) {
      handleCityByCoordinates(position.lat, position.lon);
    }
  }, [position]);

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          lat: latitude,
          lon: longitude,
        });

        handleCityByCoordinates(latitude, longitude);
      });
    } else {
      alert("Browser does not support geolocation");
    }
  };

  let background = dayBg;
  let day = true;

  const icons = require.context(
    "../assets/images/icons",
    true,
    /\.(png|jpe?g|svg)$/
  );
  const paths = icons.keys();
  const images = paths.map((path: any) => icons(path));

  let icon = initialIcon;

  const handleCityByCoordinates = async (lat: number, lon: number) => {
    await api
      .get(
        `?lat=${lat}&lon=${lon}&appid=e81965343df414cbfb25d98c8741fe2a&units=metric`
      )
      .then((response) => {
        setValid(true);
        setData(response.data);
      });
  };

  const handleCity = async (e: FormEvent) => {
    e.preventDefault();

    await api
      .get(
        `?q=${city}&appid=e81965343df414cbfb25d98c8741fe2a&lang=pt_br&units=metric`
      )
      .then((response) => {
        setData(response.data);
      })
      .catch(() => {
        setValid(false);
      });

    if (data.name !== "-") {
      setValid(true);
    }
  };

  const handleChangeValue = async (value: string) => {
    try {
      setCity(value);
      const query = `?q=${value.trim()}&type=like&sort=population&cnt=30&appid=439d4b804bc8187953eb36d2a8c26a02&_=1604490628153`;
      await search.get(query).then((response) => {
        setResults(response.data);
      });
      setValid(true);
    } catch (err) {
      setValid(false);
      console.error(err);
    }
  };

  const capitalizeString = (string: string) => {
    return string[0].toUpperCase() + string.slice(1);
  };

  switch (data?.weather[0].icon.slice(2)) {
    case "n":
      day = false;
  }

  switch (data?.weather[0].main) {
    case "Clear":
      background = day ? dayBg : nightBg;
      break;

    case "Clouds":
      background = day ? cloudyDayBg : cloudyNightBg;
      break;

    case "Haze":
      background = day ? hazeDayBg : hazeNightBg;
      break;

    case "Thunderstorm":
      background = thunderstormBg;
      break;

    case "Rain":
      background = rainyBg;
      break;

    case "Drizzle":
      background = rainyBg;
      break;

    case "Snow":
      background = snowyBg;
      break;

    default:
      break;
  }

  switch (data?.weather[0].icon) {
    case "01d":
      icon = images[0];
      break;

    case "01n":
      icon = images[1];
      break;

    case "02d":
      icon = images[2];
      break;

    case "02n":
      icon = images[3];
      break;

    case "03d" || "03n" || "04d" || "04n":
      icon = images[4];
      break;

    case "09d":
      icon = images[5];
      break;

    case "09n":
      icon = images[6];
      break;

    case "10d" || "10n":
      icon = images[7];
      break;

    case "11d":
      icon = images[8];
      break;

    case "11n":
      icon = images[9];
      break;

    case "13d":
      icon = images[10];
      break;

    case "13n":
      icon = images[11];
      break;

    case "50d":
      icon = images[12];
      break;

    case "50n":
      icon = images[13];
      break;
  }

  return (
    <div id="main">
      <div className="background">
        <img src={background} alt="Wallpaper" className="img-background" />
      </div>
      <div className="main-grid">
        <MotionBox>
          <div className="content">
            <div className="principal">
              <div className="header">
                <form onSubmit={handleCity}>
                  <div className="extras">
                    <div className="get-location" onClick={getLocation}>
                      <span className="get-location-button">My Location</span>
                    </div>
                    {!valid && <span className="snackbar">Invalid City</span>}
                  </div>

                  <div className="input-wrapper1">
                    <DebounceInput
                      placeholder="Enter the city"
                      type="text"
                      name="city"
                      value={city}
                      onChange={(event) => {
                        handleChangeValue(event.target.value);
                      }}
                      className="cityInput"
                      autoComplete="off"
                      debounceTimeout={300}
                    />
                    <div className="search-results">
                      {results &&
                        results.list.map((result) => {
                          const country = result.sys.country;
                          const flag = `https://raw.githubusercontent.com/hjnilsson/country-flags/master/png100px/${country.toLowerCase()}.png`;
                          return (
                            <div
                              key={result.coord.lat}
                              className="result-item"
                              onClick={() =>
                                handleCityByCoordinates(
                                  result.coord.lat,
                                  result.coord.lon
                                )
                              }
                            >
                              <img
                                className="result-flag"
                                src={flag}
                                alt="bandeira"
                              />
                              <p>
                                <span className="result-city">
                                  {result.name}
                                </span>
                                , {country}
                              </p>
                            </div>
                          );
                        })}
                    </div>

                    <button type="submit" className="searchButton">
                      <RiSearchLine />
                    </button>
                  </div>
                  <div className="input-wrapper2">
                    <DebounceInput
                      type="number"
                      step="any"
                      name="lat"
                      placeholder="Enter the latitude"
                      value={position.lat}
                      onChange={(event) => {
                        setPosition((prev) => ({
                          ...prev,
                          [event.target.name]: event.target.value,
                        }));
                      }}
                      className="posInput"
                      autoComplete="off"
                      debounceTimeout={300}
                    />
                    <DebounceInput
                      type="number"
                      step="any"
                      name="lon"
                      placeholder="Enter the longitude"
                      value={position.lon}
                      onChange={(event) => {
                        setPosition((prev) => ({
                          ...prev,
                          [event.target.name]: event.target.value,
                        }));
                      }}
                      className="posInput"
                      autoComplete="off"
                      debounceTimeout={300}
                    />
                  </div>
                </form>
              </div>
              <div className="result">
                <img src={icon} alt="weather-icon" className="weather-icon" />
                <h1 className="temperature">
                  {data?.main.temp.toFixed(0)}
                  <span>ºC</span>
                </h1>

                <span className="description">
                  {capitalizeString(String(data?.weather[0].description))}
                </span>

                <span className="local">
                  {data?.name}
                  {data.sys.country && `, ${data?.sys.country}`} &nbsp;&nbsp;
                  {data?.sys.country && data?.sys.country !== "-" && (
                    <img
                      src={`https://raw.githubusercontent.com/hjnilsson/country-flags/master/png100px/${data?.sys?.country?.toLowerCase()}.png`}
                      alt="country"
                    />
                  )}
                </span>
              </div>

              <div className="other-results">
                <div className="other">
                  Temperature: <br />
                  <span>{data?.main.feels_like.toFixed(1)} ºC</span>
                </div>
                <div className="other">
                  Min: <br />
                  <span>{data?.main.temp_min.toFixed(1)} ºC</span>
                </div>
                <div className="other">
                  Max: <br />
                  <span>{data?.main.temp_max.toFixed(1)} ºC</span>
                </div>
              </div>
            </div>

            <div className="secondary">
              <div className="secondary-results">
                <div className="other-secondary-results">
                  <div className="icon-secondary-results humidity">
                    <RiDropFill />
                  </div>
                  <p>
                    humidity: <br />
                    {data?.main.humidity}%
                  </p>
                </div>

                <div className="other-secondary-results">
                  <div className="icon-secondary-results">
                    <WiStrongWind />
                  </div>
                  <p>
                    Wind Speed: <br />
                    {data?.wind.speed.toFixed(1)} m/s
                  </p>
                </div>

                <div className="other-secondary-results">
                  <div className="icon-secondary-results">
                    <WiCloudy />
                  </div>
                  <p>
                    Clouds: <br />
                    {data?.clouds.all}%
                  </p>
                </div>
              </div>
              {data?.name !== "-" && (
                <div className="go-maps">
                  <a
                    href={`https://www.google.com/maps/@${data?.coord.lat},${data?.coord.lon},12z`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Google Map
                  </a>
                </div>
              )}
            </div>
          </div>{" "}
        </MotionBox>
      </div>
    </div>
  );
};

export default LandingPage;
