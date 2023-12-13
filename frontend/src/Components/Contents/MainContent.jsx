import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../Home/Home";
import Login from "../Auth/Login";
import LoggedPageHolder from "../PageItems/LoggedPageHolder";
import Registration from "../Auth/Registration";
import AuthContext from "../Services/AuthContext";
import NotificationContext from "../Services/NotificationContext";
import Notification from "../Utilities/Notification";
import ToHome from "../404/ToHome";
import Matches from "../Volleyball/Matches";
import OneTeam from "../Volleyball/OneTeam";
import Tagfelvetel from "../Volleyball/Tagfelvetel";
import UjTag from "../Volleyball/UjTag";
import TagokListaja from "../Volleyball/TagokListaja";
import TagModositas from "../Volleyball/TagModositas";
import UjCsapat from "../Volleyball/UjCsapat";
import MerkozesModositas from "../Volleyball/MerkozesModositas";
import UjMerkozesek from "../Volleyball/UjMerkozesek";

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

  /*
  Csapatok kilistázása táblázatos formában.	1 pont 
  !!!kész!!
	Listázza ki táblázatos formában az elkövetkező hét nap mérkőzéseit az aktuális dátumtól számítva.	1 pont
	Listázza ki táblázatos formában az adatbázisban szereplő öt legfiatalabb csapattagot. 
  A listában jelenjen meg a személy csapata is, ahol játszik.	1 pont
	Listázza ki táblázatos formában minden csapat esetén a győzelmek és vereségek számát.	2 pont
	Listázzuk ki táblázatos formában a legrégebben alapított csapat tagjait.	2 pont
	Listázza ki táblázatos formában egy a felhasználó által megadott csapathoz tartozó tagok számát a tagok állampolgársága szerint csoportosítva.	2 pont
  !!!Kész!!!
  */
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
              path="/newTeam"
              element={
                <LoggedPageHolder title={"Új csapat felvételet"}>
                  <UjCsapat />
                </LoggedPageHolder>
              }
            />
            <Route
              path="/team/:id"
              element={
                <LoggedPageHolder title={"Egy csapat"}>
                  <OneTeam />
                </LoggedPageHolder>
              }
            />
            <Route
              path="/tagfelvetel/:id"
              element={
                <LoggedPageHolder title={"Új tagok felvétele a csapatba"}>
                  <Tagfelvetel />
                </LoggedPageHolder>
              }
            />
            <Route
              path="/ujTag"
              element={
                <LoggedPageHolder title={"Új tagok felvétele"}>
                  <UjTag />
                </LoggedPageHolder>
              }
            />
            <Route
              path="/tagok"
              element={
                <LoggedPageHolder title={"Tagok listázása"}>
                  <TagokListaja />
                </LoggedPageHolder>
              }
            />
            <Route
              path="/tagmodositas/:id"
              element={
                <LoggedPageHolder title={"Tagok módosítása"}>
                  <TagModositas />
                </LoggedPageHolder>
              }
            />
            <Route
              path="/matches"
              element={
                <LoggedPageHolder title={"Mérkőzések"}>
                  <Matches />
                </LoggedPageHolder>
              }
            />
            <Route
              path="/newMatch"
              element={
                <LoggedPageHolder title={"Új mérkőzés felvétele"}>
                  <UjMerkozesek />
                </LoggedPageHolder>
              }
            />
            <Route
              path="/merkozesmodositas/:id"
              element={
                <LoggedPageHolder title={"Mérkőzés módosítás"}>
                  <MerkozesModositas />
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
            <Route
              path="/*"
              element={
                <LoggedPageHolder title={"Főoldal"}>
                  <ToHome />
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
