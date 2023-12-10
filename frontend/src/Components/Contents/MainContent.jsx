import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../Home/Home";
import Login from "../Auth/Login";
import LoggedPageHolder from "../PageItems/LoggedPageHolder";
import Registration from "../Auth/Registration";
import AuthContext from "../Services/AuthContext";
import NotificationContext from "../Services/NotificationContext";
import Notification from "../Utilities/Notification";

const MainContent = () => {
  //Bejelentkezés és regisztráció
  //Csapatok listázása
  //új csapat felvétele
  //ha csapatra rákapcsolunk ott tudunk a tagokat módosítani
  //mérkőzések listázása
  //az állást így tárolom: "123:321" és itt a nagyobbik számú nyer
  //ha rákapcsolunk 1 mérkőzésre, akkor azt módosítani és törölni is tudjuk
  //minimum 50 rekord
  //Legalább két olyan lekérdezés legyen, amelyben legalább két táblát kell összekapcsolni és van benne csoportosítás és összesítés.
  //1. Csapat listázásnál a win és loose ok száma
  //2. ugyan ez csak az adott személyre is működjön
  //ez lehet hogy al lekérdezés is szükséges lesz
  //Legalább egy lekérdezésben allekérdezés szerepeljen.
  return (
    <>
      <AuthContext>
        <NotificationContext>
          <Notification />
          <Routes>
            <Route
              path="/home"
              element={
                <LoggedPageHolder title={"Főoldal"}>
                  <Home />
                </LoggedPageHolder>
              }
            />

            <Route
              path="/login"
              element={
                <LoggedPageHolder title={"Bejelentkezés"}>
                  <Login />
                </LoggedPageHolder>
              }
            />
            <Route
              path="/registration"
              element={
                <LoggedPageHolder title={"Regisztráció"}>
                  <Registration />
                </LoggedPageHolder>
              }
            />
          </Routes>
        </NotificationContext>
      </AuthContext>
    </>
  );
};

export default MainContent;
