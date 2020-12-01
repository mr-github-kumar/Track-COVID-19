import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import styled from "@emotion/styled/macro";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          parser: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

function LineGraph({ casesType, countryCode, color }) {
  const [data, setData] = useState({});

  const url =
    !countryCode || countryCode === "worldwide"
      ? "https://disease.sh/v3/covid-19/historical/all?lastdays=120"
      : `https://disease.sh/v3/covid-19/historical/${countryCode}?lastdays=120`;

  useEffect(() => {
    const fetchData = async () => {
      await fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const result =
            !countryCode || countryCode === "worldwide" ? data : data.timeline;
          let chartData = buildChartData(result, casesType);
          setData(chartData);
        });
    };

    fetchData();
  });

  const LineDiv = styled.div({
    cursor: "pointer",
    height: "100%",
    padding: ".5rem",
    width: "100%",
    background: "linear-gradient(#a1c4fd,#c2e9fb)",
    margin: "5px 0 0 0",
    borderRadius: "5px",
  });

  return (
    <LineDiv> 
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: color,
                borderColor: color,
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
    </LineDiv>
  );
}

export default LineGraph;
