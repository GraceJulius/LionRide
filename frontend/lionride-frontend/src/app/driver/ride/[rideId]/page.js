"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

export default function DriverRidePage() {
  const { rideId } = useParams();
  const router = useRouter();

  const [ride, setRide] = useState(null);
  const [directions, setDirections] = useState(null);
  const [error, setError] = useState(null);
  const [loadingStart, setLoadingStart] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const fetchRideDetails = async () => {
    const token = localStorage.getItem("token");
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const res = await fetch(`${baseURL}/api/v1/rides/${rideId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to fetch ride details");

      const data = await res.json();
      setRide(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const getDirections = (pickupAddress) => {
    if (!isLoaded || !pickupAddress) return;

    navigator.geolocation.getCurrentPosition((position) => {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          destination: pickupAddress,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            setDirections(result);
          } else {
            console.error("Directions failed:", status);
          }
        }
      );
    });
  };

  const handleStartRide = async () => {
    setLoadingStart(true);
    const token = localStorage.getItem("token");
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const response = await fetch(`${baseUrl}/api/v1/rides/${rideId}/start`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to start ride");

      alert("Ride started successfully!");
      router.push(`/driver/ride/${rideId}/progress`);
    } catch (err) {
      console.error(err);
      alert("Failed to start ride");
    } finally {
      setLoadingStart(false);
    }
  };

  const handleCompleteRide = async () => {
    setLoadingComplete(true);
    const token = localStorage.getItem("token");
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const response = await fetch(`${baseUrl}/api/v1/rides/${rideId}/complete`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to complete ride");

      alert("Ride completed successfully!");

      await new Promise((resolve) => setTimeout(resolve, 3000));

      router.push(`/driver/dashboard`);
    } catch (err) {
      console.error(err);
      alert("Failed to complete ride");
    } finally {
      setLoadingComplete(false);
    }
  };

  useEffect(() => {
    fetchRideDetails();
  }, [rideId]);

  useEffect(() => {
    if (ride) {
      getDirections(ride.pickupAddress);
    }
  }, [isLoaded, ride]);

  if (!ride) return <p>Loading ride details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-orange-600">Ride Details</h1>

      <div className="bg-white rounded shadow p-4">
        <p><strong>Pickup:</strong> {ride.pickupAddress}</p>
        <p><strong>Destination:</strong> {ride.destinationAddress}</p>
        <p><strong>Estimated Fare:</strong> ${ride.estimatedFare}</p>
      </div>

      <div className="border rounded overflow-hidden">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          center={{ lat: 39.809, lng: -75.931 }}
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>

      <button
        onClick={handleStartRide}
        disabled={loadingStart}
        className={`w-full py-3 rounded text-white font-bold bg-orange-600 hover:bg-orange-700 ${loadingStart ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loadingStart ? "Starting Ride..." : "Start Ride"}
      </button>

      <button
        onClick={handleCompleteRide}
        disabled={loadingComplete}
        className={`w-full py-3 rounded text-white font-bold bg-green-600 hover:bg-green-700 ${loadingComplete ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loadingComplete ? "Completing Ride..." : "Complete Ride"}
      </button>
    </div>
  );
}
