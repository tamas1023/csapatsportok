import React, { useRef } from "react";
import Navbar from "../Navbar/Navbar";

const LoggedPageHolder = (props) => {
  const nav = useRef();
  //console.log(props.beloginoltProp);
  return (
    <div className="flex flex-col">
      <Navbar nav={nav} />
      <main className=" ">{props.children}</main>
    </div>
  );
};

export default LoggedPageHolder;
