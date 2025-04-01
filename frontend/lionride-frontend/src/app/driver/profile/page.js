"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DriverProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const token = localStorage.getItem("token");

        const [userRes, driverRes] = await Promise.all([
          fetch(`${baseURL}/api/v1/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${baseURL}/api/v1/driver/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!userRes.ok || !driverRes.ok) throw new Error("Failed to load profile");

        const userData = await userRes.json();
        const driverData = await driverRes.json();

        const merged = { ...userData, ...driverData };

        setProfile(merged);
        setUpdatedProfile(merged);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleEdit = () => setEditing(true);

  const handleChange = (e) => {
    setUpdatedProfile({ ...updatedProfile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const updateEndpoint = `${baseURL}/api/v1/driver/update`;
      const response = await fetch(updateEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedProfile),
      });
      if (!response.ok) throw new Error("Update failed");
      setProfile(updatedProfile);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profilePicture", file);
    try {
      const response = await fetch("/api/v1/driver/upload-profile-picture", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to upload image");
      const data = await response.json();
      setProfilePicture(data.imageUrl);
    } catch (err) {
      setError(err.message);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return (
        <div className="flex items-center space-x-1">
          {[...Array(fullStars)].map((_, i) => (
              <span key={`full-${i}`} className="text-yellow-500">★</span>
          ))}
          {[...Array(emptyStars)].map((_, i) => (
              <span key={`empty-${i}`} className="text-gray-300">★</span>
          ))}
        </div>
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-700">
              Hi {profile.firstName}, Welcome back!
            </h2>
            <p className="text-gray-600 mt-2">Total Trips: {profile.totalTrips}</p>
            <div className="text-gray-600 flex items-center gap-2">
              Average Rating: {profile.averageRating?.toFixed(2)}
              {renderStars(profile.averageRating || 0)}
            </div>
          </div>
          {!editing && (
              <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Edit Profile
              </button>
          )}
        </div>

        {!editing ? (
            <div>
              <p><strong>Vehicle:</strong> {profile.vehicleMake} {profile.vehicleModel} ({profile.vehicleYear})</p>
              <p><strong>License Plate:</strong> {profile.licensePlate}</p>
              {/* Optionally add the file upload preview section back here */}
            </div>
        ) : (
            <div>
              <input
                  name="firstName"
                  value={updatedProfile.firstName}
                  onChange={handleChange}
                  className="border p-2 w-full"
              />
              <input
                  name="lastName"
                  value={updatedProfile.lastName}
                  onChange={handleChange}
                  className="border p-2 w-full mt-2"
              />
              <input
                  name="phoneNumber"
                  value={updatedProfile.phoneNumber}
                  onChange={handleChange}
                  className="border p-2 w-full mt-2"
              />
              <button
                  onClick={handleSave}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Save
              </button>
            </div>
        )}
      </div>
  );
}
