import React, { useState, useEffect } from "react";
import "./App.css";
import { MenuItem, Paper, Select, CardContent } from "@material-ui/core";
import InfoBox from "./component/infoBox/InfoBox";
import StateInfoBox from "./component/infoBox/StateInfoBox";
import LineGraph from "./component/chart/LineGraph";
import Table from "./component/table/Table";
import { sortData, prettyPrintStat } from "./component/utility/Util";
import numeral from "numeral";
import Map from "./component/map/Map";
import "leaflet/dist/leaflet.css";
import StatesTable from "./component/table/StatesTable";
import NavBar from "./component/nav/NavBar";
import { makeStyles } from "@material-ui/core/styles";

const App = () => {
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 48.4637, lng: 3.436 });
  const [hosptialInfo, setHosptialInfo] = useState(false);
  const [availableBeds, setAvailableBeds] = useState(0);
  const [usedBeds, setUsedBeds] = useState(0);
  const [totalBeds, setTotalBeds] = useState(0);
  const [totalCases, setTotalCases] = useState(0);
  const [recoveredCases, setRecoveredCases] = useState(0);
  const [deathsCases, setDeathsCases] = useState(0);
  const [dailyTotalCases, setDailyTotalCases] = useState("");
  const [dailyRecoveredCases, setDailyRecoveredCases] = useState("");
  const [dailyDeathsCases, setDailyDeathsCases] = useState("");
  const [statesTableData, setStatesTableData] = useState([]);

  /* States Informations */
  const [states, setStates] = useState([]);
  const [state, setState] = useState("States");
  const [counties, setCounties] = useState([]);
  const [county, setCounty] = useState("Counties");
  const [stateAbbr, setStateAbbr] = useState([]);

  const [statesInfo, setStatesInfo] = useState([]);
  const [stateInfo, setStateInfo] = useState([]);
  const [allStatesInfo, setAllStatesInfo] = useState([]);
  const [color, setColor] = useState("rgba(255,0,255,0.2)");

  useEffect(() => {
    const getStatesData = async () => {
      await fetch(
        "https://data.covidactnow.org/latest/us/states.STRONG_INTERVENTION.json"
      )
        .then((response) => response.json())
        .then((data) => {
          const tempStates = data.map((m) => ({
            name: m.stateName,
            value: m.fips,
            hospitalInfo: m.actuals.hospitalBeds,
          }));
          let sortedData = sortData(data);
          setStatesTableData(sortedData);
          setStates(tempStates);
        });
    };
    getStatesData();
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso3,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, []);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    fetch("https://covid-api.com/api/reports/")
      .then((response) => response.json())
      .then((data) => {
        const tempStates = data.data.map((m) => ({
          countryName: m.region.name,
          countryIso: m.region.iso,
          name: m.region.province,
          lat: m.region.lat,
          long: m.region.long,
          confirmed: m.confirmed,
          deaths: m.deaths,
          recovered: m.recovered,
          todayConfirmed: m.confirmed_diff,
          todayDeaths: m.deaths_diff,
          todayRecovered: m.recovered_diff,
        }));
        setAllStatesInfo(tempStates);
      });
  }, []);

  //on selecting country
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setState("States");
    setCounties([]);
    setStatesInfo([]);
    setStateInfo([]);
    setCounty("Counties");
    setTotalBeds(0);
    setUsedBeds(0);
    setAvailableBeds(0);

    if (countryCode === "USA") {
      setHosptialInfo(true);
      await fetch(
        "https://worldpopulationreview.com/static/states/name-abbr.json"
      )
        .then((response) => response.json())
        .then((data) => {
          setStateAbbr(data);
        });
    } else setHosptialInfo(false);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        if (countryCode === "worldwide")
          setMapCenter({ lat: 48.4637, lng: 3.436 });
        else
          setMapCenter({
            lat: data.countryInfo.lat,
            lng: data.countryInfo.long,
          });
      });

    setStatesInfo(
      allStatesInfo.filter(
        (x) =>
          x.countryIso.toLowerCase() === countryCode.toLowerCase() &&
          x.name !== ""
      )
    );
  };

  //on selecting states
  const onStateChange = async (e) => {
    const stateCode = e.target.value;
    setState(stateCode);
    setStateInfo(
      statesInfo.filter((x) => x.name.toLowerCase() === stateCode.toLowerCase())
    );

    if (stateCode !== "States") {
      if (hosptialInfo) {
        DataForUSA(stateCode);
        setMapCenter({
          lat: statesInfo.filter(
            (x) => x.name.toLowerCase() === stateCode.toLowerCase()
          )[0].lat,
          lng: statesInfo.filter(
            (x) => x.name.toLowerCase() === stateCode.toLowerCase()
          )[0].long,
        });
      } else {
        const stateData = allStatesInfo.filter(
          (x) => x.countryIso === country && x.name === stateCode
        )[0];
        setTotalCases(stateData.confirmed ? stateData.confirmed : 0);
        setRecoveredCases(stateData.recovered ? stateData.recovered : 0);
        setDeathsCases(stateData.deaths ? stateData.deaths : 0);
        setDailyTotalCases(
          stateData.todayConfirmed ? stateData.todayConfirmed : 0
        );
        setDailyRecoveredCases(
          stateData.todayRecovered ? stateData.todayRecovered : 0
        );
        setDailyDeathsCases(stateData.todayDeaths ? stateData.todayDeaths : 0);
        setMapCenter({
          lat: stateData.lat,
          lng: stateData.long,
        });
      }
    } else {
      setMapCenter({
        lat: countryInfo.countryInfo.lat,
        lng: countryInfo.countryInfo.long,
      });
    }
  };

  const DataForUSA = async (stateCode) => {
    await fetch(
      "https://data.covidactnow.org/latest/us/counties.NO_INTERVENTION.json"
    )
      .then((response) => response.json())
      .then((data) => {
        const tempCounties = data.map((m) => ({
          stateName: m.stateName,
          name: m.countyName,
          value: m.fips,
          countyInfo: m.actuals,
        }));
        setCounties(
          tempCounties.filter(
            (x) => x.stateName.toLowerCase() === stateCode.toLowerCase()
          )
        );
      });

    setCounty("Counties");
    const stateHospitalInfo = states.find(
      (x) => x.name.toLowerCase() === stateCode.toLowerCase()
    );
    if (stateHospitalInfo) {
      setTotalBeds(
        stateHospitalInfo.hospitalInfo.capacity
          ? stateHospitalInfo.hospitalInfo.capacity
          : 0
      );
      setUsedBeds(
        stateHospitalInfo.hospitalInfo.currentUsageCovid
          ? stateHospitalInfo.hospitalInfo.currentUsageCovid
          : 0
      );
      setAvailableBeds(
        (stateHospitalInfo.hospitalInfo.capacity
          ? stateHospitalInfo.hospitalInfo.capacity
          : 0) -
          (stateHospitalInfo.hospitalInfo.currentUsageCovid
            ? stateHospitalInfo.hospitalInfo.currentUsageCovid
            : 0)
      );
    }

    fetch(
      `https://api.covidtracking.com/v1/states/${stateAbbr[stateCode]}/current.json`
    )
      .then((response) => response.json())
      .then((stateInfo) => {
        setTotalCases(stateInfo.positive ? stateInfo.positive : 0);
        setRecoveredCases(stateInfo.negative ? stateInfo.negative : 0);
        setDeathsCases(stateInfo.death ? stateInfo.death : 0);
        setDailyTotalCases(
          stateInfo.positiveIncrease ? stateInfo.positiveIncrease : 0
        );
        setDailyRecoveredCases(
          stateInfo.negativeIncrease ? stateInfo.negativeIncrease : 0
        );
        setDailyDeathsCases(
          stateInfo.deathIncrease ? stateInfo.deathIncrease : 0
        );
      });
  };

  const onCardClick = (caseType) => () => {
    setCasesType("cases");
    setColor("rgba(255,0,255,0.5)");

    if (caseType === "deaths") {
      setCasesType("deaths");
      setColor("rgba(255,140,0,0.8)");
    } else if (caseType === "recovered") {
      setCasesType("recovered");
      setColor("rgba(124,252,0,0.6)");
    }
  };

  const onCountyChange = async (e) => {
    const countyCode = e.target.value;
    const county = counties.find(
      (x) => x.name.toLowerCase() === countyCode.toLowerCase()
    );
    setCounty(county ? county.name : "Counties");
    if (county && county !== "Counties") {
      setTotalBeds(
        county.countyInfo.hospitalBeds.capacity
          ? county.countyInfo.hospitalBeds.capacity
          : 0
      );
      setUsedBeds(
        county.countyInfo.hospitalBeds.currentUsageCovid
          ? county.countyInfo.hospitalBeds.currentUsageCovid
          : 0
      );
      setAvailableBeds(
        (county.countyInfo.hospitalBeds.capacity
          ? county.countyInfo.hospitalBeds.capacity
          : 0) -
          (county.countyInfo.hospitalBeds.currentUsageCovid
            ? county.countyInfo.hospitalBeds.currentUsageCovid
            : 0)
      );
      setTotalCases(
        county.countyInfo.cumulativeConfirmedCases
          ? county.countyInfo.cumulativeConfirmedCases
          : 0
      );
      setRecoveredCases(
        county.countyInfo.cumulativeNegativeTests
          ? county.countyInfo.cumulativeNegativeTests
          : 0
      );
      setDeathsCases(
        county.countyInfo.cumulativeDeaths
          ? county.countyInfo.cumulativeDeaths
          : 0
      );
      setDailyTotalCases("Not Available");
      setDailyRecoveredCases("Not Available");
      setDailyDeathsCases("Not Available");
    }
  };

  let stateListTable;
  if (hosptialInfo) {
    stateListTable = (
      <CardContent>
        <h3>Total Cases by States</h3>
        <StatesTable states={statesTableData} />
      </CardContent>
    );
  } else {
    stateListTable = (
      <div>
        <h3>Live Cases by Country</h3>
        <Table countries={tableData} />
      </div>
    );
  }

  const dropdownStyles = makeStyles((theme) => {
    return {
      root: {
        background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
        borderRadius: 3,
        border: 0,
        color: "black",
        width: "160px",
        height: "32px",
        padding: "0 0 0 16px",
        boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
        display: "flex",
        alignItems: "center",
        [theme.breakpoints.down(600)]: {
          width: "55px",
          fontSize: "13px",
          padding: "0 0 0 5px",
          fontWeight: "500", 
          alignItems: "space-between",
        },

        [theme.breakpoints.between('sm', 'md')]: {
          width: "70px",
          fontSize: "15px",
          padding: "0 0 0 10px",
          fontWeight: "600", 
          alignItems: "space-between",
        },
      },
    };
  });

  const tableStyles = makeStyles({
    root: {
      background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
      width:"100%",
      borderRadius: 5,
      color: "black",
      padding: "5px",
      border:0,
    },
  });

  const drop = dropdownStyles();
  const list = tableStyles();
   
  return (
    <div className="app">
      <div className="app-header">
        <NavBar />
      </div>
      <div className="app-background">
        <div className="app-body">
          <div className="app-infobox">
              <InfoBox
                onClick={onCardClick("Coronavirus Cases")}
                title="Infected Cases"
                color="linear-gradient(45deg, #ab47bc, #007bff)"
                isRed
                active={casesType === "cases"}
                cases={prettyPrintStat(
                  state !== "States" ? dailyTotalCases : countryInfo.todayCases
                )}
                total={numeral(
                  state !== "States" ? totalCases : countryInfo.cases
                ).format("0,0")}
              />
              <InfoBox
                onClick={onCardClick("recovered")}
                title="Recovered"
                color="linear-gradient(45deg, #43a047, #b9cb20)"
                active={casesType === "recovered"}
                cases={prettyPrintStat(
                  state !== "States"
                    ? dailyRecoveredCases
                    : countryInfo.todayRecovered
                )}
                total={numeral(
                  state !== "States" ? recoveredCases : countryInfo.recovered
                ).format("0,0")}
              />
              <InfoBox
                onClick={onCardClick("deaths")}
                title="Deaths"
                color="linear-gradient(45deg, #ee0979, #fba200)"
                isRed
                active={casesType === "deaths"}
                cases={prettyPrintStat(
                  state !== "States" ? dailyDeathsCases : countryInfo.todayDeaths
                )}
                total={numeral(
                  state !== "States" ? deathsCases : countryInfo.deaths
                ).format("0,0")}
              />
              <StateInfoBox
                availBeds={availableBeds}
                usedBeds={usedBeds}
              totalBeds={totalBeds}
              color="linear-gradient(45deg, #ab47bc, #007bff)"
              />
            </div>
          <div className="app-center">
              <div className="app-menu">
                <Select
                  className="app-menu-dropdown buttonStyle"
                  variant="outlined"
                  value={country}
                  onChange={onCountryChange}
                  classes={{
                    root: drop.root, // class name, e.g. `classes-nesting-root-x`
                  }}
                >
                  <MenuItem value="worldwide">Worldwide</MenuItem>
                  {countries.map((country) => (
                    <MenuItem value={country.value}>{country.name}</MenuItem>
                  ))}
                </Select>
                <Select
                  disabled={statesInfo.length <= 0}
                  className="app__menu--Dropdown buttonStyle"
                  variant="outlined"
                  onChange={onStateChange}
                  value={state}
                  classes={{
                    root: drop.root, // class name, e.g. `classes-nesting-root-x`
                  }}
                >
                  <MenuItem value="States">States</MenuItem>
                  {statesInfo.map((m) => (
                    <MenuItem value={m.name}>{m.name}</MenuItem>
                  ))}
                </Select>
                <Select
                  disabled={counties.length <= 0}
                  className="app__menu--Dropdown buttonStyle"
                  variant="outlined"
                  onChange={onCountyChange}
                  value={county}
                  classes={{
                    root: drop.root, // class name, e.g. `classes-nesting-root-x`
                  }}
                >
                  <MenuItem value="Counties">Counties</MenuItem>
                  {counties.map((m) => (
                    <MenuItem value={m.name}>{m.name}</MenuItem>
                  ))}
                </Select>
              </div>
              <Paper elevation={24} className="app-map">
                <Map
                  stateInfo={stateInfo}
                  countries={
                    !country || country === "worldwide"
                      ? mapCountries
                      : mapCountries.filter(
                          (x) => x.countryInfo.iso3 === country
                        )
                  }
                  casesType={casesType}
                  center={mapCenter}
                  zoom={country === "worldwide" ? 2 : 4}
                />
              </Paper>
          </div>
          <div className="app-right">
            <div className="app-table">    
              <Paper classes={{ root: list.root, }}
              elevation={24}>
                {stateListTable}
              </Paper>  
            </div>
            <div className="app-chart">
              <Paper classes={{ root: list.root, }}
              elevation={24}>
                <h3>Trends for last 120 days</h3>
                <LineGraph
                  className="graphChartsCard"
                  casesType={casesType}
                  countryCode={country}
                  color={color}
                />
              </Paper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
