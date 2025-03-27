"use client"; // Required for Next.js App Router
import { useState } from "react";
import {auth } from "../firebase/config";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import {useRouter } from "next/navigation";


export default function Signup() {
  const [formData, setFormData] = useState({ 
    firstName: "", 
    lastName: "", 
    email: "", 
    password: "",
    phoneNumber: ""
  });
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const router = useRouter();


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value});
  };

  //To Handle OTP verification
  const handleOTPVerify = async (e) => {
    e.preventDefault();
    try {
      const result = await confirmationResult.confirm(otp);
      console.log("Phone verified:", result.user);
      handleSubmit(e, result.user.phoneNumber);
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    }
  };

   const sendOTP = asyn (e) => {
    e.preventDefault();
    const {phoneNumber } = formData;

    try {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });

      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
    } catch(err) {
      setError(" Failed to send OTP. Check your phone number.");
    }
   };

  const handleSubmit = async (e, phoneVerified = null) => {
    e.preventDefault();
    const { firstName, lastName, email, password, phoneNumber} = formData;

    if(!phoneVerified){
      sendOTP(e);
      return;
    }

    //lincoln email validation
    if(!email.endsWith("@lincoln.edu")) {
      setError("Only Lincoln University email addresses are allowed.");
      return;
    }

    try {
      // user created with firebase

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);

      // get firebase token

      const idToken = await userCredential.user.getIdToken();

      //to determine userType

       const userType = window.location.pathname.includes("/driver/signup") ? "DRIVER": "RIDER";

      // to send user data to backend
      const response = await fetch("/api/v1/users/register", {
        method: Post,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, phoneNumber, userType }),
      });

      if(!response.ok) throw new Error("Failed to register");

      //Redirect to login or dashboard
      router.push("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      {error && <p className="text-red-500">{error}</p>}
      
      <form onSubmit={otpSent ? handleOTPVerify : sendOTP} className="space-y-4">
        <input name="firstName" type="text" placeholder="First Name" onChange={handleChange} required />
        <input name="lastName" type="text" placeholder="Last Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <input name="phoneNumber" type="tel" placeholder="Phone Number" onChange={handleChange} required />
        
        {otpSent ? (
          <>
            <input name="otp" type="text" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} required />
            <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-md">Verify OTP</button>
          </>
        ) : (
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Send OTP</button>
        )}
      </form>

      <div id="recaptcha-container"></div>
    </div>
  );
}