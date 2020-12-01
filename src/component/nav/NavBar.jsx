import React from "react";
import styled from "styled-components";
/* import Burger from "./BurgerMenu"; */

const Nav = styled.nav`
  ${"" /* position: fixed; */}
  ${"" /*  width: 100%; */}
  height:100%;
  border-bottom: 2px solid #f1f1f1;
  padding: 0 20px;
  background: linear-gradient(#48c6ef, #6f86d6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;

  h1 {
    text-align: center;
  }

  .navbar__logo {
    display: flex;
    justify-content:center;
    align-items:center;
    padding: 1rem;
  }

  h3 {
    padding-left: 10px;
  }
`;

const NavBar = () => {
  return (
    <Nav>
      <div className="navbar__logo">
        <h1>COVID-19</h1>
        <h3>Live</h3>
      </div>
      {/* <Burger /> */}
    </Nav>
  );
};

export default NavBar;
