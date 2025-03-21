"use client"; // Required for Next.js App Router
import { useState } from "react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");

  // Function to validate email domain
  const validateEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@lions\.lincoln\.edu$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !gender) {
      setError("All fields are required!");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please use your school email (@lions.lincoln.edu).");
      return;
    }

    alert("Signup successful!");
    console.log("User Data:", { name, email, gender });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-md shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>

        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

        {/* Name Field */}
        <label className="block text-sm font-semibold mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />

        {/* Email Field */}
        <label className="block text-sm font-semibold mt-3 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full rounded"
          placeholder="@lions.lincoln.edu"
          required
        />

        {/* Gender Dropdown */}
        <label className="block text-sm font-semibold mt-3 mb-1">Gender</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="border p-2 w-full rounded"
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        {/* Sign Up Button */}
        <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded w-full mt-4">
          Sign Up
        </button>

        {/* Already have an account? */}
        <p className="text-center text-sm mt-4">
          Already have an account? <a href="/login" className="text-blue-500">Sign in</a>
        </p>
      </form>
    </div>
  );
}
