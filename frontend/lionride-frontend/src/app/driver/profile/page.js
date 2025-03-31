"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Image } from "next/image";


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
        const response = await fetch("/api/v1/drivers/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to load profile");
        const data = await response.json();
        setProfile(data);
        setUpdatedProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleChange = (e) => {
    setUpdatedProfile({ ...updatedProfile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/v1/drivers/update", {
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
      const response = await fetch("/api/v1/drivers/upload-profile-picture", {
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Driver Profile</h1>
      <div className="flex items-center mb-4">
        <Image
          src={profilePicture || profile.profilePicture || "/default-avatar.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <input type="file" onChange={handleFileChange} className="ml-4" />
      </div>
      {!editing ? (
        <div>
          <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phoneNumber}</p>
          <p><strong>Vehicle:</strong> {profile.vehicleMake} {profile.vehicleModel} ({profile.vehicleYear})</p>
          <p><strong>License Plate:</strong> {profile.licensePlateNumber}</p>
          <p><strong>Driver’s License:</strong> {profile.driverLicenseNumber} (Exp: {profile.licenseExpiryDate})</p>
          <button onClick={handleEdit} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">Edit Profile</button>
        </div>
      ) : (
        <div>
          <input 
          name="firstName" 
          value={updatedProfile.firstName} 
          onChange={handleChange} 
          className="border p-2 w-full" />

          <input 
          name="lastName" 
          value={updatedProfile.lastName} 
          onChange={handleChange} 
          className="border p-2 w-full mt-2" />
          
          <input 
          name="phoneNumber" 
          value={updatedProfile.phoneNumber} 
          onChange={handleChange} 
          className="border p-2 w-full mt-2" />

          <button 
          onClick={handleSave} 
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md">Save</button>
        </div>
      )}
    </div>
  );
}
