import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthCont } from "../Services/AuthContext";
import { NotificationCont } from "../Services/NotificationContext";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function UjMerkozesek(props) {
  const navigate = useNavigate();
  const authC = useContext(AuthCont);
  const { notificationHandler } = useContext(NotificationCont);
  const [content, setContent] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [csapatok, setCsapatok] = useState([]);

  const [merkozes, setMerkozes] = useState({
    helyszin: "",
    datum: "",
    csapat1: 0,
    csapat2: 0,
  });

  const handleCsapat1Change = (event) => {
    const value =
      event.target.value === "" ? "" : parseInt(event.target.value, 10);
    setMerkozes({ ...merkozes, csapat1: value });
    //console.log(merkozes);
  };

  const handleCsapat2Change = (event) => {
    const value =
      event.target.value === "" ? "" : parseInt(event.target.value, 10);
    setMerkozes({ ...merkozes, csapat2: value });
    //console.log(merkozes);
  };

  const egyMerkozesHozzaadas = async () => {
    //console.log(merkozes);
    await fetch("http://localhost:1023" + "/auth/egyMerkozesHozzaadas", {
      method: "POST",
      body: JSON.stringify(merkozes),
      headers: {
        "Content-Type": "application/json", // Megmondjuk a szervernek, hogy JSON adatot küldünk
      },
    })
      .then((res) => {
        //console.log(res.ok);
        if (!res.ok) {
          notificationHandler({
            type: "error",
            message: "HTTP error!",
          });
          return null;
        }
        return res.json();
        //return res.json(); // Válasz JSON formátumban
      })
      .then((data) => {
        if (data.success) {
          notificationHandler({
            type: "success",
            message: data.msg,
          });
          navigate("/home");
        } else {
          notificationHandler({
            type: "error",
            message: data.msg,
          });
        }
      })
      .catch((error) => {
        // Ha bármilyen hiba történt a kérés során
        notificationHandler({
          type: "error",
          message: "Error: " + error,
        });
      });
  };
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
        setCsapatok(data.result);
      })
      .catch((error) => {
        // Kezelni a hibát itt, például naplózás vagy felhasználó értesítése
        console.error("Error: ", error);
      });
  }
  useEffect(() => {
    getTeams();
  }, []);
  const handleChange = (e) => {
    setMerkozes((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const ConfirmModal = ({ onCancel, onConfirm }) => {
    let message;

    if (content === "merkozeshozaadas") {
      message = "Biztos a mérkőzés felvételében?";
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
    <div>
      <div className="bg-white rounded-md shadow-md p-6 w-96 mt-2 m-auto">
        <h1 className="text-2xl font-semibold mb-6 text-black">
          Mérkőzés felvétele
        </h1>
        <div className="grid gap-4">
          <div>
            <p className="text-black">Helyszín</p>
            <input
              type="text"
              name="helyszin"
              className=" text-black"
              placeholder="helyszin"
              value={merkozes.helyszin}
              onChange={handleChange}
            />
          </div>
          <div>
            <p className="text-black">Mérkőzés dátuma</p>
            <input
              type="datetime-local"
              name="datum"
              className=" text-black"
              value={merkozes.datum}
              onChange={handleChange}
            />
          </div>
          <div>
            <p className="text-black">Csapat1</p>

            <select
              name="csapat1"
              id="csapat1"
              value={merkozes.csapat1}
              onChange={handleCsapat1Change}
            >
              <option value="">Válassz csapatot</option>
              {csapatok.map((csapat, index) => (
                <option key={csapat.csapat_id} value={csapat.csapat_id}>
                  {csapat.csapat_nev}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-black">Csapat2</p>

            <select
              name="csapat2"
              id="csapat2"
              value={merkozes.csapat2}
              onChange={handleCsapat2Change}
            >
              <option value="">Válassz csapatot</option>
              {csapatok.map((csapat, index) => (
                <option key={csapat.csapat_id} value={csapat.csapat_id}>
                  {csapat.csapat_nev}
                </option>
              ))}
            </select>
          </div>

          {
            <button
              className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 rounded-md p-2 mt-4 w-full text-white"
              onClick={() => {
                setContent("merkozeshozaadas");
                setShowConfirmModal(true);
              }}
            >
              Mérkőzés felvétel
            </button>
          }
        </div>
      </div>
      {showConfirmModal && (
        <ConfirmModal
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={() => {
            setShowConfirmModal(false);
            if (content === "merkozeshozaadas") {
              //console.log("Modositas");
              egyMerkozesHozzaadas();
              //console.log(merkozes);
            }
          }}
        />
      )}
    </div>
  );
}

export default UjMerkozesek;
