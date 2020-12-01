import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";
import styled from "@emotion/styled/macro";
import { makeStyles } from "@material-ui/core/styles";

function StateInfoBox({ availBeds,color, usedBeds, totalBeds }) {

  const Background = styled.div({
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundImage: color,
    cursor: "pointer",
    width: "100%",
    height:"100%",
    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    padding:"5px",
  });

  const cardStyles = makeStyles({
    root: {
      width:"100%",
      borderRadius: 5,
      padding: "5px",
      border:0,
    },
  });

  const info = cardStyles();

  return (
    <Card className="card">
      <Background>
        <CardContent classes={{ root: info.root, }}>
          <div class="card-header">
            <Typography color="textPrimary">Hospitalised</Typography>
          </div>
          {/* <Typography className="hospCases" color="textPrimary">
            Available Beds: {availBeds}
          </Typography> */}
          <Typography className="hospCases">
            <h1>{usedBeds}</h1>
          </Typography>
          {/* <Typography className="hospCases" color="textSecondary">
            Total: {totalBeds}
          </Typography> */}
        </CardContent>
      </Background>
    </Card>
  );
}

export default StateInfoBox;
