// ActivationPage.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Header from "../frontend_components/Header";
import logo from "../images/logo-petology.png";

const ActivationPage = () => {
  const [activationStatus, setActivationStatus] = useState("Activating...");
  const match = useParams();
  console.log(match);

  useEffect(() => {
    // Get the activation token from the URL params
    const token = match?.token;
    console.log(token);

    // Send a request to your server to activate the email
    axios
      .get(`/api/user/activate/${token}`)
      .then((response) => {
        console.log(response);
        if (response.data === "Activation successful") {
          setActivationStatus("Activation successful");
        } else {
          setActivationStatus("Invalid activation token");
        }
      })
      .catch((error) => {
        console.error("Error activating email:", error);
        setActivationStatus("Error activating email");
      });
  }, [match?.token]);

  return (
    <div>
      <Header />

      <div className="authentication">
        <div className="authentication-form text-center p-3">
          <div className="text-center">
            <img
              src={logo}
              alt="logo"
              width="100px"
              className="text-center d-flex"
              style={{ marginLeft: "35%" }}
            />
          </div>
          <p style={{ fontSize: 25 }}>{activationStatus}</p>

          <Link to="/login" className="text-dark mt-2 text-center d-block">
            CLICK HERE TO LOGIN
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ActivationPage;
