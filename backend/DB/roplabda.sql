-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2023. Dec 13. 01:17
-- Kiszolgáló verziója: 10.4.17-MariaDB
-- PHP verzió: 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `roplabda`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `csapatok`
--

CREATE TABLE `csapatok` (
  `csapat_id` int(11) NOT NULL,
  `csapat_nev` varchar(255) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `varos` varchar(255) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `alapitas_ev` year(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `csapatok`
--

INSERT INTO `csapatok` (`csapat_id`, `csapat_nev`, `varos`, `alapitas_ev`) VALUES
(1, 'Egeri Egerek', 'Eger', 1975),
(2, 'Győri Gyöngyök', 'Győr', 1968),
(3, 'Kaposvári Kenguruk', 'Kaposvár', 1980),
(4, 'Nyíregyházi Nyilak', 'Nyíregyháza', 1971),
(5, 'Soproni Sólymok', 'Sopron', 1983),
(6, 'Bajai Betyárok', 'Baja', 1990),
(7, 'Péceli Pergők', 'Pécel', 1976);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznalok`
--

CREATE TABLE `felhasznalok` (
  `email` varchar(255) COLLATE utf8_hungarian_ci NOT NULL,
  `jelszo` varchar(255) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `felhasznalo_nev` varchar(255) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `nev` varchar(255) COLLATE utf8_hungarian_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `felhasznalok`
--

INSERT INTO `felhasznalok` (`email`, `jelszo`, `felhasznalo_nev`, `nev`) VALUES
('admin@email.com', '$2b$10$W/a3DDYzi3EEs4H9y4c0tOtr/4IqCHws37CZcpY0PeW7omI/RWWlu', 'Admin', 'Admin'),
('admin12@email.com', '$2b$10$.jdY6OB73rgQ9nsblFdSnus17.4hBiXsaVDM2UgWA2PDpMVmLuRVG', 'Admin12', 'Admin12');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `merkozesek`
--

CREATE TABLE `merkozesek` (
  `merkozes_id` int(11) NOT NULL,
  `datum` datetime NOT NULL,
  `csapat1_id` int(11) DEFAULT NULL,
  `csapat2_id` int(11) DEFAULT NULL,
  `helyszin` varchar(255) COLLATE utf8_hungarian_ci NOT NULL,
  `eredmeny` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `merkozesek`
--

INSERT INTO `merkozesek` (`merkozes_id`, `datum`, `csapat1_id`, `csapat2_id`, `helyszin`, `eredmeny`) VALUES
(2, '2023-12-12 00:30:00', 2, 7, 'Baja', 7),
(3, '2023-12-14 03:49:00', 7, 6, 'Pécel', 7),
(4, '2023-12-15 03:54:00', 5, 2, 'Budapest', NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tagok`
--

CREATE TABLE `tagok` (
  `tag_id` int(11) NOT NULL,
  `csapat_id` int(11) DEFAULT NULL,
  `tag_nev` varchar(255) COLLATE utf8_hungarian_ci NOT NULL,
  `szuletesi_datum` datetime NOT NULL,
  `allampolgarsag` varchar(255) COLLATE utf8_hungarian_ci NOT NULL,
  `poszt` varchar(255) COLLATE utf8_hungarian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `tagok`
--

INSERT INTO `tagok` (`tag_id`, `csapat_id`, `tag_nev`, `szuletesi_datum`, `allampolgarsag`, `poszt`) VALUES
(1, 6, 'Nagy Anna', '1995-04-12 00:00:00', 'magyar', 'feladó'),
(2, 1, 'Kis Réka', '1997-08-25 00:00:00', 'magyar', 'átló'),
(3, 3, 'Horváth Petra', '1994-11-30 00:00:00', 'magyar', 'feladó'),
(4, 1, 'Szabó Fanni', '1998-02-15 00:00:00', 'magyar', 'átló'),
(5, NULL, 'Tóth Lilla', '1996-06-20 00:00:00', 'magyar', 'feladó'),
(6, NULL, 'Varga Eszter', '1993-09-10 00:00:00', 'magyar', 'átló'),
(7, NULL, 'Tesztelek', '0000-00-00 00:00:00', 'magyar', 'Liberó'),
(8, 6, 'Tesztelek234', '2013-12-12 00:00:00', 'japán', 'Liberó'),
(11, NULL, 'Kovács Anna', '1995-04-16 00:00:00', 'Magyar', 'átütő'),
(12, 1, 'Nagy Béla', '1987-08-23 00:00:00', 'Magyar', 'liberó'),
(13, 2, 'Szabó Csilla', '1999-01-12 00:00:00', 'Magyar', 'feladó'),
(14, 3, 'Tóth Dávid', '2000-05-30 00:00:00', 'Magyar', 'középső'),
(15, 4, 'Kiss Eszter', '1993-09-17 00:00:00', 'Magyar', 'szélső'),
(16, 5, 'Horváth Fruzsina', '1998-03-08 00:00:00', 'Magyar', 'átütő'),
(17, NULL, 'Varga Gábor', '1994-11-25 00:00:00', 'Magyar', 'liberó'),
(18, 6, 'Balázs Henrietta', '1991-04-06 00:00:00', 'Magyar', 'feladó'),
(19, 7, 'Farkas Ildikó', '2002-02-15 00:00:00', 'Magyar', 'középső'),
(20, 1, 'Papp János', '1989-12-31 00:00:00', 'Magyar', 'szélső'),
(21, 2, 'Balogh Katalin', '1992-10-19 00:00:00', 'Magyar', 'átütő'),
(22, 3, 'Németh László', '1988-07-14 00:00:00', 'Magyar', 'liberó'),
(23, NULL, 'Szűcs Mária', '1996-06-21 00:00:00', 'Magyar', 'feladó'),
(24, 4, 'Takács Norbert', '1985-03-28 00:00:00', 'Magyar', 'középső'),
(25, 5, 'Oláh Péter', '2001-08-09 00:00:00', 'Magyar', 'szélső'),
(26, 6, 'Molnár Rita', '1997-11-11 00:00:00', 'Magyar', 'átütő'),
(27, 7, 'Lakatos Sándor', '1986-01-03 00:00:00', 'Magyar', 'liberó'),
(28, 1, 'Orsós Tamás', '1990-02-20 00:00:00', 'Magyar', 'feladó'),
(29, NULL, 'Kis Viktória', '1993-07-30 00:00:00', 'Magyar', 'középső'),
(30, 2, 'Mészáros Dóra', '1994-10-05 00:00:00', 'Magyar', 'szélső'),
(31, 3, 'Kelemen Alexa', '1994-08-11 00:00:00', 'Japán', 'átütő'),
(32, 4, 'Fehér Balázs', '1986-12-22 00:00:00', 'Magyar', 'liberó'),
(33, 5, 'Pál Csaba', '2001-03-19 00:00:00', 'Japán', 'feladó'),
(34, 6, 'Simon Diána', '1998-07-28 00:00:00', 'Magyar', 'középső'),
(35, 7, 'Kerekes Enikő', '1992-05-16 00:00:00', 'Német', 'szélső'),
(36, 1, 'Bíró Ferenc', '1990-01-27 00:00:00', 'Japán', 'átütő'),
(37, 2, 'Gál Gergő', '1995-02-13 00:00:00', 'Magyar', 'liberó'),
(38, 3, 'Mészáros Hajnalka', '1999-09-09 00:00:00', 'Orosz', 'feladó'),
(39, 4, 'Székely Ibolya', '1993-11-30 00:00:00', 'Német', 'középső'),
(40, 5, 'Kardos József', '1987-06-21 00:00:00', 'Magyar', 'szélső'),
(41, 6, 'Váradi Kamilla', '1996-04-17 00:00:00', 'Német', 'átütő'),
(42, 7, 'Török Lajos', '1988-10-26 00:00:00', 'Magyar', 'liberó'),
(43, 1, 'Vass Márton', '1997-07-07 00:00:00', 'Orosz', 'feladó'),
(44, 2, 'Berkes Nóra', '2000-08-15 00:00:00', 'Német', 'középső'),
(45, 3, 'Antal Péter', '1989-04-04 00:00:00', 'Japán', 'szélső'),
(46, 4, 'Orosz Roland', '1991-12-12 00:00:00', 'Magyar', 'átütő'),
(47, 5, 'Halász Szabolcs', '1994-03-23 00:00:00', 'Magyar', 'liberó'),
(48, 6, 'Barna Tamara', '1985-01-01 00:00:00', 'Orosz', 'feladó'),
(49, 7, 'Major Viktória', '1998-09-18 00:00:00', 'Német', 'középső'),
(50, 1, 'Kovács Zoltán', '1995-06-06 00:00:00', 'Japán', 'szélső');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `csapatok`
--
ALTER TABLE `csapatok`
  ADD PRIMARY KEY (`csapat_id`),
  ADD UNIQUE KEY `csapat_nev` (`csapat_nev`);

--
-- A tábla indexei `felhasznalok`
--
ALTER TABLE `felhasznalok`
  ADD PRIMARY KEY (`email`);

--
-- A tábla indexei `merkozesek`
--
ALTER TABLE `merkozesek`
  ADD PRIMARY KEY (`merkozes_id`),
  ADD KEY `csapat1_id` (`csapat1_id`),
  ADD KEY `csapat2_id` (`csapat2_id`);

--
-- A tábla indexei `tagok`
--
ALTER TABLE `tagok`
  ADD PRIMARY KEY (`tag_id`),
  ADD KEY `csapat_id` (`csapat_id`) USING BTREE;

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `csapatok`
--
ALTER TABLE `csapatok`
  MODIFY `csapat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT a táblához `merkozesek`
--
ALTER TABLE `merkozesek`
  MODIFY `merkozes_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `tagok`
--
ALTER TABLE `tagok`
  MODIFY `tag_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `merkozesek`
--
ALTER TABLE `merkozesek`
  ADD CONSTRAINT `merkozesek_ibfk_1` FOREIGN KEY (`csapat1_id`) REFERENCES `csapatok` (`csapat_id`),
  ADD CONSTRAINT `merkozesek_ibfk_2` FOREIGN KEY (`csapat2_id`) REFERENCES `csapatok` (`csapat_id`);

--
-- Megkötések a táblához `tagok`
--
ALTER TABLE `tagok`
  ADD CONSTRAINT `tagok_ibfk_1` FOREIGN KEY (`csapat_id`) REFERENCES `csapatok` (`csapat_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
