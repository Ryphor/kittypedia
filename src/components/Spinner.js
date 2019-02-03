import React from "react";
import "./Spinner.css";

const spinner = props => {
  return (
    <>
      <div className="loader">
        <i className="fas fa-cat" />
      </div>
      <h3 className="loadingText">Kitty is fetching data</h3>
    </>
  );
};

export default spinner;
