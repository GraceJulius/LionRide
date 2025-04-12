"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

export default function RideProgressPage() {
  const { rideId } = useParams();
  const router = useRouter();

  const [ride, setRide] = useState(null);
  const [driverPosition, setDriverPosition] = useState(null);
  const [directions, setDirections] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    const fetchRideDetails = async () => {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
      try {
        const res = await fetch(`${baseUrl}/api/v1/rides/${rideId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        if (!res.ok) throw new Error("Failed to fetch ride details");
    
        const data = await res.json();
    
        // Check if pickupLat and pickupLng are missing
        if (!data.pickupLat || !data.pickupLng) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ address: data.pickupAddress }, (results, status) => {
            if (status === "OK" && results[0]) {
              const location = results[0].geometry.location;
              setRide({
                ...data,
                pickupLat: location.lat(),
                pickupLng: location.lng(),
              });
            } else {
              console.error("Failed to geocode pickup address:", status);
              setError("Invalid pickup coordinates");
            }
          });
        } else {
          setRide(data);
        }
    
      } catch (err) {
        setError(err.message);
      }
    };
    
    fetchRideDetails();
  }, [rideId]);

  useEffect(() => {
    const pollDriverLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setDriverPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        });
      }
    };

    pollDriverLocation();
    const interval = setInterval(pollDriverLocation, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoaded || !ride || !driverPosition) return;

    const pickupLat = Number(ride?.pickupLat);
    const pickupLng = Number(ride?.pickupLng);

    if (isNaN(pickupLat) || isNaN(pickupLng)) {
      console.error("Invalid pickup coordinates");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: driverPosition,
        destination: { lat: pickupLat, lng: pickupLng },
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

  const handleStartRide = async () => {
    const token = localStorage.getItem("token");
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/v1/rides/${rideId}/start`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Failed to start ride");
      }

      alert("Ride Started!");
      router.push(`/driver/ride/${rideId}/destination`);
    } catch (err) {
      console.error("Start Ride Error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!isLoaded || !ride || !driverPosition) return <p className="p-6">Loading map...</p>;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-orange-500">
        Heading to Pickup Location
      </h1>

      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        zoom={13}
        center={driverPosition}
      >
        {driverPosition && <Marker position={driverPosition} />}
        {ride?.pickupLat && ride?.pickupLng && (
          <Marker position={{ lat: Number(ride.pickupLat), lng: Number(ride.pickupLng) }} />
        )}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      <button
        onClick={handleStartRide}
        disabled={loading}
        className={`mt-6 w-full py-3 ${
          loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
        } text-white rounded-xl font-semibold transition`}
      >
        {loading ? "Starting Ride..." : "Start Ride"}
      </button>
    </div>
  );
}
