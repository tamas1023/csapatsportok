import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { NotificationCont } from "../Services/NotificationContext";

const Tagfelvetel = () => {
  const params = useParams();
  const id = parseInt(params.id);
  const { notificationHandler } = useContext(NotificationCont);
  const [content, setContent] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [tagok, setTagok] = useState([]);
  const [tagid, setTagid] = useState(0);

  const navigate = useNavigate();
  //itt kilesznek listázva a tagok és kattintásra fel lehet a csapathoz venni a tagokat
  async function getTagok() {
    await fetch("http://localhost:1023" + "/auth/getTagokFelvetelhez/", {
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
        setTagok(data.result);
      })
      .catch((error) => {
        // Kezelni a hibát itt, például naplózás vagy felhasználó értesítése
        console.error("Error: ", error);
      });
  }
  //console.log(team);
  useEffect(() => {
    getTagok();
  }, []);
  async function csapatHozzaadas(tagid) {
    await fetch(
      "http://localhost:1023" + "/auth/csapatTagHozzaadas/" + tagid + "/" + id,
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
          navigate("/team/" + id);
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

    if (content === "tagfelvetel") {
      message = "Biztos vagy hogy ezt a tagot be akarod venni a csapatba?";
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
            {tagok &&
              tagok.map((item, index) => (
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
                        setTagid(item.tag_id);
                        setContent("tagfelvetel");
                        setShowConfirmModal(true);
                      }}
                    >
                      Felvétel
                    </Link>
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
            if (content === "tagfelvetel") {
              //console.log("Torles");
              csapatHozzaadas(tagid);
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

export default Tagfelvetel;
