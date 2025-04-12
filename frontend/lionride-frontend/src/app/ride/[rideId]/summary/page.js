"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function RideSummaryPage() {
  const { rideId } = useParams();
  const router = useRouter();
  const [ride, setRide] = useState(null);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchRide = async () => {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      try {
        const response = await fetch(`${baseUrl}/api/v1/rides/${rideId}/details`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch ride details");
        const data = await response.json();
        setRide(data);
      } catch (err) {
        setError("Unable to load ride summary");
        console.error(err);
      }
    };

    fetchRide();
  }, [rideId]);

  const handleRateDriver = (newRating) => {
    setRating(newRating);
    alert(`Thank you! You rated this driver ${newRating} star${newRating > 1 ? "s" : ""}.`);
    // Optional: send rating to backend here
  };

  if (error) return <p>{error}</p>;
  if (!ride) return <p>Loading ride summary...</p>;

  const { pickupAddress, destinationAddress, estimatedFare, driverDetails } = ride;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-6">
      <h1 className="text-3xl font-bold text-orange-500 mb-8">Ride Completed!</h1>

      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full space-y-6 text-center">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Trip Summary</h2>

        <p><span className="font-medium text-gray-500">From:</span> {pickupAddress}</p>
        <p><span className="font-medium text-gray-500">To:</span> {destinationAddress}</p>

        <p className="text-xl font-bold text-blue-600 mt-4">
          Total Fare: ${estimatedFare}
        </p>

        <div className="border-t border-gray-200 my-4"></div>

        <h3 className="text-lg font-semibold text-gray-700">Your Driver</h3>
        <p className="font-medium">{driverDetails?.name}</p>
        <p className="text-gray-500">{driverDetails?.vehicleMake} {driverDetails?.vehicleModel} - {driverDetails?.licensePlate}</p>

        <div className="border-t border-gray-200 my-4"></div>

        <h4 className="font-medium mb-2">Rate Your Driver</h4>

        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRateDriver(star)}
              className={`text-3xl ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              } hover:scale-125 transition`}
            >
              ★
            </button>
          ))}
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 w-full py-3 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90 transition"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
