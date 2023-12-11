-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2023. Dec 11. 12:11
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
(6, 'Bajai Betyárok', 'Baja', 1990);

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
  `eredmeny` varchar(255) COLLATE utf8_hungarian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

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
(6, NULL, 'Varga Eszter', '1993-09-10 00:00:00', 'magyar', 'átló');

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
  MODIFY `csapat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `merkozesek`
--
ALTER TABLE `merkozesek`
  MODIFY `merkozes_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `tagok`
--
ALTER TABLE `tagok`
  MODIFY `tag_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
