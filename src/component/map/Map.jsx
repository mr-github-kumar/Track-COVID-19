import React from "react";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import "./Map.css";
import { showDataOnMap, showDataOnMapForStates } from "../utility/Util";
import { Paper } from "@material-ui/core";
function Map({ stateInfo, countries, casesType, center, zoom }) {
  return (
    <Paper elevation={24} className="map">
      <LeafletMap center={center} zoom={zoom} className="titleLayer">
        <TileLayer
          url="https://api.mapbox.com/styles/v1/kk2210/ckf50x2330fxs19npy9k51ms7/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2syMjEwIiwiYSI6ImNrZjUwdHMwNzBpa3Uycm1xMjg1aWd1dDQifQ.EVSScEdfEu6u81Ww2C7m-Q"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        />
        {stateInfo.length > 0
          ? showDataOnMapForStates(stateInfo[0], casesType)
          : showDataOnMap(countries, casesType)}
      </LeafletMap>
    </Paper>
  );
}

export default Map;
