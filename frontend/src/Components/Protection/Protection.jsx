import React, { useContext } from "react";
import { AuthCont } from "../Services/AuthContext";
import { Navigate } from "react-router-dom";

const Protection = (props) => {
  const authC = useContext(AuthCont);

  if (!authC.isLoggedIn) return <Navigate to={"/home"} />;

  return <>{props.children}</>;
};

export default Protection;
