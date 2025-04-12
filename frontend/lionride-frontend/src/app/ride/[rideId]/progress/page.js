"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

export default function RiderProgressPage() {
  const { rideId } = useParams();
  const router = useRouter();

  const [ride, setRide] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [error, setError] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    const fetchRideAndDriver = async () => {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      try {
        const rideRes = await fetch(`${baseUrl}/api/v1/rides/${rideId}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        const driverRes = await fetch(`${baseUrl}/api/v1/rides/${rideId}/progress`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        if (!rideRes.ok || !driverRes.ok) throw new Error("Failed to fetch ride or driver data");

        const rideData = await rideRes.json();
        const driverData = await driverRes.json();

        console.log("Ride Status Direct from Ride API:", rideData.status);
        console.log("Ride Status from Progress API:", driverData.rideStatus);

        setRide(rideData);
        setDriverLocation({
          lat: driverData.driverLocation.lat,
          lng: driverData.driverLocation.lng,
        });

        if (isLoaded) {
          const directionsService = new window.google.maps.DirectionsService();
          directionsService.route(
            {
              origin: { lat: driverData.driverLocation.lat, lng: driverData.driverLocation.lng },
              destination: { lat: rideData.pickupLat, lng: rideData.pickupLng },
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === "OK") {
                setDirections(result);
              }
            }
          );
        }

        // Handle Ride Status Navigation
        if (rideData.status === "Pending") {
          // Waiting for driver
        } else if (rideData.status === "Accepted" || rideData.status === "InProgress") {
          if (!window.location.pathname.includes(`/ride/${rideId}/progress`)) {
            router.push(`/ride/${rideId}/progress`);
          }
        } else if (rideData.status === "Completed") {
          if (!window.location.pathname.includes(`/ride/${rideId}/summary`)) {
            router.push(`/ride/${rideId}/summary`);
          }
        } else if (rideData.status === "Cancelled") {
          if (!window.location.pathname.includes(`/dashboard`)) {
            router.push(`/dashboard`);
          }
        }

      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchRideAndDriver();

    const interval = setInterval(fetchRideAndDriver, 5000);
    return () => clearInterval(interval);
  }, [rideId, isLoaded, router]);

  if (!isLoaded || !ride || !driverLocation) return <p>Loading map...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-orange-500">
        Driver is coming to pick you up!
      </h1>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={driverLocation}
      >
        <Marker position={driverLocation} />
        <Marker position={{ lat: ride.pickupLat, lng: ride.pickupLng }} />
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  );
}
