import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../Home/Home";
import LoggedPageHolder from "../PageItems/LoggedPageHolder";

const MainContent = () => {
  return (
    <>
      <Routes>
        <Route
          path="/home"
          element={
            <LoggedPageHolder>
              <Home />
            </LoggedPageHolder>
          }
        />
      </Routes>
    </>
  );
};

export default MainContent;
