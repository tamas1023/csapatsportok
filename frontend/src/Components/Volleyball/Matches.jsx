import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { NotificationCont } from "../Services/NotificationContext";
import { AuthCont } from "../Services/AuthContext";

const Matches = () => {
  const { notificationHandler } = useContext(NotificationCont);
  const authC = useContext(AuthCont);
  const [content, setContent] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [merkozesek, setMerkozesek] = useState([]);
  const [hetnapMerkozesek, setHetnapMerkozesekk] = useState([]);
  const [merkozesid, setMerkozesid] = useState(-1);
  const [csapatok, setCsapatok] = useState([]);
  const navigate = useNavigate();

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
        //console.log(data.result);
        setCsapatok(data.result);
      })
      .catch((error) => {
        // Kezelni a hibát itt, például naplózás vagy felhasználó értesítése
        console.error("Error: ", error);
      });
  }
  async function getMerkozesek() {
    await fetch("http://localhost:1023" + "/home/getMerkozesek/", {
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
        //console.log(data.result);
        setMerkozesek(data.result);
      })
      .catch((error) => {
        // Kezelni a hibát itt, például naplózás vagy felhasználó értesítése
        console.error("Error: ", error);
      });
  }
  async function getHetnapMerkozesek() {
    await fetch("http://localhost:1023" + "/home/getHetnapMerkozesek/", {
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
        //console.log(data.result);
        setHetnapMerkozesekk(data.result);
      })
      .catch((error) => {
        // Kezelni a hibát itt, például naplózás vagy felhasználó értesítése
        console.error("Error: ", error);
      });
  }
  //console.log(team);
  useEffect(() => {
    getMerkozesek();
    getHetnapMerkozesek();
    getTeams();
  }, []);
  const merkozesTorles = async () => {
    await fetch(
      "http://localhost:1023" + "/auth/merkozesTorles/" + merkozesid,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        // Ellenőrizd a következő változtatás, hogy biztosítsd, hogy a kérés sikeres volt
        if (!response.ok) {
          notificationHandler({
            type: "error",
            message: "HTTP error!",
          });
          return null;
        }
        return response.json(); // Válasz JSON formátumban
      })
      .then((data) => {
        if (data.success) {
          notificationHandler({
            type: "success",
            message: data.msg,
          });
          //getTeam();
          navigate("/home");
        }
      })
      .catch((error) => {
        // Kezelni a hibát itt, kéldául naplózás vagy felhasználó értesítése
        console.error("Error: ", error);
      });
  };
  const ConfirmModal = ({ onCancel, onConfirm }) => {
    let message;

    if (content === "merkozestorles") {
      message = "Biztos vagy hogy ezt a mérkőzést törölni akarod?";
    } else if (content === "csapattorles") {
      message = "Biztosan ki akarod törölni a csapatot?";
    } else if (content === "csapatmodositas") {
      message = "Biztosan szeretéd módosítani a csapatot?";
    }

    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-4 rounded-md text-black">
          <p>{message}</p>
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 mr-2 bg-red-500 text-white rounded-md transition-colors duration-300 ease-in-out hover:bg-red-700"
              onClick={onCancel}
            >
              Mégsem
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md transition-colors duration-300 ease-in-out hover:bg-blue-700"
              onClick={onConfirm}
            >
              Igen
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <center>
        <h1 className="text-2xl">Elkövetkező hét nap mérkőzései</h1>
      </center>
      <br />
      <center className="overflow-x-auto">
        <table className="w-1/2 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
            <tr>
              <th scope="col" className="px-6 py-3">
                Mérkőzés helye
              </th>
              <th scope="col" className="px-6 py-3">
                Mérkőzés dátuma
              </th>
              <th scope="col" className="px-6 py-3">
                CSapat 1 neve
              </th>
              <th scope="col" className="px-6 py-3">
                Csapat 2 neve
              </th>
              <th scope="col" className="px-6 py-3">
                Eredmény
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {hetnapMerkozesek &&
              hetnapMerkozesek.map((item, index) => (
                //console.log(item.merkozes_id),
                <tr
                  key={item.merkozes_id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {item.helyszin}
                  </th>
                  <td
                    className="px-6 py-4 text-gray-200"
                    placeholder="Mérkőzés dátuma"
                  >
                    {new Date(item.datum)
                      .toISOString()
                      .slice(0, 16)
                      .replace("T", " ")}
                  </td>
                  <td
                    className="px-6 py-4 text-gray-200"
                    placeholder="Alapítás éve"
                  >
                    {item.csapat1_nev}
                  </td>
                  <td
                    className="px-6 py-4 text-gray-200"
                    placeholder="Alapítás éve"
                  >
                    {item.csapat2_nev}
                  </td>
                  <td
                    className="px-6 py-4 text-gray-200"
                    placeholder="Alapítás éve"
                  >
                    {csapatok[item.eredmeny - 1]?.csapat_nev}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {authC.isLoggedIn && (
                      <>
                        <Link
                          to={"/merkozesmodositas/" + item.merkozes_id}
                          className="font-medium text-blue-600 dark:text-blue-300 hover:underline pr-4"
                        >
                          Módosítás
                        </Link>
                        <Link
                          className="font-medium text-blue-600 dark:text-blue-300 hover:underline"
                          onClick={() => {
                            setMerkozesid(item.merkozes_id);
                            setContent("merkozestorles");
                            setShowConfirmModal(true);
                          }}
                        >
                          Törlés
                        </Link>
                      </>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </center>
      <br />
      <center>
        <h1 className="text-2xl">Összes mérkőzés</h1>
      </center>
      <br />
      <center className="overflow-x-auto">
        <table className="w-1/2 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
            <tr>
              <th scope="col" className="px-6 py-3">
                Mérkőzés helye
              </th>
              <th scope="col" className="px-6 py-3">
                Mérkőzés dátuma
              </th>
              <th scope="col" className="px-6 py-3">
                CSapat 1 neve
              </th>
              <th scope="col" className="px-6 py-3">
                Csapat 2 neve
              </th>
              <th scope="col" className="px-6 py-3">
                Eredmény
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {merkozesek &&
              merkozesek.map((item, index) => (
                //console.log(item.merkozes_id),
                <tr
                  key={item.merkozes_id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {item.helyszin}
                  </th>
                  <td
                    className="px-6 py-4 text-gray-200"
                    placeholder="Mérkőzés dátuma"
                  >
                    {new Date(item.datum)
                      .toISOString()
                      .slice(0, 16)
                      .replace("T", " ")}
                  </td>
                  <td
                    className="px-6 py-4 text-gray-200"
                    placeholder="Alapítás éve"
                  >
                    {item.csapat1_nev}
                  </td>
                  <td
                    className="px-6 py-4 text-gray-200"
                    placeholder="Alapítás éve"
                  >
                    {item.csapat2_nev}
                  </td>
                  <td
                    className="px-6 py-4 text-gray-200"
                    placeholder="Alapítás éve"
                  >
                    {csapatok[item.eredmeny - 1]?.csapat_nev}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {authC.isLoggedIn && (
                      <>
                        <Link
                          to={"/merkozesmodositas/" + item.merkozes_id}
                          className="font-medium text-blue-600 dark:text-blue-300 hover:underline pr-4"
                        >
                          Módosítás
                        </Link>
                        <Link
                          className="font-medium text-blue-600 dark:text-blue-300 hover:underline"
                          onClick={() => {
                            setMerkozesid(item.merkozes_id);
                            setContent("merkozestorles");
                            setShowConfirmModal(true);
                          }}
                        >
                          Törlés
                        </Link>
                      </>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </center>
      {showConfirmModal && (
        <ConfirmModal
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={() => {
            setShowConfirmModal(false);
            if (content === "merkozestorles") {
              //console.log("Torles");
              merkozesTorles();
            } else if (content === "csapattorles") {
              //console.log("Csapat törlés");
              //csapatTorles();
            } else if (content === "csapatmodositas") {
              //console.log("Csapat módosítás");
              //changeCsapat();
            }
          }}
        />
      )}
    </>
  );
};

export default Matches;
