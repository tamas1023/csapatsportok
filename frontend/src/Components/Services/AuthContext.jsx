import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();
export const AuthCont = createContext();

const AuthContext = (props) => {
  /*{props.children;}*/
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const registration = () => {
    //itt nincs regisztráció de ha lenne ide jönne
  };
  //TODO

  const authCheck = async () => {
    //itt nincs auth ellenőrzés de ha lenne ide jönne
    const cookieData = cookies.get("BejelentezesAdatok");
    if (cookieData && cookieData.username) {
      await login(cookieData.username);
    }
  };

  const login = async (username) => {
    /* 
    const loginData = {
      username: username,
      // ...any other data you want to store
    }; 
    
    cookies.set("BejelentezesAdatok", JSON.stringify(loginData), { path: "/" });
    */
    setIsLoggedIn(true);
    setUser(username);
    //navigate("/home");
  };
  const logout = async () => {
    setIsLoggedIn(false);
    setUser(null);
    cookies.remove("BejelentezesAdatok", { path: "/" });
    //console.log("Elvileg cookie torles");
  };

  useEffect(() => {
    authCheck();
  }, []);

  return (
    <AuthCont.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        user,
        setUser,
      }}
    >
      {props.children}
    </AuthCont.Provider>
  );
};

export default AuthContext;
