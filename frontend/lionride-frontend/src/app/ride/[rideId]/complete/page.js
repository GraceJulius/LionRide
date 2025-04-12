"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function RideCompletePage() {
  const { rideId } = useParams();
  const router = useRouter();

  const [ride, setRide] = useState(null);
  const [rating, setRating] = useState(5); // default rating
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRide = async () => {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      try {
        const response = await fetch(`${baseUrl}/api/v1/rides/${rideId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch ride");

        const data = await response.json();
        setRide(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRide();
  }, [rideId]);

  const handleSubmitRating = async () => {
    const token = localStorage.getItem("token");
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const response = await fetch(`${baseUrl}/api/v1/rides/${rideId}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating }),
      });

      if (!response.ok) throw new Error("Failed to submit rating");

      alert("Thank you for rating your driver!");
      router.push("/dashboard"); // Go back to dashboard
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6">
      <h1 className="text-2xl font-bold mb-4 text-orange-500">Ride Completed!</h1>
      <p className="mb-2">Thank you for riding with LionRide 🚗</p>

      <div className="mb-4">
        <p className="text-lg mb-2 font-medium text-gray-700">Rate Your Driver</p>
        <input
          type="range"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          className="w-full"
        />
        <p className="text-center mt-1">{rating} Stars</p>
      </div>

      <button
        onClick={handleSubmitRating}
        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
      >
        Submit Rating
      </button>
    </div>
  );
}
