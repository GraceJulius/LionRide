//updated to not consider otp verification for now

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "../firebase/firebaseClient";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, phoneNumber } = formData;

    // Ensure the email is from Lincoln University
    if (!email.endsWith("@lincoln.edu") && !email.endsWith("@lions.lincoln.edu")) {
      setError("Only Lincoln University email addresses are allowed.");
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user); // Send email verification

      const idToken = await userCredential.user.getIdToken();

      // Register user in your backend
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const registrationEndpoint = `${baseUrl}/api/v1/users/register`;
      const response = await fetch(registrationEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify({ firstName, lastName, email, phoneNumber, userType: "RIDER" }),
      });

      if (!response.ok) throw new Error("Failed to register");

      router.push("/login"); // Redirect to login page after signup
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="firstName"
            type="text"
            placeholder="First Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            name="lastName"
            type="text"
            placeholder="Last Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            name="email"
            type="email"
            placeholder="@lincoln.edu"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            name="phoneNumber"
            type="tel"
            placeholder="Phone Number"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button type="submit" className="w-full bg-orange-500 text-white px-4 py-2 rounded-md">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-orange-500 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
