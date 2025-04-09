/*do not forget to update*/

"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function DriverDetailsPage() {
  const { rideId } = useParams();
  const [driver, setDriver] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDriver = async () => {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      try {
        const response = await fetch(`${baseUrl}/api/v1/rides/${rideId}/driver`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        //log to check what the problem is when a ride is requested
        const responseText = await response.text(); // log raw text
          console.log("Driver fetch status:", response.status);
          console.log("Driver fetch body:", responseText);


        if (!response.ok) throw new Error("Failed to fetch driver info");

        const data = await response.json();
        setDriver(data);
      } catch (err) {
        console.error(err);
        setError("Could not load driver information.");
      }
    };

    fetchDriver();
  }, [rideId]);

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!driver) return <div className="p-6">Loading driver details...</div>;

  const {
    firstName,
    lastName,
    vehicle_make,
    vehicle_model,
    vehicle_year,
    license_plate,
    average_rating,
    total_trips,
  } = driver;

  const fullName = `${firstName} ${lastName}`;
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Driver Assigned</h1>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-xl font-semibold mb-1">{fullName}</p>
        <p className="text-gray-700 mb-2">
          Vehicle: {vehicle_year} {vehicle_make} {vehicle_model}
        </p>
        <p className="text-gray-700 mb-2">Plate: {license_plate}</p>
        <p className="text-gray-600 text-sm">Rating: ⭐ {average_rating}</p>
        <p className="text-gray-600 text-sm">Total Trips: {total_trips}</p>
      </div>
    </div>
  );
}
