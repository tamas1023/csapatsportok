import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const TeamListing = () => {
  const [teams, setTeams] = useState([]);
  const [legregebbicsapat, setLegregebbicsapat] = useState([]);
  const [csapatnyerekvesztesek, setCsapatnyerekvesztesek] = useState([]);
  async function getTeams() {
    await fetch("http://localhost:1023" + "/home/getCsapatok", {
      method: "GET",
    })
      .then((response) => {
        // Ellenőrizd a választ, hogy biztosítsd, hogy a kérés sikeres volt
        if (!response.ok) {
          throw new Error("Error");
        }
        return response.json(); // Válasz JSON formátumban
      })
      .then((data) => {
        // Feldolgozni és menteni a kapott adatot a state-be
        setTeams(data.result);
        setLegregebbicsapat(data.result2);
        setCsapatnyerekvesztesek(data.result3[0]);
        //console.log(data.result3[0]);
      })
      .catch((error) => {
        // Kezelni a hibát itt, például naplózás vagy felhasználó értesítése
        console.error("Error: ", error);
      });
  }
  //console.log(teams);
  useEffect(() => {
    getTeams();
  }, []);
  return (
    <>
      <br />
      <center>
        <h1 className="text-2xl">Legrégebbi csapat tagjai</h1>
      </center>
      <br />
      <div className=" overflow-x-auto sm:rounded-lg">
        <center>
          <table className="w-1/2 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Tag neve
                </th>
                <th scope="col" className="px-6 py-3">
                  Születési dátuma
                </th>
                <th scope="col" className="px-6 py-3">
                  Állampolgárság
                </th>
                <th scope="col" className="px-6 py-3">
                  Poszt
                </th>
              </tr>
            </thead>
            <tbody>
              {legregebbicsapat &&
                legregebbicsapat.map((item, index) => (
                  //console.log(item.tag_id),
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {item.tag_nev}
                    </th>
                    <td className="px-6 py-4 text-gray-200" placeholder="Város">
                      {new Date(item.szuletesi_datum).toLocaleDateString()}
                    </td>
                    <td
                      className="px-6 py-4 text-gray-200"
                      placeholder="Alapítás éve"
                    >
                      {item.allampolgarsag}
                    </td>
                    <td
                      className="px-6 py-4 text-gray-200"
                      placeholder="Alapítás éve"
                    >
                      {item.poszt}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </center>
      </div>
      <br />
      <center>
        <h1 className="text-2xl">Összes csapat</h1>
      </center>
      <br />
      <div className=" overflow-x-auto sm:rounded-lg">
        <center>
          <table className="w-1/2 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Csapat neve
                </th>
                <th scope="col" className="px-6 py-3">
                  Város
                </th>
                <th scope="col" className="px-6 py-3">
                  Alapítási éve
                </th>
                <th scope="col" className="px-6 py-3">
                  Nyerések/vesztések
                </th>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {teams.map((item, index) => (
                <tr
                  key={item.csapat_id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {item.csapat_nev}
                  </th>
                  <td className="px-6 py-4 text-gray-200">{item.varos}</td>
                  <td className="px-6 py-4 text-gray-200">
                    {item.alapitas_ev}
                  </td>
                  <td className="px-6 py-4 text-gray-200">
                    {csapatnyerekvesztesek[index].Gyozelmek}/
                    {csapatnyerekvesztesek[index].Veresegek}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={"/team/" + item.csapat_id}
                      className="font-medium text-blue-600 dark:text-blue-300 hover:underline pr-4"
                    >
                      További adatok
                    </Link>
                    {/*
                    <Link className="font-medium text-blue-600 dark:text-blue-300 hover:underline">
                      Törlés
                    </Link>
                    */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </center>
      </div>
    </>
  );
};

export default TeamListing;
