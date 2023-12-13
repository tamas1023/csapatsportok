import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { NotificationCont } from "../Services/NotificationContext";
const OneTeam = () => {
  const params = useParams();
  const id = parseInt(params.id);
  const navigate = useNavigate();
  //console.log(id);
  const [team, setTeam] = useState([]);
  const csapat_nev = useRef();
  const varos = useRef();
  const alapitas_ev = useRef();
  //const [isModalOpen, setModalOpen] = useState(false);
  const { notificationHandler } = useContext(NotificationCont);
  const [content, setContent] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [kivalasztottTag, setKivalasztottTag] = useState(0);
  const [allampolgarsagok, setAllampolgarsagok] = useState([]);

  async function getTeam() {
    await fetch("http://localhost:1023" + "/home/getEgyCsapatTagokkal/" + id, {
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
        setTeam(data.result);
      })
      .catch((error) => {
        // Kezelni a hibát itt, például naplózás vagy felhasználó értesítése
        console.error("Error: ", error);
      });
  }
  async function getEgyCsapatTagokSzamaAllampolgarsagSzerint() {
    await fetch(
      "http://localhost:1023" +
        "/auth/getEgyCsapatTagokSzamaAllampolgarsagSzerint/" +
        id,
      {
        method: "GET",
      }
    )
      .then((response) => {
        // Ellenőrizd a választ, hogy biztosítsd, hogy a kérés sikeres volt
        if (!response.ok) {
          throw new Error("Error");
        }
        return response.json(); // Válasz JSON formátumban
      })
      .then((data) => {
        // Feldolgozni és menteni a kapott adatot a state-be
        setAllampolgarsagok(data.result);
        //console.log(data.result);
      })
      .catch((error) => {
        // Kezelni a hibát itt, például naplózás vagy felhasználó értesítése
        console.error("Error: ", error);
      });
  }
  //console.log(team);
  useEffect(() => {
    getTeam();
    getEgyCsapatTagokSzamaAllampolgarsagSzerint();
  }, []);
  async function tagKitolres() {
    await fetch(
      "http://localhost:1023" + "/auth/tagCsapatKilepes/" + kivalasztottTag,
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
          getTeam();
        }
      })
      .catch((error) => {
        notificationHandler({
          type: "error",
          message: "Error: " + error,
        });
      });
  }
  async function changeCsapat() {
    const newTeam = {
      csapat_nev: csapat_nev.current.value,
      varos: varos.current.value,
      alapitas_ev: alapitas_ev.current.value,
    };
    await fetch("http://localhost:1023" + "/auth/csapatModositas/" + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTeam),
    })
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
          getTeam();
        }
      })
      .catch((error) => {
        notificationHandler({
          type: "error",
          message: "Error: " + error,
        });
      });
  }
  async function csapatTorles() {
    await fetch("http://localhost:1023" + "/auth/csapatTorles/" + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
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
          navigate("/home");
          //getTeam();
        }
      })
      .catch((error) => {
        notificationHandler({
          type: "error",
          message: "Error: " + error,
        });
      });
  }
  const ConfirmModal = ({ onCancel, onConfirm }) => {
    let message;

    if (content === "tagtorles") {
      message = "Biztos vagy hogy ki akarod törölni a tagot a csapatból?";
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
      <div className=" overflow-x-auto sm:rounded-lg">
        <div className="bg-white rounded-md shadow-md p-6 w-96 mt-2 m-auto">
          <center className="grid gap-4">
            <input
              type="text"
              defaultValue={team.csapat_nev}
              ref={csapat_nev}
            ></input>
            <input
              type="text"
              defaultValue={team.varos}
              ref={varos}
              className="px-6 py-4 "
            ></input>
            <input
              type="number"
              defaultValue={team.alapitas_ev}
              ref={alapitas_ev}
              className="px-6 py-4 "
            ></input>

            <Link
              className="font-medium text-blue-600 dark:text-blue-600 hover:underline pr-4"
              onClick={() => {
                setContent("csapatmodositas");
                setShowConfirmModal(true);
              }}
            >
              Módosítás
            </Link>
            <Link
              className="font-medium text-blue-600 dark:text-blue-600 hover:underline pr-4"
              onClick={() => {
                setContent("csapattorles");
                setShowConfirmModal(true);
              }}
            >
              Törlés
            </Link>
          </center>
        </div>
        <br />
        <center>
          <Link
            to={"/tagfelvetel/" + id}
            className="font-medium text-blue-600 dark:text-blue-600 hover:underline pr-4"
          >
            Új tag felvétele
          </Link>
        </center>
        <br />
        <center>
          <table className="w-1/3 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Állampolgárság
                </th>
                <th scope="col" className="px-6 py-3">
                  Darab
                </th>
              </tr>
            </thead>
            <tbody>
              {allampolgarsagok &&
                allampolgarsagok.map((item, index) => (
                  <tr
                    key={item.allampolgarsag}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {item.allampolgarsag}
                    </th>
                    <td className="px-6 py-4 text-gray-200" placeholder="Város">
                      {item.tagok_szama}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </center>
        <br />
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
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {team.tagok &&
                team.tagok.map((item, index) => (
                  //console.log(item.tag_id),
                  <tr
                    key={item.tag_id}
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
                    <td className="px-6 py-4 text-right">
                      <Link
                        className="font-medium text-blue-600 dark:text-blue-300 hover:underline"
                        onClick={() => {
                          setContent("tagtorles");
                          setShowConfirmModal(true);
                          setKivalasztottTag(item.tag_id);
                        }}
                      >
                        Törlés
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </center>
      </div>
      {showConfirmModal && (
        <ConfirmModal
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={() => {
            setShowConfirmModal(false);
            if (content === "tagtorles") {
              //console.log("Torles");
              tagKitolres();
            } else if (content === "csapattorles") {
              //console.log("Csapat törlés");
              csapatTorles();
            } else if (content === "csapatmodositas") {
              //console.log("Csapat módosítás");
              changeCsapat();
            }
          }}
        />
      )}
    </>
  );
};

export default OneTeam;
