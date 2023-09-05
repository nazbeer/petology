import React, { useState, useEffect } from "react";
//import firebase from "firebase";
import { Form, Button } from "react-bootstrap";
import { initializeApp } from "firebase/app";

import { getAuth, signInWithCredential, PhoneAuthProvider } from "firebase/auth";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDhFsZtrsRSgLM4GF1LduR1Yfs1hXlPukQ",

    authDomain: "petologynz-25790.firebaseapp.com",
  
    projectId: "petologynz-25790",
  
    storageBucket: "petologynz-25790.appspot.com",
  
    messagingSenderId: "152277664095",
  
    appId: "1:152277664095:web:582c1724f211d3a03cb6ea",
  
    measurementId: "G-44RPHTQTGZ"
  
};
const app = initializeApp(firebaseConfig);


// Create the form component
const SignIn = () => {
  // State variables
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");




  // Effect to verify the OTP
  useEffect(() => {
    if (otp && phoneNumber) {
        const auth = getAuth(app);
        signInWithCredential(auth, PhoneAuthProvider.credential(phoneNumber, otp))        
        .then(() => {
          setError("");
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }, [phoneNumber, otp]);

  // Handle the phone number change event
  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  // Handle the OTP change event
  const handleOtpChange = (event) => {
    setOtp(event.target.value);
  };

  // Submit the form
  const handleSubmit = (event) => {
    event.preventDefault();

    // Send the OTP verification code
    const phoneAuthProvider = new PhoneAuthProvider();

    phoneAuthProvider
      .verifyPhoneNumber(phoneNumber, {
        forceResendingToken: "",
        timeout: 60000,
        verificationCodeLength: 6,
      })
      .then((credential) => {
        setError("");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="phoneNumber">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control type="tel" value={phoneNumber} onChange={handlePhoneNumberChange} />
      </Form.Group>
      <Form.Group controlId="otp">
        <Form.Label>OTP</Form.Label>
        <Form.Control type="text" value={otp} onChange={handleOtpChange} />
      </Form.Group>
      <Button type="submit">Login</Button>
    </Form>
  );
};

export default SignIn;