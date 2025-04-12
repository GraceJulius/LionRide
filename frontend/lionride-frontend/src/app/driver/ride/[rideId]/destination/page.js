"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

export default function RideDestinationPage() {
  const { rideId } = useParams();
  const router = useRouter();
  const [ride, setRide] = useState(null);
  const [driverPosition, setDriverPosition] = useState(null);
  const [directions, setDirections] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const geocodeAddress = (address) => {
    return new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK" && results[0]) {
          const location = results[0].geometry.location;
          resolve({ lat: location.lat(), lng: location.lng() });
        } else {
          reject(`Geocode failed: ${status}`);
        }
      });
    });
  };

  const fetchRide = async () => {
    const token = localStorage.getItem("token");
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const response = await fetch(`${baseUrl}/api/v1/rides/${rideId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch ride");

      const data = await response.json();

      const pickupCoords = await geocodeAddress(data.pickupAddress);
      const destinationCoords = await geocodeAddress(data.destinationAddress);

      setRide({
        ...data,
        pickupLat: pickupCoords.lat,
        pickupLng: pickupCoords.lng,
        destinationLat: destinationCoords.lat,
        destinationLng: destinationCoords.lng,
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setDriverPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        });
      }

    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchRide();
  }, [rideId]);

  useEffect(() => {
    if (!ride) return;

    const interval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setDriverPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [ride]);

  useEffect(() => {
    if (!isLoaded || !ride || !driverPosition) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: driverPosition,
        // destination: { lat: ride.destinationLat, lng: ride.destinationLng },
        destination: ride.destinationAddress,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        } else {
          console.error("Directions error:", status);
        }
      }
    );
  }, [isLoaded, ride, driverPosition]);

  const handleCompleteRide = async () => {
    const token = localStorage.getItem("token");
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/api/v1/rides/${rideId}/complete`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to complete ride");

      alert("Ride Completed!");

      router.push("/driver/dashboard");
    } catch (err) {
      console.error("Complete Ride Error:", err);
      alert("Failed to complete ride");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!isLoaded || !ride || !driverPosition) return <p className="p-6">Loading map...</p>;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-orange-500">
        Heading to Destination
      </h1>

      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        zoom={13}
        center={driverPosition}
      >
        <Marker position={driverPosition} />
        <Marker position={{ lat: ride.destinationLat, lng: ride.destinationLng }} />
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      <button
        onClick={handleCompleteRide}
        disabled={loading}
        className={`mt-6 w-full py-3 ${
          loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
        } text-white rounded-xl font-semibold transition`}
      >
        {loading ? "Completing Ride..." : "Complete Ride"}
      </button>
    </div>
  );
}
