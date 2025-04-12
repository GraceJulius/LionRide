"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function DriverDetailsPage() {
  const { rideId } = useParams();
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDriverDetails = async () => {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      try {
        const rideRes = await fetch(`${baseUrl}/api/v1/rides/${rideId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!rideRes.ok) throw new Error("Failed to fetch ride details");

        const rideData = await rideRes.json();

        if (!rideData.driverUid) {
          throw new Error("Driver has not accepted this ride yet.");
        }

        const detailsRes = await fetch(`${baseUrl}/api/v1/rides/${rideId}/details`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!detailsRes.ok) throw new Error("Failed to fetch driver info");

        const detailsData = await detailsRes.json();
        setDetails(detailsData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchDriverDetails();
  }, [rideId]);

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!details) return <div className="p-6">Loading driver details...</div>;

  const {
    driverDetails: {
      name,
      vehicleMake,
      vehicleModel,
      licensePlate
    } = {},
  } = details;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Driver Assigned</h1>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-xl font-semibold mb-1">{name}</p>
        <p className="text-gray-700 mb-2">
          Vehicle: {vehicleMake} {vehicleModel}
        </p>
        <p className="text-gray-700 mb-2">Plate: {licensePlate}</p>
      </div>
    </div>
  );
}
