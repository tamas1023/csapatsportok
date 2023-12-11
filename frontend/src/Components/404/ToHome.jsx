import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ToHome = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/home");
  }, []);
};

export default ToHome;
