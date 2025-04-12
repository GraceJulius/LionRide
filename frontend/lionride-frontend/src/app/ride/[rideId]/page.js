"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

export default function RideDetailsPage() {
  const { rideId } = useParams();
  const router = useRouter();
  const [ride, setRide] = useState(null);
  const [directions, setDirections] = useState(null);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleCancelRide = async () => {
    const confirm = window.confirm("Are you sure you want to cancel this ride?");
    if (!confirm) return;

    const token = localStorage.getItem("token");
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const response = await fetch(`${baseUrl}/api/v1/rides/${rideId}/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Cancelled" }),
      });

      if (!response.ok) throw new Error("Failed to cancel ride");

      router.push("/dashboard");
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Could not cancel ride. See console for details.");
    }
  };

  const handleRequestRide = async () => {
    const token = localStorage.getItem("token");
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const response = await fetch(`${baseUrl}/api/v1/rides/${rideId}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Requested" }),
      });

      if (!response.ok) throw new Error("Failed to request ride");

      alert("Ride Requested Successfully");

    } catch (err) {
      console.error("Request error:", err);
      alert("Could not request ride.");
    }
  };

  // Poll ride status every 5 sec
  useEffect(() => {
    if (!rideId) return;

    const interval = setInterval(async () => {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      try {
        const response = await fetch(`${baseUrl}/api/v1/rides/${rideId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch ride");

        const updatedRide = await response.json();
        setRide(updatedRide);

        console.log("Polling ride status:", updatedRide.status);

        if (updatedRide.status === "Accepted") {
          clearInterval(interval);
          router.push(`/ride/${rideId}/driver`);
        }

        if (updatedRide.status === "Completed") {
          clearInterval(interval);
          router.push(`/ride/${rideId}/summary`);
        }

      } catch (err) {
        console.error("Ride polling error:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [rideId, ride?.status]);

  // Poll driver progress every 5 sec
  useEffect(() => {
    if (!ride) return;

    const interval = setInterval(async () => {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      try {
        const response = await fetch(`${baseUrl}/api/v1/rides/${rideId}/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch ride progress");

        const progressData = await response.json();

        if (progressData.driverLocation) {
          const directionsService = new window.google.maps.DirectionsService();
          directionsService.route(
            {
              origin: progressData.driverLocation,
              destination: ride.pickupAddress,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === "OK") {
                setDirections(result);
              }
            }
          );
        }

      } catch (err) {
        console.error("Progress polling error:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [ride, rideId]);

  if (error) return <p>{error}</p>;
  if (!isLoaded) return <p>Loading map...</p>;
  if (!ride) return <p>Loading ride info...</p>;

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <header className="flex justify-between items-center px-6 py-4 shadow-md bg-white dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-orange-600 dark:text-orange-400">LionRide</h1>
        <button
          onClick={toggleDarkMode}
          className="text-sm px-3 py-1 border rounded-md dark:border-white border-black hover:bg-blue-100 dark:hover:bg-orange-800"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </header>

      <main className="p-6 max-w-3xl mx-auto space-y-6">
        <div className="bg-white/70 dark:bg-gray-700/40 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
          <h2 className="text-lg mb-3 font-semibold tracking-wide">Ride Summary</h2>
          <p><span className="text-gray-500">From:</span> {ride.pickupAddress}</p>
          <p><span className="text-gray-500">To:</span> {ride.destinationAddress}</p>
          <p className="mt-3 text-xl font-bold text-blue-700 dark:text-orange-300">
            Estimated Fare: ${ride.estimatedFare}
          </p>
        </div>

        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 shadow-md">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={13}
            center={{ lat: 39.809, lng: -75.931 }}
          >
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleRequestRide}
            className="flex-1 py-3 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90 transition"
          >
            Request Ride
          </button>

          <button
            onClick={handleCancelRide}
            className="flex-1 py-3 rounded-xl border border-red-600 text-red-600 font-bold text-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition"
          >
            Cancel Ride
          </button>
        </div>
      </main>
    </div>
  );
}
