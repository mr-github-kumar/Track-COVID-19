import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";
import styled from "@emotion/styled/macro";
import { makeStyles } from "@material-ui/core/styles";

function InfoBox({ title, color, cases, total, active, isRed, ...props }) {
  
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
    <Card className="card" onClick={props.onClick} >
      <Background>
        <CardContent classes={{ root: info.root, }}>
          <div className="card-header">
            <Typography color="textPrimary" gutterBottom>
              {title}
            </Typography>
          </div>
          <div>
            <h1
              className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}
            >
              {cases}
            </h1>

            <Typography className="infoBox__total" color="textSecondary">
              Toatl: {total}
            </Typography>
          </div>
        </CardContent>
      </Background>
    </Card>
  );
}

export default InfoBox;
