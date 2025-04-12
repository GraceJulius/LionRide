"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "../../firebase/firebaseClient"; // Adjust path if necessary
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

export default function DriverSignup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    licensePlate: "",
    driverLicenseNumber: "",
    licenseExpiry: "",
  });

  const [error, setError] = useState("");
  const router = useRouter();
  //loading state for when submitted
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [month, day, year] = parts;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return dateString; // Return as-is if already correct
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); //shows loading immediately
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      licensePlate,
      driverLicenseNumber,
      licenseExpiry,
    } = formData;
   
    // Ensure the email is from Lincoln University
    if (!email.endsWith("@lincoln.edu") && !email.endsWith("@lions.lincoln.edu")) {
      setError("Only Lincoln University email addresses are allowed.");
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
    
      const idToken = await userCredential.user.getIdToken();
    
      // Base URL for the backend
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    
      // Register user in the backend
      const registrationEndpoint = `${baseURL}/api/v1/users/register`;
      const userResponse = await fetch(registrationEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber,
          userType: "DRIVER",
        }),
      });
    
      if (!userResponse.ok) throw new Error("Failed to register user");
    
      // Register driver details in the backend
      const driverDetailRegistrationEndpoint = `${baseURL}/api/v1/driver/register`;
      const driverResponse = await fetch(driverDetailRegistrationEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          vehicleMake,
          vehicleModel,
          vehicleYear,
          licensePlate,
          driverLicenseNumber,
          licenseExpiry: formatDate(licenseExpiry),
        }),
      });
    
      if (!driverResponse.ok) throw new Error("Failed to register driver details");
    
      // Redirect to login page after successful registration
      router.push("/driver/login");
    } catch (err) {
      setError(err.message);
    } finally{
      setLoading(false); //hides loading regardless of success or error
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Driver Sign Up</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            name="firstName" 
            type="text" 
            placeholder="First Name" 
            onChange={handleChange}
            required 
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
          
          <input 
            name="lastName" 
            type="text" 
            placeholder="Last Name" 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
          
          <input 
            name="email" 
            type="email" 
            placeholder="@lincoln.edu" 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
          
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
          
          <input 
            name="phoneNumber" 
            type="tel" 
            placeholder="Phone Number" 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />

          <h2 className="text-lg font-semibold mt-4">Vehicle Information</h2>
          <input 
            name="vehicleMake" 
            type="text" 
            placeholder="Vehicle Make" 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
          
          <input 
            name="vehicleModel" 
            type="text" 
            placeholder="Vehicle Model" 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
          
          <input 
            name="vehicleYear" 
            type="number" 
            placeholder="Vehicle Year" 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
          
          <input 
            name="licensePlate" 
            type="text" 
            placeholder="License Plate Number" 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
          
          <input 
            name="driverLicenseNumber" 
            type="text" 
            placeholder="Driver’s License Number" 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />
          
          <input 
            name="licenseExpiry" 
            type="date" 
            placeholder="License Expiry Date" 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" />

          <button 
          type="submit"
          //updated to prevent the user from pressing the submit button multiple times
          disabled={loading}
          className= { `w-full px-4 py-2 rounded-md text-white ${loading ?  "bg-orange-500 cursor-not-allowed" : "bg-orange-500"}`}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <a href="/driver/login" className="text-orange-500 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
