import React, { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import firebase from "firebase";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "../firebase.config";
import jwt_decode from "jwt-decode";

// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import { useDispatch } from "react-redux";

const MobLogin = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function onCaptchVerify() {
    let verify = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
      size: "invisible",
      callback: (response) => {
        // cb
      },
    });

    return verify;
  }

  function onSignup() {
    setLoading(true);
    const appVerifier = onCaptchVerify();

    // const appVerifier = window.recaptchaVerifier;

    const formatPh = "+" + ph;

    auth
      .signInWithPhoneNumber(formatPh, appVerifier)
      .then((confirmationResult) => {
        console.log(confirmationResult);
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sent successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  const onFinish = async () => {
    console.log("+" + ph);
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/user/get-login-mobile", {
        identifier: "+" + ph,
      });
      console.log(response.data); // Check the response for debugging purposes
      dispatch(hideLoading());

      if (response.data.success) {
        // toast.success(response.data.message);
        localStorage.setItem("token", response.data.data);

        const decodedToken = jwt_decode(response.data.data);
        const userId = decodedToken.id;
        localStorage.setItem("userId", userId);
        if (decodedToken) {
          if (decodedToken.isDoctor) {
            navigate("/doctor");
          } else if (decodedToken.isNurse) {
            navigate("/reception");
          } else if (decodedToken.isGroomer) {
            navigate("/groomer");
          } else if (decodedToken.isAdmin) {
            navigate("/admin");
          } else {
            navigate("/user");
          }
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(JSON.stringify(error));
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  // function onOTPVerify() {
  //   setLoading(true);
  //   window.confirmationResult
  //     .confirm(otp)
  //     .then(async (res) => {
  //       console.log(res);
  //       setUser(res.user);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setLoading(false);
  //     });
  // }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
        onFinish();

        // Redirect based on user type using navigate
        // if (res.user) {
        //   if (res.user.isDoctor) {
        //     navigate("/doctor");
        //   } else if (res.user.isNurse) {
        //     navigate("/reception");
        //   } else if (res.user.isGroomer) {
        //     navigate("/groomer");
        //   } else if (res.user.isAdmin) {
        //     navigate("/admin");
        //   } else {
        //     navigate("/user");
        //   }
        // }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  return (
    <section className="flex items-center justify-center h-screen">
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />

        {user ? (
          // Check the type of user and navigate accordingly
          user.isDoctor ? (
            navigate("/doctor")
          ) : user.isNurse ? (
            navigate("/nurse")
          ) : user.isGroomer ? (
            navigate("/groomer")
          ) : user.isAdmin ? (
            navigate("/admin")
          ) : (
            navigate("/user")
          )
        ) : (
          <div className="w-80 flex flex-col gap-4 rounded-lg p-4">
            {showOTP ? (
              <>
                <label htmlFor="otp" className="font-bold text-xl  text-center">
                  Enter your OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="opt-container"
                />
                <button
                  onClick={onOTPVerify}
                  className="btn btn-success mt-3 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Verify OTP</span>
                </button>
                <Link to="/otp-login" className="text-dark mt-2 text-center">
                  Back to OTP Login
                </Link>
              </>
            ) : (
              <>
                <label
                  htmlFor=""
                  className="font-bold text-xl text-center mb-3 d-block"
                >
                  Enter Mobile Number
                </label>
                <PhoneInput
                  onlyCountries={["ae"]}
                  defaultCountry={"ae"}
                  country={"ae"}
                  value={ph}
                  onChange={setPh}
                  inputClass="text-left w-100"
                />
                <div id="recaptcha-container"></div>

                <div className="text-center d-grid">
                  <button
                    onClick={onSignup}
                    className="btn btn-success d-block text-center mt-3 w-full py-2.5 text-white rounded"
                  >
                    {loading && (
                      <CgSpinner size={20} className="mt-1 animate-spin" />
                    )}
                    <span className="d-block text-center">
                      Send code via SMS
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default MobLogin;
