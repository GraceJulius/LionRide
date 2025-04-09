//updated to use firebase auth to sign in

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase/firebaseClient";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      // Store token securely (use context or HTTP-only cookies in production)
      localStorage.setItem("token", idToken);

      router.push("/driver/dashboard"); // Redirect after successful login
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center">
      <div className="bg-white p-8 rounded-md shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login to LionRide</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mb-4"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mb-4"
          />
          <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded">
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Do not have an account? <a href="/driver/signup" className="text-orange-500">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
