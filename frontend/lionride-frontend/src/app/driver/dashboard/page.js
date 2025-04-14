"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DriverDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ridesLoading, setRidesLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [availableRides, setAvailableRides] = useState([]);
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
        /* updated so there can be a check to see if driver's 
         profile exists when fetching it*/

        if (!userRes.ok )
          throw new Error("Failed to load user profile");
        if (!driverRes.ok){
          /*if driver profile is not found, will redirect to
          signup page*/
          router.push("/driver/signup");
          return;
        }

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

  // Function to fetch available rides from the backend
  const fetchAvailableRides = async () => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = localStorage.getItem("token");
      const res = await fetch(`${baseURL}/api/v1/rides/available`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load available rides");
      const rides = await res.json();
      setAvailableRides(rides);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setRidesLoading(false);
    }
  };

  // Polling mechanism: fetch available rides every 10 seconds
  useEffect(() => {
    // Fetch immediately on mount
    fetchAvailableRides();

    const intervalId = setInterval(() => {
      fetchAvailableRides();
    }, 10000); // 10 seconds

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Handle accepting a ride using the PUT /api/v1/rides/{rideId}/accept endpoint
  const handleAcceptRide = async (rideId) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = localStorage.getItem("token");
      const response = await fetch(`${baseURL}/api/v1/rides/${rideId}/accept`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to accept ride");
      }
      // Navigate to the ride details/navigation page upon successful acceptance
      // router.push(`/driver/ride/${rideId}`);
      router.push(`/driver/ride/${rideId}/progress`);
    } catch (err) {
      setError(err.message);
    }
  };

  // Profile editing functions
  const handleEdit = () => setEditing(true);

  const handleChange = (e) => {
    setUpdatedProfile({ ...updatedProfile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const updateEndpoint = `${baseURL}/api/v1/driver/profile`;
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

  //will probably remove this
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

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
      <div className="max-w-5xl mx-auto p-6">
        {/* Profile Section */}
        <div className="mb-8 bg-white shadow-md p-6 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">
                Hi {profile?.firstName}, Welcome back!
              </h2>
              <p className="text-gray-600 mt-2">Total Trips: {profile?.totalTrips}</p>
              <div className="text-gray-600 flex items-center gap-2">
                Average Rating: {profile?.averageRating?.toFixed(2)}
                {renderStars(profile?.averageRating || 0)}
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
                <p>
                  <strong>Vehicle:</strong> {profile?.vehicleMake} {profile?.vehicleModel} ({profile?.vehicleYear})
                </p>
                <p>
                  <strong>License Plate:</strong> {profile?.licensePlate}
                </p>
              </div>
          ) : (
              <div className="flex flex-col gap-2">
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
                    className="border p-2 w-full"
                />
                <input
                    name="phoneNumber"
                    value={updatedProfile.phoneNumber}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
                <button
                    onClick={handleSave}
                    className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
          )}
        </div>

        {/* Available Rides Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Available Rides</h3>
          {ridesLoading ? (
              <p>Loading available rides...</p>
          ) : availableRides.length === 0 ? (
              <p>No rides available at the moment.</p>
          ) : (
              <div className="grid grid-cols-1 gap-4">
                {availableRides.map((ride) => (
                    <div
                        key={ride.rideId}
                        className="p-4 border rounded-lg flex flex-col md:flex-row items-start justify-between"
                    >
                      <div>
                        <p><strong>Pickup:</strong> {ride.pickupAddress}</p>
                        <p><strong>Destination:</strong> {ride.destinationAddress}</p>
                        <p><strong>Fare Estimate:</strong> ${ride.estimatedFare}</p>
                      </div>
                      <button
                          onClick={() => handleAcceptRide(ride.rideId)}
                          className="mt-2 md:mt-0 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Accept Ride
                      </button>
                    </div>
                ))}
              </div>
          )}
        </div>

        {/* Error Message */}
        {error && <div className="mt-4 text-red-500">Error: {error}</div>}
      </div>
  );
}
