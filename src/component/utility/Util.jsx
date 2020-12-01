import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";
import "../map/Map.css";

const casesTypeColors = {
  cases: {
    hex: "#8A2BE2",
    rgb: "rgb(138,43,226)",
    half_op: "rgba(138,43,226,0.5)",
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd71d",
    rgb: "rgb(125, 215, 29)",
    half_op: "rgba(125, 215, 29, 0.5)",
    multiplier: 1200,
  },
  deaths: {
    hex: "#fb4443",
    rgb: "rgb(251, 68, 67)",
    half_op: "rgba(251, 68, 67, 0.5)",
    multiplier: 2000,
  },
};

export const sortData = (data) => {
  let sortedData = [...data];
  sortedData.sort((a, b) => {
    if (a.cases > b.cases) {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedData;
};

export const prettyPrintStat = (stat) =>
  stat ? `${numeral(stat).format("0,0")}` : "0";

export const showDataOnMap = (data, casesType = "cases") =>
  data.map((country) => (
    <Circle
      className="blinking"
      center={[country.countryInfo.lat, country.countryInfo.long]}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      fillOpacity={0.4}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          ></div>
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));

export const showDataOnMapForStates = (data, casesType = "cases") => (
  <Circle
    className="blinking"
    center={[data.lat, data.long]}
    color={casesTypeColors[casesType].hex}
    fillColor={casesTypeColors[casesType].hex}
    fillOpacity={0.4}
    radius={Math.sqrt(data.confirmed) * casesTypeColors[casesType].multiplier}
  >
    <Popup>
      <div className="info-container">
        <div className="info-name">{data.name}</div>
        <hr />
        <div className="info-confirmed">
          Cases: {numeral(data.confirmed).format("0,0")}
        </div>
        <div className="info-deaths">
          Deaths: {numeral(data.deaths).format("0,0")}
        </div>
      </div>
    </Popup>
  </Circle>
);
