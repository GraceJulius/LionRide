"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

export default function RideDestinationTrackingPage() {
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
        });

        if (!rideRes.ok) throw new Error("Failed to fetch ride");

        const rideData = await rideRes.json();
        setRide(rideData);

        const driverRes = await fetch(`${baseUrl}/api/v1/rides/${rideId}/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!driverRes.ok) throw new Error("Failed to fetch driver location");

        const driverData = await driverRes.json();
        setDriverLocation({
          lat: driverData.lat,
          lng: driverData.lng,
        });

        if (isLoaded) {
          const directionsService = new window.google.maps.DirectionsService();
          directionsService.route(
            {
              origin: { lat: driverData.lat, lng: driverData.lng },
              destination: { lat: rideData.destinationLat, lng: rideData.destinationLng },
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === "OK") {
                setDirections(result);
              }
            }
          );
        }

        if (rideData.status === "Completed") {
          router.push(`/ride/${rideId}/complete`);
        }

      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchRideAndDriver();

    const interval = setInterval(fetchRideAndDriver, 5000); // Polling every 5 seconds

    return () => clearInterval(interval);
  }, [rideId, isLoaded, router]);

  if (!isLoaded || !ride || !driverLocation) return <p>Loading map...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-orange-500">
        Heading to Destination...
      </h1>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={driverLocation}
      >
        {/* Driver Marker */}
        <Marker position={driverLocation} />

        {/* Destination Marker */}
        <Marker position={{ lat: ride.destinationLat, lng: ride.destinationLng }} />

        {/* Route */}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  );
}
