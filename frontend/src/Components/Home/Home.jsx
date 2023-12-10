import React, { useContext } from "react";
import TeamListing from "../Volleyball/TeamListing";
import { AuthCont } from "../Services/AuthContext";
import { NotificationCont } from "../Services/NotificationContext";

const Home = () => {
  const authC = useContext(AuthCont);
  const { notificationHandler } = useContext(NotificationCont);
  //console.log(authC.user);
  //console.log(authC.isLoggedIn);
  return <TeamListing />;
};

export default Home;
