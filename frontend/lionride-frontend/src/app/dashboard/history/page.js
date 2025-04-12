"use client";
import { useEffect, useState } from "react";

export default function RideHistoryPage() {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/rides/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRides(data);
    };
    fetchHistory();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Ride History</h1>
      {rides.length === 0 ? (
        <p>No past rides yet.</p>
      ) : (
        rides.map((ride) => (
          <div key={ride.id} className="border p-4 mb-4 rounded-xl bg-white">
            <p>From: {ride.pickupAddress}</p>
            <p>To: {ride.destinationAddress}</p>
            <p>Status: {ride.status}</p>
          </div>
        ))
      )}
    </div>
  );
}
