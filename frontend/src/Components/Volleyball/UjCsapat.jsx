import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthCont } from "../Services/AuthContext";
import { NotificationCont } from "../Services/NotificationContext";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function UjCsapat(props) {
  const navigate = useNavigate();
  const authC = useContext(AuthCont);
  const { notificationHandler } = useContext(NotificationCont);
  const [content, setContent] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [csapat, SetCsapat] = useState({
    csapat_nev: "",
    varos: "",
    alapitasi_ev: 1900,
  });

  const inputs = [
    {
      név: "Csapat neve",
      name: "csapat_nev",
      placeholder: "Csapat név",
      type: "text",
    },
    {
      név: "Alapítási év",
      name: "alapitasi_ev",
      placeholder: "A csapat alapítási éve",
      type: "number",
    },
    {
      név: "Város",
      name: "varos",
      placeholder: "A csapat városa",
      type: "text",
    },
  ];
  const csapatHozzaadas = async () => {
    await fetch("http://localhost:1023" + "/auth/UjCsapat", {
      method: "POST",
      body: JSON.stringify(csapat),
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

  const handleChange = (e) => {
    SetCsapat((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const ConfirmModal = ({ onCancel, onConfirm }) => {
    let message;
    if (content === "csapatfelvetel") {
      message = "Biztosan létre akarod hozni ezt a csapatot?";
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
          Új csapat hozzáadás
        </h1>
        <div className="grid gap-4">
          {inputs.map((input) => (
            <div className="" key={input.name}>
              {input.name === "Description" ? (
                <div>
                  <p className="text-black">{input.név}</p>
                  <textarea
                    name={input.name}
                    className="resize-y leading-6 text-black"
                    placeholder={input.placeholder}
                    onChange={handleChange}
                  ></textarea>
                </div>
              ) : (
                <div>
                  <p className="text-black">{input.név}</p>
                  <input
                    type={input.type}
                    name={input.name}
                    className=" text-black"
                    placeholder={input.placeholder}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
          ))}
          {
            <button
              className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 rounded-md p-2 mt-4 w-full text-white"
              onClick={() => {
                setContent("csapatfelvetel");
                setShowConfirmModal(true);
              }}
            >
              Csapat hozzáadása
            </button>
          }
        </div>
      </div>
      {showConfirmModal && (
        <ConfirmModal
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={() => {
            setShowConfirmModal(false);
            if (content === "csapatfelvetel") {
              csapatHozzaadas();
            }
          }}
        />
      )}
    </div>
  );
}

export default UjCsapat;
