import React from "react";
import "./Table.css";
import numeral from "numeral";

function StatesTable({ states }) {
  return (
    <div className="table">
      {states.map((state) => (
        <tr>
          <td>{state.stateName}</td>
          <td>
            <strong>{numeral(state.actuals.cumulativeConfirmedCases).format("0,0")}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default StatesTable;
