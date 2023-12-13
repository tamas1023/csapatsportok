import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthCont } from "../Services/AuthContext";
import { NotificationCont } from "../Services/NotificationContext";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function MerkozesModositas(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const authC = useContext(AuthCont);
  const { notificationHandler } = useContext(NotificationCont);
  const [content, setContent] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [csapatok, setCsapatok] = useState([]);

  // Eseménykezelők a lenyíló listákhoz

  const [merkozesek, setMerkozesek] = useState({
    helyszin: "",
    datum: "2020-01-01-00:00",
    csapat1: 0,
    csapat2: 0,
    eredmeny: 0,
  });

  const handleCsapat1Change = (event) => {
    const value =
      event.target.value === "" ? "" : parseInt(event.target.value, 10);
    setMerkozesek({ ...merkozesek, csapat1: value });
    //console.log(merkozesek);
  };

  const handleCsapat2Change = (event) => {
    const value =
      event.target.value === "" ? "" : parseInt(event.target.value, 10);
    setMerkozesek({ ...merkozesek, csapat2: value });
    //console.log(merkozesek);
  };
  const handleEredmenyChange = (event) => {
    setMerkozesek({
      ...merkozesek,
      eredmeny: parseInt(event.target.value, 10),
    });
  };
  const getEgyMerkozesAdat = async () => {
    await fetch("http://localhost:1023" + "/auth/getEgyMerkozes/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Megmondjuk a szervernek, hogy JSON adatot lépjen be
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
          //console.log(data.result[0]);
          const datum = new Date(data.result[0].datum)
            .toISOString()
            .slice(0, 16);
          setMerkozesek({
            helyszin: data.result[0].helyszin,
            datum: datum,
            csapat1: data.result[0].csapat1_id,
            csapat2: data.result[0].csapat2_id,
            eredmeny: data.result[0].eredmeny,
          });
        } else {
          notificationHandler({
            type: "error",
            message: data.msg,
          });
        }
      });
  };
  const egyMerkozesModositas = async () => {
    //console.log(merkozesek);
    await fetch("http://localhost:1023" + "/auth/egyMerkozesModositas/" + id, {
      method: "POST",
      body: JSON.stringify(merkozesek),
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
    getEgyMerkozesAdat();
    getTeams();
  }, []);
  const handleChange = (e) => {
    setMerkozesek((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const ConfirmModal = ({ onCancel, onConfirm }) => {
    let message;

    if (content === "merkozesmodositas") {
      message = "Biztos a mérkőzések módosításában?";
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
          Mérkőzés módosítása
        </h1>
        <div className="grid gap-4">
          <div>
            <p className="text-black">Helyszín</p>
            <input
              type="text"
              name="helyszin"
              className=" text-black"
              placeholder="helyszin"
              value={merkozesek.helyszin}
              onChange={handleChange}
            />
          </div>
          <div>
            <p className="text-black">Mérkőzés dátuma</p>
            <input
              type="datetime-local"
              name="datum"
              className=" text-black"
              value={merkozesek.datum}
              onChange={handleChange}
            />
          </div>
          <div>
            <p className="text-black">Csapat1</p>

            <select
              name="csapat1"
              id="csapat1"
              value={merkozesek.csapat1}
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
              value={merkozesek.csapat2}
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
          <div>
            <p className="text-black">Nyertes</p>

            <select
              name="nyertes"
              id="nyertes"
              value={merkozesek.eredmeny == null ? "" : merkozesek.eredmeny}
              onChange={handleEredmenyChange}
            >
              <option value="">Válassz nyertest</option>
              {merkozesek.csapat1 && (
                <option value={merkozesek.csapat1}>
                  {
                    csapatok.find((c) => c.csapat_id === merkozesek.csapat1)
                      ?.csapat_nev
                  }
                </option>
              )}
              {merkozesek.csapat2 && (
                <option value={merkozesek.csapat2}>
                  {
                    csapatok.find((c) => c.csapat_id === merkozesek.csapat2)
                      ?.csapat_nev
                  }
                </option>
              )}
            </select>
          </div>
          {
            <button
              className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 rounded-md p-2 mt-4 w-full text-white"
              onClick={() => {
                setContent("merkozesmodositas");
                setShowConfirmModal(true);
              }}
            >
              Mérkőzés módosítás
            </button>
          }
        </div>
      </div>
      {showConfirmModal && (
        <ConfirmModal
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={() => {
            setShowConfirmModal(false);
            if (content === "merkozesmodositas") {
              //console.log("Modositas");
              egyMerkozesModositas();
              //console.log(merkozesek);
            }
          }}
        />
      )}
    </div>
  );
}

export default MerkozesModositas;
